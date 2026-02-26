# Task 012: Integration Test End-to-End

## Summary

Run end-to-end tests for the complete AI UI generation flow.

## BDD Scenario

All scenarios from bdd-specs.md:
- AI outputs complete JSON object
- Login form generation
- Status dashboard generation
- Using Stack as container
- Prefer vertical layout
- Receiving streamed JSON
- Network error handling
- AI returns invalid response handling

## What to Test

1. User input "Create a login form" → renders Card + 2 Input + Button
2. User input "Show system status" → renders Stack + Heading + Badge + Progress
3. Element count ≤5 for all scenarios
4. Text length follows limits
5. Error states display correctly

## Verification

Manual testing checklist:
- [ ] Login form: Card + 2 Input + Button
- [ ] Status dashboard: Stack + Heading + Badge + Progress
- [ ] Element count ≤5
- [ ] Button labels ≤12 chars
- [ ] Headings ≤25 chars
- [ ] Badges ≤10 chars
- [ ] Network error shows retry
- [ ] Backward compatibility with patch mode

## Dependencies

All previous tasks must be completed
