import { streamText } from "ai";
import { createVertex } from "@ai-sdk/google-vertex";
import { generateCatalogPrompt } from "@json-render/core";
import { demoCatalog } from "../../../lib/catalog";

const vertex = createVertex({
  apiKey: process.env.GOOGLE_VERTEX_API_KEY,
});

export const maxDuration = 30;

const INTRO_PROMPT = `You are a UI generator for AR glasses with a 540x180 pixel display.

CRITICAL DISPLAY CONSTRAINTS:
- Fixed viewport: 540px wide × 180px tall (every pixel counts!)
- UI MUST fill the entire 540x180 space - DO NOT center or add margins
- Maximum 5 UI elements at once
- Vertical layouts preferred - maximize use of 180px height
- Text limits: Button labels max 12 chars, Headings max 25 chars, Badges max 10 chars
- Keep content minimal and essential only
- COLOR PALETTE: Pure Green (#00FF66) on Black background ONLY
- NO TRANSPARENCY: Opacity must be 1.0 for all elements. DO NOT use alpha channels.
- NO GRAYS: Use solid black or solid green only
- NO EMOJIS: Do not use emojis (e.g. 🚀, ⚠️) in any text.
- ICONS: Use simple ASCII/text symbols for icons (e.g. [+], [x], >, <, !, ?) which look great in the pixel font.`;

const OUTPUT_PROMPT = `OUTPUT FORMAT:
Output a complete JSON object with the following structure:
{
  "root": "element-key",
  "elements": {
    "element-key": {
      "key": "element-key",
      "type": "ComponentType",
      "props": { ... },
      "children": ["child-key-1", "child-key-2"]
    }
  }
}

COMPONENT TYPES: Card, Stack, Input, Button, Heading, Text, Badge, Progress, Divider

RULES:
1. root must be the key of the root element
2. Every element needs: key, type, props
3. Children array contains string keys (not objects)
4. NEVER use maxWidth in Card props - let UI fill entire screen

FORBIDDEN CLASSES (NEVER USE):
- min-h-screen, h-screen, min-h-full, h-full, min-h-dvh, h-dvh
- bg-gray-50, bg-slate-50 or any page backgrounds
- max-w-* classes that limit width
- opacity-*, /10, /20, /50 modifiers (NO TRANSPARENCY)
- backdrop-blur, bg-white/10 etc.

AR GLASSES UI PATTERNS (FILL ENTIRE 540x180):
- For login: Card with 2 inputs, 1 button - fills screen
- For status: Stack vertical with Heading + Badge/Progress - fills height
- For dashboard: Stack vertical with 2-3 Badges/Progress items - uses full space
- For menu: Stack vertical with 3-4 Text items - maximizes vertical space
- ALWAYS use vertical Stack as root to fill 180px height
- NO centered layouts - use full width and height

EXAMPLE (Login Form):
{
  "root": "login-card",
  "elements": {
    "login-card": {
      "key": "login-card",
      "type": "Card",
      "props": { "title": "Sign In" },
      "children": ["email-input", "password-input", "submit-btn"]
    },
    "email-input": {
      "key": "email-input",
      "type": "Input",
      "props": { "label": "Email", "name": "email", "type": "email" }
    },
    "password-input": {
      "key": "password-input",
      "type": "Input",
      "props": { "label": "Pass", "name": "password", "type": "password" }
    },
    "submit-btn": {
      "key": "submit-btn",
      "type": "Button",
      "props": { "label": "Sign In", "variant": "primary" }
    }
  }
}

EXAMPLE (Status Dashboard):
{
  "root": "dashboard",
  "elements": {
    "dashboard": {
      "key": "dashboard",
      "type": "Stack",
      "props": { "direction": "vertical", "gap": "md" },
      "children": ["header", "status-badge", "progress-bar"]
    },
    "header": {
      "key": "header",
      "type": "Heading",
      "props": { "text": "System Status", "level": 2 }
    },
    "status-badge": {
      "key": "status-badge",
      "type": "Badge",
      "props": { "text": "Online", "variant": "success" }
    },
    "progress-bar": {
      "key": "progress-bar",
      "type": "Progress",
      "props": { "value": 75, "label": "Battery" }
    }
  }
}

Generate the JSON now:`;

function generateSystemPrompt() {
  return `${INTRO_PROMPT}\n\nAVAILABLE COMPONENTS:\n${generateCatalogPrompt(demoCatalog)}\n\nEXCLUDED COMPONENTS (too complex):\n- Grid, Image, Avatar, Rating, BarGraph, LineGraph, Textarea, Select, Checkbox, Radio, Switch, Alert, Link\n\n${OUTPUT_PROMPT}`;
}

const MAX_PROMPT_LENGTH = 140;
const DEFAULT_MODEL = "gemini-3.1-pro-preview";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const sanitizedPrompt = String(prompt || "").slice(0, MAX_PROMPT_LENGTH);

  const result = streamText({
    model: vertex(process.env.GOOGLE_VERTEX_MODEL || DEFAULT_MODEL),
    system: generateSystemPrompt(),
    prompt: sanitizedPrompt,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
