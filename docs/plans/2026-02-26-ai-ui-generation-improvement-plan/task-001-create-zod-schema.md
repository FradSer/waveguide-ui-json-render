# Task 001: Create Zod Schema from Catalog

## Summary

Create a Zod schema that represents the UITree structure based on the existing demoCatalog.

## BDD Scenario

This is an infrastructure task that supports all BDD scenarios. No specific scenario.

## What to Implement

1. Create `apps/web/lib/ui-schema.ts`
2. Export `uiTreeSchema` - a Zod schema that matches the UITree structure:
   ```typescript
   {
     root: string,
     elements: Record<string, {
       key: string,
       type: "Card" | "Stack" | "Input" | "Button" | "Heading" | "Text" | "Badge" | "Progress" | "Divider",
       props: Record<string, unknown>,
       children?: string[],
       visible?: unknown,
     }>
   }
   ```
3. Export a helper function `createUiTreeSchema(catalog)` that dynamically generates schema from any catalog

## Verification

- Schema can be imported in route.ts
- Schema validates a valid UITree without errors
- Schema rejects invalid trees (missing root, invalid type, etc.)

## Dependencies

None - this is a foundational task.

## File to Create

- `apps/web/lib/ui-schema.ts`
