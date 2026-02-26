# Task 006: Test Catalog Enhancement

## Summary

Write tests that verify enhanced component descriptions improve AI component selection.

## BDD Scenario

```gherkin
Scenario: Using Stack as container
  Given user needs to layout multiple elements
  When generating UI
  Then should use Stack component as container
  And set appropriate direction and gap
```

```gherkin
Scenario: Prefer vertical layout
  Given user doesn't specify layout direction
  When generating UI
  Then should prefer vertical Stack
  And fully utilize 180px height
```

## What to Test

1. Catalog has enhanced descriptions with USE FOR / NEVER USE FOR sections
2. Layout patterns use correct components (Stack for containers, Card for forms)
3. Vertical direction is preferred for 540x180

## Verification

- Inspect catalog descriptions
- Test AI generation - correct component selection

## Dependencies

- Task 005: Add layout patterns to prompt (need patterns to test against)
