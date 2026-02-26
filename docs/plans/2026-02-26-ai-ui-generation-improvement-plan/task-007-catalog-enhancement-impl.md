# Task 007: Enhance Catalog Component Descriptions

## Summary

Add USE FOR / NEVER USE FOR / LAYOUT sections to component descriptions in the catalog.

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

## What to Implement

Enhance `apps/web/lib/catalog.ts` with detailed descriptions:

1. **Card**:
   - USE FOR: Login/signup forms, content cards, full-screen panels
   - NEVER USE: List items, inline content
   - LAYOUT: Fills width, vertical stack of children

2. **Stack**:
   - USE FOR: Vertical lists, form groups, dashboard metrics
   - BEST FOR AR: Use vertical to maximize 180px height
   - LAYOUT: vertical (recommended), horizontal options

3. **Input**:
   - USE FOR: User text entry
   - LAYOUT: Label above input

4. **Button**:
   - USE FOR: Actions, submissions
   - NEVER USE: Navigation (use Link)

5. Add similar patterns to Heading, Text, Badge, Progress

## Verification

- Catalog descriptions include USE FOR / LAYOUT sections
- AI generates more appropriate components
- Test with real API

## Dependencies

- Task 005: Add layout patterns to prompt
- Task 006: Test catalog enhancement (test-first)
