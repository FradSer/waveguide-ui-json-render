import { createCatalog } from "@json-render/core";
import { z } from "zod";

export const demoCatalog = createCatalog({
  name: "waveguide",
  components: {
    Card: {
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      }),
      hasChildren: true,
      description: `Container for forms and content.

USE FOR:
- Login/signup forms
- Content cards with title and body
- Full-screen panels that need to fill width

LAYOUT:
- Fills available width (no maxWidth needed)
- Vertical stack of children
- Good for: login forms, detail views

NEVER USE FOR:
- List items (use Stack + Text instead)
- Inline content (use Text instead)`,
    },
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).optional(),
        gap: z.enum(["sm", "md", "lg"]).optional(),
      }),
      hasChildren: true,
      description: `Flex container for arranging children.

USE FOR:
- Vertical lists of items
- Form field groups
- Dashboard metrics row

LAYOUT:
- vertical: stacks items top-to-bottom (RECOMMENDED for 540x180)
- horizontal: arranges left-to-right
- gap-sm: tight spacing
- gap-md: default spacing

BEST FOR AR:
- Use vertical direction to maximize 180px height
- Great for: status dashboards, menu lists, metric displays`,
    },
    Divider: {
      props: z.object({}),
      description: `Horizontal separator.

USE FOR:
- Separating sections in lists
- Visual breaks in content

LAYOUT:
- Full width horizontal line
- Minimal vertical spacing`,
    },
    Input: {
      props: z.object({
        label: z.string(),
        name: z.string(),
        type: z.enum(["text", "email", "password", "number"]).optional(),
        placeholder: z.string().optional(),
      }),
      description: `Text input field.

USE FOR:
- User text entry
- Email/password fields
- Number input

LAYOUT:
- Label above input
- Keep label under 12 characters

NEVER USE FOR:
- Long text (use Textarea - not available in AR)
- Multiple lines (not supported)`,
    },
    Button: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary", "danger"]).optional(),
        actionText: z.string().optional(),
      }),
      description: `Clickable action button.

USE FOR:
- Form submission
- Actions that trigger events
- Confirm/cancel actions

LAYOUT:
- Label MUST be under 12 characters
- Full width in forms

NEVER USE FOR:
- Navigation (use explicit screen change)
- Display only information`,
    },
    Heading: {
      props: z.object({
        text: z.string(),
        level: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
      }),
      description: `Heading text for titles.

USE FOR:
- Screen titles
- Section headers
- Card titles

LAYOUT:
- h2: largest heading
- h3: medium heading
- h4: smallest heading
- Keep text under 25 characters

NEVER USE FOR:
- Body text (use Text instead)
- Long titles`,
    },
    Text: {
      props: z.object({
        content: z.string(),
        variant: z.enum(["body", "caption", "muted"]).optional(),
      }),
      description: `Plain text content.

USE FOR:
- Body text
- Menu items
- Status messages
- Labels

LAYOUT:
- Single line or multi-line
- Keep very brief for AR display

NEVER USE FOR:
- Titles (use Heading instead)
- Long paragraphs`,
    },
    Badge: {
      props: z.object({
        text: z.string(),
        variant: z.enum(["default", "success", "warning", "danger"]).optional(),
      }),
      description: `Status indicator badge.

USE FOR:
- Status indicators (Online/Offline)
- Alert states (Success/Warning/Danger)
- Counts and labels

LAYOUT:
- Compact inline display
- Text MUST be under 10 characters

BEST FOR AR:
- Show system status
- Quick metrics
- Alert indicators`,
    },
    Progress: {
      props: z.object({
        value: z.number(),
        max: z.number().optional(),
        label: z.string().optional(),
      }),
      description: `Progress bar for metrics.

USE FOR:
- Battery levels
- Completion percentages
- Gauge displays

LAYOUT:
- Horizontal bar
- Label optional, max 12 chars

BEST FOR AR:
- System metrics
- Quick status checks
- Battery/signal indicators`,
    },
  },
});
