# Best Practices

## Prompt Engineering

### 1. System Prompt 结构

推荐的分层结构：

```typescript
function generateSystemPrompt() {
  return `
# 1. Role Definition
You are an AR Glasses UI Expert specializing in compact, glanceable interfaces.

# 2. Display Constraints
${DISPLAY_CONSTRAINTS}

# 3. Component Catalog
${generateCatalogPrompt(demoCatalog)}

# 4. Layout Patterns
${arLayoutPatterns}

# 5. Examples
${FEW_SHOT_EXAMPLES}

# 6. Output Rules
${OUTPUT_RULES}
`.trim();
}
```

### 2. Display Constraints

```typescript
const DISPLAY_CONSTRAINTS = `
## Display Constraints (540x180 AR Glasses)

- Viewport: 540px wide × 180px tall
- Fill entire screen: NO margins, NO centering
- Maximum 3-5 elements at once
- Vertical layouts preferred (use 180px height)
- Text limits:
  - Button labels: max 12 characters
  - Headings: max 25 characters
  - Badges: max 10 characters

## Color Palette
- Primary: #00FF66 (Pure Green)
- Background: #000000 (Pure Black)
- NO transparency (opacity must be 1.0)
- NO grays (only pure black or pure green)
- NO emojis

## Icons
- Use ASCII text symbols: [+], [x], >, <, !
`.trim();
```

### 3. Enhanced Component Description

每个组件描述应包含：

```typescript
const componentDescription = `
### ComponentName

DESCRIPTION: One-line description

USE FOR:
- Scenario 1
- Scenario 2
- Scenario 3

LAYOUT:
- Width behavior
- Height behavior
- Children arrangement

BEST FOR:
- Best use case

NEVER USE FOR:
- Bad use case

EXAMPLE:
\`\`\`json
{
  "key": "example",
  "type": "ComponentName",
  "props": { ... }
}
\`\`\`
`.trim();
```

### 4. Layout Patterns

针对 AR 眼镜的布局模式：

```typescript
const arLayoutPatterns = `
## AR Glasses Layout Patterns (540x180)

### Pattern: Login Form
Stack: vertical (fill height)
- Card (no maxWidth)
  - Heading: "Sign In"
  - Input: Email
  - Input: Password
  - Button: "Sign In"

### Pattern: Status Dashboard
Stack: vertical, gap-md
- Heading: "System Status"
- Badge: status
- Progress: metric

### Pattern: Menu List
Stack: vertical, gap-sm
- Text: menu item
- Text: menu item
- Text: menu item
- Text: menu item

### Pattern: Detail View
Card (full width)
- Heading: title
- Badge: status
- Text: description
`.trim();
```

### 5. Few-Shot Examples

```typescript
const FEW_SHOT_EXAMPLES = `
## Examples

### Example 1: Login Form
User: "Create a login form"
Output:
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

### Example 2: Status Dashboard
User: "Show system status"
Output:
{
  "root": "status-stack",
  "elements": {
    "status-stack": {
      "key": "status-stack",
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
`.trim();
```

## Vercel AI SDK Structured Output

### 使用 Output.object()

```typescript
import { streamText, Output } from "ai";
import { z } from "zod";

// 基于 Catalog 创建 schema
const uiTreeSchema = z.object({
  root: z.string(),
  elements: z.record(z.string(), z.object({
    key: z.string(),
    type: z.enum(["Card", "Stack", "Input", "Button", "Heading", "Text", "Badge", "Progress", "Divider"]),
    props: z.record(z.string(), z.unknown()),
    children: z.array(z.string()).optional(),
    visible: z.unknown().optional(),
  })),
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: vertex(process.env.GOOGLE_VERTEX_MODEL),
    system: generateSystemPrompt(),
    prompt,
    output: Output.object({
      schema: uiTreeSchema,
    }),
  });

  return result.toTextStreamResponse();
}
```

### 处理流式响应

```typescript
// 前端处理流式 JSON
async function handleStreamResponse(response: Response) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // 尝试解析完整 JSON
    try {
      const tree = JSON.parse(buffer);
      return tree; // 成功解析
    } catch {
      // JSON 不完整，继续等待
      continue;
    }
  }

  throw new Error("Failed to parse JSON response");
}
```

## AR Glasses UI Design Guidelines

### 核心原则

1. **最小化信息**
   - 只显示最关键的 3-5 个元素
   - 避免信息过载

2. **垂直布局优先**
   - 540x180 的宽高比适合垂直内容
   - 使用 Stack (vertical) 填充高度

3. **高对比度**
   - 纯绿 #00FF66 在黑色背景上
   - 无透明度，确保可读性

4. **简短文字**
   - 按钮：最多 12 字符
   - 标题：最多 25 字符
   - Badge：最多 10 字符

### 布局模板映射

| 用户意图 | 推荐布局 | 根组件 |
|---------|---------|--------|
| 登录/注册 | Card + 垂直字段 | Card |
| 状态查看 | Stack vertical + 指标 | Stack |
| 菜单列表 | Stack vertical + Text | Stack |
| 详情查看 | Card + 内容 | Card |

## Error Recovery

### 1. Schema 验证失败

```typescript
function validateAndFallback(response: unknown, catalog: Catalog): UITree | null {
  const result = catalog.validateTree(response);

  if (result.success) {
    return result.data;
  }

  // 记录错误
  console.error("Schema validation failed:", result.error);

  // 返回默认树或 null
  return null;
}
```

### 2. 部分 JSON 解析

```typescript
function parsePartialJson(text: string): UITree | null {
  // 尝试找到完整的 JSON 对象
  const match = text.match(/\{[\s\S]*\}/);

  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }

  return null;
}
```

### 3. 重试机制

```typescript
async function sendWithRetry(
  prompt: string,
  options: { maxRetries: number; onRetry: (attempt: number) => void }
): Promise<UITree> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await generateUI(prompt);
    } catch (err) {
      lastError = err as Error;

      if (attempt < options.maxRetries) {
        options.onRetry(attempt + 1);
        await sleep(Math.pow(2, attempt) * 1000); // 指数退避
      }
    }
  }

  throw lastError;
}
```

## Performance Considerations

### 1. 避免不必要的重渲染

```typescript
// 在渲染器中使用 memo
const ElementRenderer = React.memo(function ElementRenderer({
  element,
  tree,
  registry,
}: ElementRendererProps) {
  // 只在 element 变化时重新渲染
}, (prevProps, nextProps) => {
  return prevProps.element === nextProps.element;
});
```

### 2. 批量状态更新

```typescript
// 使用 useReducer 批量处理多个 patch
function reducer(state: UITree, patches: JsonPatch[]): UITree {
  let newTree = { ...state };

  for (const patch of patches) {
    newTree = applyPatch(newTree, patch);
  }

  return newTree;
}
```

### 3. 虚拟化（大量元素时）

```typescript
// 对于长列表，使用虚拟化
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualizedList({ items, renderItem }) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => document.body,
    estimateSize: () => 40,
  });

  return (
    <div style={{ height: "180px", overflow: "auto" }}>
      {virtualizer.getVirtualItems().map((virtualItem) => (
        <div key={virtualItem.key} style={{ height: virtualItem.size }}>
          {renderItem(items[virtualItem.index])}
        </div>
      ))}
    </div>
  );
}
```
