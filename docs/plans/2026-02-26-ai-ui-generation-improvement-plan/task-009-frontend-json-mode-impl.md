# Task 009: Implement Frontend Full JSON Mode

## Summary

Add support for full JSON mode in the useUIStream hook while maintaining backward compatibility with patch mode.

## BDD Scenario

```gherkin
Scenario: Receiving streamed JSON
  Given backend uses streaming output
  When frontend receives response
  Then should handle incomplete JSON
  And progressively update UI
  And update complete state on finish
```

## What to Implement

Modify `packages/react/src/hooks.ts`:

1. Add `mode: "patch" | "full"` option (default: "patch" for backward compat)
2. Implement `parsePartialJson(buffer)` helper for handling incomplete JSON
3. In "full" mode:
   - Accumulate stream into buffer
   - Try to parse complete JSON
   - Fall back to partial parsing if needed
4. Maintain existing patch mode functionality

## Verification

- Test "full" mode: API response renders correctly
- Test "patch" mode: Existing functionality still works
- Loading states work correctly

## Dependencies

- Task 003: Implement structured output API
- Task 008: Test frontend JSON mode (test-first)
