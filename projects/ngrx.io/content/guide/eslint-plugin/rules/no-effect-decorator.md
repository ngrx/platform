# no-effect-decorator

The `createEffect` is preferred as the `@Effect` decorator is deprecated.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: Yes
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

The `@Effect` decorator is deprecated. There is no standardized support for decorators in ECMAScript, and Angular uses its internal build system to compile code with decorators, essentially using them as code annotations, so it is not sustainable to rely on decorators in other features. Instead, use the `createEffect` to create `Effects`.

Examples of **incorrect** code for this rule:

```ts
export class Effects {
  @Effect() loadData$ = this.actions$.pipe(
    ofType(loadData)
    // performing the side effect
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
