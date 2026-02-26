# Task 003: Implement Structured Output API

## Summary

Modify the API route to use Vercel AI SDK's `Output.object()` for structured JSON output.

## BDD Scenario

```gherkin
Scenario: AI outputs complete JSON object
  Given user inputs "Create a login form"
  When AI receives request and generates UI
  Then output should be complete JSON object
  And contains root and elements fields
  And all elements conform to Catalog defined types
```

## What to Implement

1. Modify `apps/web/app/api/generate/route.ts`:
   - Import `Output` from "ai"
   - Import `uiTreeSchema` from "../../../lib/ui-schema"
   - Add `output: Output.object({ schema: uiTreeSchema })` to streamText config
2. Update the prompt to request JSON output instead of JSONL
3. Remove JSONL-specific rules from the prompt

## Verification

- API returns valid JSON (test with curl or browser devtools)
- Response is valid JSON that can be parsed
- Contains root and elements fields

## Dependencies

- Task 001: Create Zod schema from catalog
- Task 002: Test structured output API (test-first)
