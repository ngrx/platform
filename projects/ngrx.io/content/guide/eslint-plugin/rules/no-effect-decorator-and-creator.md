# no-effect-decorator-and-creator

`Effect` should use either the `createEffect` or the `@Effect` decorator, but not both.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: Yes
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

There are two ways we can register an Effect in NgRx. One is using the `@Effect` decorator (this is currently deprecated), the other is with the help of the `createEffect`. Using both simultaneously will result in the Effect being registered twice, and the side-effect will be performed twice every time the corresponding action is dispatched.

Examples of **incorrect** code for this rule:

```ts
export class Effects {
  @Effect() loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadData)
      // performing the side effect
    )
  );

  constructor(private readonly actions$: Actions) {}
}
```

Examples of **correct** code for this rule:

```ts
export class Effects {
  loadData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadData),
      // performing the side effect
    ))
  };

  constructor(
    private readonly actions$: Actions,
  ) {}
}
```
