# Task 005: Add Layout Patterns to Prompt

## Summary

Enhance the system prompt with explicit layout patterns for AR glasses (540x180).

## BDD Scenario

```gherkin
Scenario: Login form generation
  Given user requests "login form"
  When AI generates UI
  Then root element should be Card type
  And contains Email and Password inputs
  And contains login button
  And total elements not exceed 5
  And text length follows limits (button ≤12 chars, heading ≤25)
```

```gherkin
Scenario: Status dashboard generation
  Given user requests "show system status" or "dashboard"
  When AI generates UI
  Then root element should be Stack (vertical)
  And contains heading element
  And contains status indicator (Badge)
  And contains progress bar (Progress) or metrics
```

## What to Implement

1. Create `apps/web/lib/layout-patterns.ts` with AR layout templates:
   - Login Form: Card → [Heading, Email Input, Password Input, Button]
   - Status Dashboard: Stack vertical → [Heading, Badge, Progress]
   - Menu List: Stack vertical → [Text, Text, Text, Text]
   - Detail View: Card → [Heading, Badge, Text]

2. Update `generateSystemPrompt()` in route.ts:
   - Add Layout Patterns section
   - Add element count constraints
   - Add text length limits
   - Convert JSONL examples to full JSON examples

## Verification

- Prompt contains layout pattern examples
- Test with real API - generates correct structure
- Element count ≤5 for each pattern

## Dependencies

- Task 003: Implement structured output API
- Task 004: Test layout patterns (test-first)
