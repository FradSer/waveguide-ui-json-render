# AI UI Generation Improvement Plan

## Goal

Improve AI UI generation for AR glasses (540x180 display) by implementing:
- Structured output with Zod schema validation
- Enhanced prompt engineering with layout patterns
- Better frontend handling for full JSON mode
- Robust error handling

## Architecture

### Key Changes
1. **Backend API**: Switch from JSONL patches to full JSON output using Vercel AI SDK's `Output.object()`
2. **Prompt**: Add layout patterns and enhance component descriptions
3. **Frontend**: Support full JSON mode in hooks (backward compatible with patch mode)

### Constraints
- AR display: 540x180 pixels, pure green (#00FF66) on black
- Max 5 elements, vertical layouts preferred
- Text limits: Button ≤12 chars, Heading ≤25 chars, Badge ≤10 chars
- Maintain backward compatibility with existing API

## Execution Plan

- [Task 001: Create Zod schema from catalog](./task-001-create-zod-schema.md)
- [Task 002: Test structured output API](./task-002-structured-output-test.md)
- [Task 003: Implement structured output API](./task-003-structured-output-impl.md)
- [Task 004: Test layout patterns prompt](./task-004-layout-patterns-test.md)
- [Task 005: Add layout patterns to prompt](./task-005-layout-patterns-impl.md)
- [Task 006: Test catalog enhancement](./task-006-catalog-enhancement-test.md)
- [Task 007: Enhance catalog component descriptions](./task-007-catalog-enhancement-impl.md)
- [Task 008: Test frontend full JSON mode](./task-008-frontend-json-mode-test.md)
- [Task 009: Implement frontend full JSON mode](./task-009-frontend-json-mode-impl.md)
- [Task 010: Test error handling](./task-010-error-handling-test.md)
- [Task 011: Implement error handling](./task-011-error-handling-impl.md)
- [Task 012: Integration test end-to-end](./task-012-integration-test.md)
