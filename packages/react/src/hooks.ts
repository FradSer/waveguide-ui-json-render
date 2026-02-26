"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { UITree, UIElement, JsonPatch } from "@json-render/core";
import { setByPath } from "@json-render/core";

/**
 * Parse incomplete JSON from streaming response
 * Tries to find and parse a complete JSON object from the buffer
 */
export function parsePartialJson(buffer: string): UITree | null {
  const trimmed = buffer.trim();
  if (!trimmed) {
    return null;
  }

  // Try to parse directly first
  try {
    const parsed = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === "object" &&
      "root" in parsed &&
      "elements" in parsed
    ) {
      return parsed as UITree;
    }
  } catch {
    // Not valid JSON yet
  }

  // Try to extract JSON from various formats
  // Match JSON object from within text (e.g., "data: {...}\n...")
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (
        parsed &&
        typeof parsed === "object" &&
        "root" in parsed &&
        "elements" in parsed
      ) {
        return parsed as UITree;
      }
    } catch {
      // Invalid JSON in match
    }
  }

  return null;
}

/**
 * Parse a single JSON patch line
 */
function parsePatchLine(line: string): JsonPatch | null {
  try {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) {
      return null;
    }
    return JSON.parse(trimmed) as JsonPatch;
  } catch {
    return null;
  }
}

/**
 * Apply a JSON patch to the current tree
 */
function applyPatch(tree: UITree, patch: JsonPatch): UITree {
  const newTree = { ...tree, elements: { ...tree.elements } };

  switch (patch.op) {
    case "set":
    case "add":
    case "replace": {
      // Handle root path
      if (patch.path === "/root") {
        newTree.root = patch.value as string;
        return newTree;
      }

      // Handle elements paths
      if (patch.path.startsWith("/elements/")) {
        const pathParts = patch.path.slice("/elements/".length).split("/");
        const elementKey = pathParts[0];

        if (!elementKey) return newTree;

        if (pathParts.length === 1) {
          // Setting entire element
          newTree.elements[elementKey] = patch.value as UIElement;
        } else {
          // Setting property of element
          const element = newTree.elements[elementKey];
          if (element) {
            const propPath = "/" + pathParts.slice(1).join("/");
            const newElement = { ...element };
            setByPath(
              newElement as unknown as Record<string, unknown>,
              propPath,
              patch.value,
            );
            newTree.elements[elementKey] = newElement;
          }
        }
      }
      break;
    }
    case "remove": {
      if (patch.path.startsWith("/elements/")) {
        const elementKey = patch.path.slice("/elements/".length).split("/")[0];
        if (elementKey) {
          const { [elementKey]: _, ...rest } = newTree.elements;
          newTree.elements = rest;
        }
      }
      break;
    }
  }

  return newTree;
}

/**
 * Options for useUIStream
 */
export interface UseUIStreamOptions {
  /** API endpoint */
  api: string;
  /** Response mode: 'patch' for JSONL (default), 'full' for complete JSON */
  mode?: "patch" | "full";
  /** Callback when complete */
  onComplete?: (tree: UITree) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Return type for useUIStream
 */
export interface UseUIStreamReturn {
  /** Current UI tree */
  tree: UITree | null;
  /** Whether currently waiting for first response (thinking) */
  isThinking: boolean;
  /** Whether currently streaming data */
  isStreaming: boolean;
  /** Error if any */
  error: Error | null;
  /** Send a prompt to generate UI */
  send: (prompt: string, context?: Record<string, unknown>) => Promise<void>;
  /** Retry the last request */
  retry: () => Promise<void>;
  /** Clear the current tree */
  clear: () => void;
}

/**
 * Hook for streaming UI generation
 */
export function useUIStream({
  api,
  mode = "patch",
  onComplete,
  onError,
}: UseUIStreamOptions): UseUIStreamReturn {
  const [tree, setTree] = useState<UITree | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasReceivedDataRef = useRef(false);
  const lastRequestRef = useRef<{
    prompt: string;
    context?: Record<string, unknown>;
  } | null>(null);

  const clear = useCallback(() => {
    setTree(null);
    setError(null);
  }, []);

  const send = useCallback(
    async (prompt: string, context?: Record<string, unknown>) => {
      // Store for retry
      lastRequestRef.current = { prompt, context };

      // Abort any existing request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsThinking(true);
      setIsStreaming(true);
      setError(null);
      hasReceivedDataRef.current = false;

      // Start with an empty tree
      let currentTree: UITree = { root: "", elements: {} };
      setTree(currentTree);

      try {
        const response = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            context,
            currentTree,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        if (mode === "full") {
          // Full JSON mode: accumulate and parse complete JSON
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Try to parse the complete JSON
            const parsed = parsePartialJson(buffer);
            if (parsed && !hasReceivedDataRef.current) {
              hasReceivedDataRef.current = true;
              setIsThinking(false);
              currentTree = parsed;
              setTree({ ...currentTree });
            } else if (parsed) {
              currentTree = parsed;
              setTree({ ...currentTree });
            }
          }

          // Final attempt to parse
          const final = parsePartialJson(buffer);
          if (final) {
            currentTree = final;
            setTree({ ...currentTree });
          }
        } else {
          // Patch mode: process JSONL lines
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process complete lines
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const patch = parsePatchLine(line);
              if (patch) {
                if (!hasReceivedDataRef.current) {
                  hasReceivedDataRef.current = true;
                  setIsThinking(false);
                }
                currentTree = applyPatch(currentTree, patch);
                setTree({ ...currentTree });
              }
            }
          }

          // Process any remaining buffer
          if (buffer.trim()) {
            const patch = parsePatchLine(buffer);
            if (patch) {
              if (!hasReceivedDataRef.current) {
                hasReceivedDataRef.current = true;
                setIsThinking(false);
              }
              currentTree = applyPatch(currentTree, patch);
              setTree({ ...currentTree });
            }
          }
        }

        onComplete?.(currentTree);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      } finally {
        setIsThinking(false);
        setIsStreaming(false);
      }
    },
    [api, mode, onComplete, onError],
  );

  // Retry function - calls the last request again
  const retry = useCallback(async () => {
    if (!lastRequestRef.current) {
      return;
    }
    const { prompt, context } = lastRequestRef.current;
    await send(prompt, context);
  }, [send]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    tree,
    isThinking,
    isStreaming,
    error,
    send,
    retry,
    clear,
  };
}

/**
 * Convert a flat element list to a UITree
 */
export function flatToTree(
  elements: Array<UIElement & { parentKey?: string | null }>,
): UITree {
  const elementMap: Record<string, UIElement> = {};
  let root = "";

  // First pass: add all elements to map
  for (const element of elements) {
    elementMap[element.key] = {
      key: element.key,
      type: element.type,
      props: element.props,
      children: [],
      visible: element.visible,
    };
  }

  // Second pass: build parent-child relationships
  for (const element of elements) {
    if (element.parentKey) {
      const parent = elementMap[element.parentKey];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(element.key);
      }
    } else {
      root = element.key;
    }
  }

  return { root, elements: elementMap };
}
