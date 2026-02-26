# Task 011: Implement Error Handling

## Summary

Add robust error handling for network failures, parsing errors, and validation failures.

## BDD Scenario

```gherkin
Scenario: Network error
  Given network request fails
  When user initiates generation request
  Then display error message
  And provide retry option
```

```gherkin
Scenario: AI returns invalid response
  Given AI returns unparseable response
  When parsing fails
  Then log raw response for debugging
  And display friendly error message
```

## What to Implement

1. **Frontend (hooks.ts)**:
   - Catch network errors
   - Set error state with message
   - Expose retry callback

2. **Frontend (demo component)**:
   - Display error message
   - Show retry button

3. **Backend (route.ts)**:
   - Add error handling for AI SDK errors
   - Return proper error responses

## Verification

- Network error shows error UI with retry
- Invalid response logs to console
- User can retry failed requests

## Dependencies

- Task 003: Implement structured output API
- Task 009: Implement frontend full JSON mode
- Task 010: Test error handling (test-first)
