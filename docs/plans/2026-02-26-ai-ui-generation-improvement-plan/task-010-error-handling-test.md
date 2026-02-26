# Task 010: Test Error Handling

## Summary

Write tests for error handling scenarios in the AI UI generation flow.

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

## What to Test

1. Network failures trigger error state
2. Invalid JSON responses are handled gracefully
3. Error state includes retry option
4. Raw responses are logged for debugging

## Verification

- Simulate network errors
- Test with malformed API responses

## Dependencies

- Task 003: Implement structured output API
- Task 009: Implement frontend full JSON mode (need mode to test errors)
