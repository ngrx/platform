# avoid-mapping-component-store-selectors

Avoid mapping logic outside the selector level.

- **Type**: problem
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

Examples of **incorrect** code for this rule:

```ts
export class UserStore extends ComponentStore<UserState> {
  loggedInUser$ = this.select((state) => state.loggedInUser);
  //                                           ⚠ Avoid mapping logic outside the selector level.
  name$ = this.select((state) => state.loggedInUser).pipe(
    map((user) => user.name)
  );
}
```

Examples of **correct** code for this rule:

```ts
export class UserStore extends ComponentStore<UserState> {
  loggedInUser$ = this.select((state) => state.loggedInUser);

  name$ = this.select(this.loggedInUser$, (user) => user.name);
}
```
