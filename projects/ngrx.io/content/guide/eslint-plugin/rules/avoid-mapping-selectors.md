# avoid-mapping-selectors

Avoid mapping logic outside the selector level.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

A selector is a pure function that is used to derive state.
Because a selector is a pure function (and it's synchronous), it's easier to test.

That's why it's recommended to put (mapping) logic into a selector, instead of in the component by using the RxJS `map` operator.

Examples of **incorrect** code for this rule:

```ts
export class Component {
  name$ = this.store
    .select(selectLoggedInUser)
    .pipe(map((user) => ({ name: user.name })));
}
```

Examples of **correct** code for this rule:

```ts
// in selectors.ts:
export selectLoggedInUserName = createSelector(
  selectLoggedInUser,
  (user) => user.name
)

// in component:
export class Component {
  name$ = this.store.select(selectLoggedInUserName)
}
```
