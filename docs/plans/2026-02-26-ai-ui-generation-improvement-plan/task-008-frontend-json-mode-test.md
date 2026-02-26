# Task 008: Test Frontend Full JSON Mode

## Summary

Write tests that verify the frontend hook handles full JSON responses correctly.

## BDD Scenario

```gherkin
Scenario: Receiving streamed JSON
  Given backend uses streaming output
  When frontend receives response
  Then should handle incomplete JSON
  And progressively update UI
  And update complete state on finish
```

## What to Test

1. `parsePartialJson()` handles various incomplete JSON inputs
2. `applyPatch()` correctly applies patch operations (for backward compat)
3. Stream response is accumulated and parsed
4. Loading and complete states are updated properly

## Verification

Run tests:
```bash
cd packages/react && npm test hooks.test.ts
```

## Dependencies

- Task 003: Implement structured output API (API must return full JSON first)
