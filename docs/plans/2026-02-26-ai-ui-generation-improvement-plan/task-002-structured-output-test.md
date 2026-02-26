# Task 002: Test Structured Output API

## Summary

Write tests that verify the API returns valid JSON objects conforming to the UITree schema.

## BDD Scenario

```gherkin
Scenario: AI outputs complete JSON object
  Given user inputs "Create a login form"
  When AI receives request and generates UI
  Then output should be complete JSON object
  And contains root and elements fields
  And all elements conform to Catalog defined types
```

```gherkin
Scenario: Output format validation failure handling
  Given AI generates output that doesn't conform to schema
  When validation fails
  Then return friendly error message
  And log failure for analysis
```

## What to Test

1. API endpoint returns valid JSON (not JSONL)
2. Response contains `root` and `elements` fields
3. Element types match Catalog definitions
4. Invalid responses are handled gracefully (if possible to test)

## Verification

Run tests:
```bash
cd apps/web && npm test tests/api/generate.spec.ts
```

## Dependencies

- Task 001: Create Zod schema from catalog (for validation)
