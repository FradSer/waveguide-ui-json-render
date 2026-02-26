# AI UI Generation Improvement Design

## Context

当前项目的 AI 生成 UI 功能存在生成效果不好的问题，主要体现在：
1. AI 输出格式不稳定，JSON 解析时有失败
2. 布局不符合 AR 眼镜 540x180 的显示约束
3. 组件使用不当，意图理解偏差

## Requirements

### 功能需求

1. **结构化输出**
   - 使用 Vercel AI SDK 的 `Output.object()` 约束 AI 输出格式
   - 基于现有 Catalog 生成 Zod schema 进行验证
   - 支持流式返回（使用 `partialOutputStream` 或分段 JSON）

2. **优化的 Prompt 工程**
   - 重构 system prompt 结构，分层组织
   - 增强 Catalog 组件描述，包含使用场景指导
   - 添加 Layout Pattern 指导（针对 540x180）
   - 丰富 Few-shot 示例

3. **前端渲染适配**
   - 接收完整 JSON 输出
   - 支持渐进式渲染（可选）
   - 保持与现有渲染器的兼容性

### 约束条件

- 保持现有 packages 结构（core, react, codegen）
- 不破坏现有 API 兼容性
- AR 眼镜显示约束：540x180 像素，纯绿 #00FF66 黑色背景

## Rationale

### 为什么选择结构化输出 + 完整 JSON

| 方案 | 优点 | 缺点 |
|------|------|------|
| JSONL Patch (现状) | 流式体验好 | AI 容易出错，格式不稳定 |
| 完整 JSON 输出 | 格式 100% 正确，有 Zod 验证 | 失去实时流式 |
| 分段 JSON 流式 | 平衡体验和正确性 | 实现复杂度稍高 |

选择方案 3：使用 `output: "json"` 约束 + 流式返回完整 JSON

### 为什么需要 Layout Pattern

AR 眼镜 540x180 是独特的显示规格，与传统 Web/Mobile 完全不同：
- 水平方向宽，垂直方向窄
- 像素极其珍贵
- 需要最大化利用空间

当前的 prompt 只有禁止规则，没有正向引导，AI 难以理解如何在有限空间内布局。

## Detailed Design

### 1. 后端 API 改造

#### 1.1 使用结构化输出

```typescript
// apps/web/app/api/generate/route.ts

import { streamText, Output } from "ai";
import { z } from "zod";

// 生成基于 Catalog 的 schema
const uiTreeSchema = demoCatalog.treeSchema;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: vertex(process.env.GOOGLE_VERTEX_MODEL || DEFAULT_MODEL),
    system: generateSystemPrompt(), // 重构后的 prompt
    prompt: sanitizedPrompt,
    output: Output.object({
      schema: uiTreeSchema,
    }),
  });

  // 流式返回完整 JSON
  return result.toTextStreamResponse();
}
```

#### 1.2 重构 System Prompt

```
# 结构

1. 角色定义（AR UI 专家）
2. 显示约束（540x180 规格）
3. 组件目录（增强描述 + 使用场景）
4. 布局模式（针对 AR 的模板）
5. Few-shot 示例（典型场景）
6. 输出规则（JSON 格式）

# 详细内容见 best-practices.md
```

### 2. 前端 Hook 改造

#### 2.1 处理完整 JSON 输出

```typescript
// packages/react/src/hooks.ts

interface UseUIStreamOptions {
  api: string;
  mode: "patch" | "full";  // 新增：支持两种模式
  onComplete?: (tree: UITree) => void;
  onError?: (error: Error) => void;
}

export function useUIStream({
  api,
  mode = "patch",  // 默认为 patch 模式保持兼容
  onComplete,
  onError,
}: UseUIStreamOptions) {
  // ...

  // 新增：处理完整 JSON 模式
  const handleFullJson = useCallback(async (response: Response) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
    }

    // 尝试解析完整 JSON
    try {
      const tree = JSON.parse(buffer) as UITree;
      setTree(tree);
      onComplete?.(tree);
    } catch (err) {
      // 处理流式 JSON 部分
      const tree = parsePartialJson(buffer);
      if (tree) setTree(tree);
    }
  }, [onComplete]);

  // ...
}
```

### 3. Catalog 增强

#### 3.1 扩展组件定义

```typescript
// apps/web/lib/catalog.ts

export const demoCatalog = createCatalog({
  name: "waveguide",
  components: {
    Card: {
      props: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        maxWidth: z.enum(["sm", "md", "lg", "full"]).optional(),
      }),
      hasChildren: true,
      description: `
Container component for forms and content.

USE FOR:
- Login/signup forms
- Content cards with title and body
- Modal-like full-screen panels

LAYOUT:
- Fills available width (use maxWidth to constrain)
- Vertical stack of children
- Good for: login forms, detail views

NEVER USE FOR:
- List items (use Stack + Text instead)
- Inline content (use Text instead)
`.trim(),
    },
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).optional(),
        gap: z.enum(["sm", "md", "lg"]).optional(),
      }),
      hasChildren: true,
      description: `
Flex container for arranging children.

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
- Great for: status dashboards, menu lists, metric displays
`.trim(),
    },
    // ... 其他组件类似增强
  },
});
```

#### 3.2 添加 Layout Patterns

```typescript
// 新增 layoutPatterns.ts

export const arLayoutPatterns = `
# AR Glasses Layout Patterns (540x180)

## Pattern 1: Login Form
Structure:
- Card (full width, no maxWidth)
  - Heading: "Sign In" or "Login"
  - Input: Email (label: "Email")
  - Input: Password (label: "Pass")
  - Button: "Sign In" (primary)

Total elements: 5
Height usage: ~160px

## Pattern 2: Status Dashboard
Structure:
- Stack (vertical, gap-md)
  - Heading: Status title
  - Badge: Status indicator (success/warning/danger)
  - Progress: Metric value

Total elements: 4
Height usage: ~100px

## Pattern 3: Menu List
Structure:
- Stack (vertical, gap-sm)
  - Text: Menu item 1
  - Text: Menu item 2
  - Text: Menu item 3
  - Text: Menu item 4

Total elements: 5
Height usage: ~160px

## Pattern 4: Detail View
Structure:
- Card (full width)
  - Heading: Item title
  - Badge: Status
  - Text: Description (keep short)

Total elements: 4
Height usage: ~120px
`;
```

## Design Documents

- [BDD Specifications](./bdd-specs.md) - Behavior scenarios and testing strategy
- [Architecture](./architecture.md) - System architecture and component details
- [Best Practices](./best-practices.md) - Detailed prompt engineering and implementation guide
