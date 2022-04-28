# good-action-hygiene

Ensures the use of good action hygiene.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

An action should be a unique event in the application.
An action should:

- tell where it's dispatched
- tell what event has occurred

The template we use for an action's type is `[Source] Event`.

Examples of **incorrect** code for this rule:

```ts
export const customersRefresh = createAction('Refresh Customers');
export const customersLoadedSuccess = createAction('Customers Loaded Success');
```

Examples of **correct** code for this rule:

```ts
export const customersRefresh = createAction(
  '[Customers Page] Refresh clicked'
);
export const customersLoadedSuccess = createAction(
  '[Customers API] Customers Loaded Success'
);
```

## Further reading

- [Good Action Hygiene with NgRx Mike Ryan](https://www.youtube.com/watch?v=JmnsEvoy-gY)
