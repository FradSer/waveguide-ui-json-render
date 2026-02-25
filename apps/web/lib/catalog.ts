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
      description:
        "Container. Has children. NEVER use maxWidth - let it fill screen. Use for full-screen forms/dashboards.",
    },
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).optional(),
        gap: z.enum(["sm", "md", "lg"]).optional(),
      }),
      hasChildren: true,
      description:
        "Flex container. Has children. Use vertical Stack to fill height.",
    },
    Divider: {
      props: z.object({}),
      description: "Horizontal separator",
    },
    Input: {
      props: z.object({
        label: z.string(),
        name: z.string(),
        type: z.enum(["text", "email", "password", "number"]).optional(),
        placeholder: z.string().optional(),
      }),
      description: "Text input. Label max 12 chars.",
    },
    Button: {
      props: z.object({
        label: z.string(),
        variant: z.enum(["primary", "secondary", "danger"]).optional(),
        actionText: z.string().optional(),
      }),
      description: "Clickable button. Label MUST be under 12 chars.",
    },
    Heading: {
      props: z.object({
        text: z.string(),
        level: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
      }),
      description: "Heading text (h2-h4 only). Keep under 25 chars.",
    },
    Text: {
      props: z.object({
        content: z.string(),
        variant: z.enum(["body", "caption", "muted"]).optional(),
      }),
      description: "Text. Keep very brief.",
    },
    Badge: {
      props: z.object({
        text: z.string(),
        variant: z.enum(["default", "success", "warning", "danger"]).optional(),
      }),
      description: "Status badge. Max 10 chars.",
    },
    Progress: {
      props: z.object({
        value: z.number(),
        max: z.number().optional(),
        label: z.string().optional(),
      }),
      description: "Progress bar. Label max 12 chars.",
    },
  },
});
