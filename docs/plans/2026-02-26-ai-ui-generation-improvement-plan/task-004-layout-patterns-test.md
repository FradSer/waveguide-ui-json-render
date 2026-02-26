# Task 004: Test Layout Patterns in Prompt

## Summary

Write tests that verify AI generates correct layouts following AR constraints.

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

```gherkin
Scenario: Handling display constraint overflow
  Given user requests complex UI (more than 5 main elements)
  When AI generates
  Then should prioritize most important elements
  And maintain usable basic layout
  And should not truncate content causing layout collapse
```

## What to Test

1. Login form: Card + 2 Input + Button (≤5 elements)
2. Dashboard: Stack vertical + Heading + Badge + Progress (≤5 elements)
3. Text length validation
4. Complex requests don't exceed 5 elements

## Verification

- Test with mock API or manual testing with real API
- Verify element count ≤5 for each scenario

## Dependencies

- Task 003: Implement structured output API (must output valid JSON first)
