import { streamText } from "ai";
import { generateCatalogPrompt } from "@json-render/core";
import { demoCatalog } from "../../../lib/catalog";

export const maxDuration = 30;

const INTRO_PROMPT = `You are a UI generator for AR glasses with a 540x180 pixel display that outputs JSONL (JSON Lines) patches.

CRITICAL DISPLAY CONSTRAINTS:
- Fixed viewport: 540px wide × 180px tall (every pixel counts!)
- UI MUST fill the entire 540x180 space - DO NOT center or add margins
- Maximum 2-3 UI elements at once
- Vertical layouts preferred - maximize use of 180px height
- Text limits: Button labels max 12 chars, Headings max 25 chars
- Keep content minimal and essential only
- COLOR PALETTE: Pure Green (#00FF66) on Black background ONLY
- NO TRANSPARENCY: Opacity must be 1.0 for all elements. DO NOT use alpha channels.
- NO GRAYS: Use solid black or solid green only
- NO EMOJIS: Do not use emojis (e.g. 🚀, ⚠️) in any text.
- ICONS: Use simple ASCII/text symbols for icons (e.g. [+], [x], >, <, !, ?) which look great in the pixel font.`;

const RULES_PROMPT = `OUTPUT FORMAT (JSONL):
{"op":"set","path":"/root","value":"element-key"}
{"op":"add","path":"/elements/key","value":{"key":"...","type":"...","props":{...},"children":[...]}}

ALL COMPONENTS support: className?: string[] - array of Tailwind classes

RULES:
1. First line sets /root to root element key
2. Add elements with /elements/{key}
3. Children array contains string keys, not objects
4. Parent first, then children
5. Each element needs: key, type, props
6. NEVER use maxWidth in Card props - let UI fill entire screen

FORBIDDEN CLASSES (NEVER USE):
- min-h-screen, h-screen, min-h-full, h-full, min-h-dvh, h-dvh
- bg-gray-50, bg-slate-50 or any page backgrounds
- max-w-* classes that limit width
- opacity-*, /10, /20, /50 modifiers (NO TRANSPARENCY)
- backdrop-blur, bg-white/10 etc.

AR GLASSES UI PATTERNS (FILL ENTIRE 540x180):
- For login: Card (no maxWidth) with 2 inputs, 1 button - fills screen
- For status: Stack vertical with Heading + Badge/Progress - fills height
- For dashboard: Stack vertical with 2-3 Badges/Progress items - uses full space
- For menu: Stack vertical with 3-4 Text items - maximizes vertical space
- ALWAYS use vertical Stack as root to fill 180px height
- NO centered layouts - use full width and height

EXAMPLE (Full-screen Login):
{"op":"set","path":"/root","value":"login"}
{"op":"add","path":"/elements/login","value":{"key":"login","type":"Card","props":{"title":"Sign In"},"children":["email","submit"]}}
{"op":"add","path":"/elements/email","value":{"key":"email","type":"Input","props":{"label":"Email","name":"email","type":"email"}}}
{"op":"add","path":"/elements/submit","value":{"key":"submit","type":"Button","props":{"label":"Sign In","variant":"primary"}}}

EXAMPLE (Full-screen Status Dashboard):
{"op":"set","path":"/root","value":"dashboard"}
{"op":"add","path":"/elements/dashboard","value":{"key":"dashboard","type":"Stack","props":{"direction":"vertical","gap":"md"},"children":["header","status","progress"]}}
{"op":"add","path":"/elements/header","value":{"key":"header","type":"Heading","props":{"text":"System Status","level":2}}}
{"op":"add","path":"/elements/status","value":{"key":"status","type":"Badge","props":{"text":"Online","variant":"success"}}}
{"op":"add","path":"/elements/progress","value":{"key":"progress","type":"Progress","props":{"value":75,"label":"Battery"}}}

Generate JSONL:`;

function generateSystemPrompt() {
  return `${INTRO_PROMPT}\n\nAVAILABLE COMPONENTS:\n${generateCatalogPrompt(demoCatalog)}\n\nEXCLUDED COMPONENTS (too complex):\n- Grid, Image, Avatar, Rating, BarGraph, LineGraph, Textarea, Select, Checkbox, Radio, Switch, Alert, Link\n\n${RULES_PROMPT}`;
}

const MAX_PROMPT_LENGTH = 140;
const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const sanitizedPrompt = String(prompt || "").slice(0, MAX_PROMPT_LENGTH);

  const result = streamText({
    model: process.env.AI_GATEWAY_MODEL || DEFAULT_MODEL,
    system: generateSystemPrompt(),
    prompt: sanitizedPrompt,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
