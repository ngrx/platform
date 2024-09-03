# prefer-protected-state

A Signal Store prefers protected state.

- **Type**: suggestion
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule ensures that state changes are only managed by the Signal Store to prevent unintended modifications and provide clear ownership of where changes occur.

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```ts
// SUGGESTION ❗
const Store = signalStore(
  { protectedState: false },
//  ~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  withState({}),
);
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```ts
// GOOD ✅
const Store = signalStore(
  withState({}),
);
```

<!-- prettier-ignore -->
```ts
// GOOD ✅
const Store = signalStore(
  { protectedState: true },
  withState({}),
);
```
