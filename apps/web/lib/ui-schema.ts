import { z } from "zod";

const COMPONENT_TYPES = [
  "Card",
  "Stack",
  "Divider",
  "Input",
  "Button",
  "Heading",
  "Text",
  "Badge",
  "Progress",
] as const;

export type ComponentType = (typeof COMPONENT_TYPES)[number];

const elementSchema = z.object({
  key: z.string(),
  type: z.enum(COMPONENT_TYPES),
  props: z.record(z.string(), z.unknown()),
  children: z.array(z.string()).optional(),
  visible: z.unknown().optional(),
});

export const uiTreeSchema = z.object({
  root: z.string(),
  elements: z.record(z.string(), elementSchema),
});

export type UITree = z.infer<typeof uiTreeSchema>;

/**
 * Create a UITree schema from a catalog
 * This allows dynamic schema generation based on catalog components
 */
export function createUiTreeSchema(availableComponents: readonly string[]) {
  return z.object({
    root: z.string(),
    elements: z.record(
      z.string(),
      z.object({
        key: z.string(),
        type: z.enum(availableComponents as [string, ...string[]]),
        props: z.record(z.string(), z.unknown()),
        children: z.array(z.string()).optional(),
        visible: z.unknown().optional(),
      }),
    ),
  });
}

/**
 * Validate a tree against the schema
 */
export function validateTree(tree: unknown): {
  success: boolean;
  data?: UITree;
  error?: z.ZodError;
} {
  const result = uiTreeSchema.safeParse(tree);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
}
