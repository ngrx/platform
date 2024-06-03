# prefer-action-creator-in-of-type

Using `action creator` in `ofType` is preferred over `string`.

- **Type**: suggestion
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
effectNOK = createEffect(() => this.actions$.pipe(ofType('PING')));

effectNOK1 = createEffect(() =>
  this.actions$.pipe(ofType(BookActions.load, 'PONG'))
);
```

Examples of **correct** code for this rule:

```ts
effectOK = createEffect(() =>
  this.actions$.pipe(ofType(userActions.ping.type))
);
```
