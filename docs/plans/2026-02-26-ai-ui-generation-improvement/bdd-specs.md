# BDD Specifications

## AI UI Generation Improvement

### Feature: 结构化输出

**Scenario: AI 输出完整的 JSON 对象**

```
GIVEN 用户输入了 "Create a login form"
WHEN AI 接收请求并生成 UI
THEN 输出应该是完整的 JSON 对象
AND 包含 root 和 elements 字段
AND 所有元素符合 Catalog 定义的类型
```

**Scenario: 输出格式验证失败时的处理**

```
GIVEN AI 生成了不符合 schema 的输出
WHEN 验证失败
THEN 返回友好的错误信息
AND 记录失败日志用于分析
```

### Feature: 布局约束遵循

**Scenario: 登录表单生成**

```
GIVEN 用户请求 "login form"
WHEN AI 生成 UI
THEN 根元素应该是 Card 类型
AND 包含 Email 和 Password 输入框
AND 包含登录按钮
AND 总元素数量不超过 5 个
AND 文字长度符合限制（按钮 ≤12 字符，标题 ≤25）
```

**Scenario: 状态仪表盘生成**

```
GIVEN 用户请求 "show system status" 或 "dashboard"
WHEN AI 生成 UI
THEN 根元素应该是 Stack (vertical)
AND 包含标题元素
AND 包含状态指示器 (Badge)
AND 包含进度条 (Progress) 或指标
```

**Scenario: 超出显示约束时的处理**

```
GIVEN 用户请求生成复杂 UI（超过 5 个主要元素）
WHEN AI 生成
THEN 应该优先显示最重要的元素
AND 保持可用的基本布局
AND 不应该截断内容导致布局崩溃
```

### Feature: 组件正确使用

**Scenario: 使用 Stack 作为容器**

```
GIVEN 用户需要布局多个元素
WHEN 生成 UI
THEN 应该使用 Stack 组件作为容器
AND 设置合适的 direction 和 gap
```

**Scenario: 垂直布局优先**

```
GIVEN 用户没有指定布局方向
WHEN 生成 UI
THEN 应该优先使用 vertical Stack
AND 充分利用 180px 高度
```

### Feature: 流式渲染

**Scenario: 接收流式 JSON**

```
GIVEN 后端使用流式输出
WHEN 前端接收响应
THEN 应该能处理不完整的 JSON
AND 渐进式更新 UI
AND 完成后更新完整状态
```

### Feature: 错误处理

**Scenario: 网络错误**

```
GIVEN 网络请求失败
WHEN 用户发起生成请求
THEN 显示错误信息
AND 提供重试选项
```

**Scenario: AI 返回无效响应**

```
GIVEN AI 返回无法解析的响应
WHEN 解析失败
THEN 记录原始响应用于调试
AND 显示友好的错误信息
```

## Test Strategy

### 单元测试

1. **Catalog 验证**
   - 测试 `validateTree()` 对有效/无效树的验证
   - 测试 `validateElement()` 对各组件的验证

2. **Prompt 生成**
   - 测试 `generateSystemPrompt()` 输出格式
   - 测试 Layout Pattern 模板生成

3. **前端 Hook**
   - 测试 `parsePatchLine()` 各种输入
   - 测试 `applyPatch()` patch 操作

### 集成测试

1. **端到端生成流程**
   - 模拟用户输入 → API → 渲染完整链路
   - 验证输出符合约束

2. **布局约束验证**
   - 生成各种场景的 UI
   - 验证元素数量、文字长度等

### 手动测试场景

1. 登录表单生成
2. 状态仪表盘生成
3. 菜单列表生成
4. 详情页生成
5. 复杂/边界情况

## Success Criteria

- [ ] 结构化输出正确生成完整 JSON
- [ ] 登录表单布局正确（Card + 2 Input + Button）
- [ ] 仪表盘布局正确（Stack vertical + Heading + Badge + Progress）
- [ ] 菜单列表布局正确（Stack + 多个 Text）
- [ ] 元素数量控制在 5 个以内
- [ ] 文字长度符合限制
- [ ] 错误处理完善
- [ ] 流式渲染正常工作
