# no-dispatch-in-effects

`Effect` should not call `store.dispatch`.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

An effect should handle actions and map them to a singular action.
Each effect should be clear and concise and must be understandable to what it does affect.
Dispatching an action from inside an effect instead of (or together with) mapping it to an action can result in painfully hard-to-find bugs and is generally considered a bad practice.

Examples of **incorrect** code for this rule:

```ts
export class Effects {
  loadData$ = createEffect(() =>
    this.actions.pipe(
      ofType(loadData),
      exhaustMap(() =>
        this.dataService.getData().pipe(
          tap((response) => {
            // ⚠ dispatching another action from an effect
            if (response.condition) {
              this.store.dispatch(anotherAction());
            }
          }),
          map((response) => loadDataSuccess(response)),
          catchError((error) => loadDataError(error))
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store
  ) {}
}
```

Examples of **correct** code for this rule:

```ts
export class Effects {
  loadData$ = createEffect(() =>
    this.actions.pipe(
      ofType(loadData),
      exhaustMap(() =>
        this.dataService.getData().pipe(
          map((response) => loadDataSuccess(response)),
          catchError((error) => loadDataError(error))
        )
      )
    )
  );

  handleCondition$ = createEffect(() =>
    this.action.pipe(
      ofType(loadDataSuccess),
      filter((response) => response.condition),
      exhaustMap(() =>
        this.dataService
          .getOtherData
          // handle response from a consequent request
          ()
      )
    )
  );

  constructor(private readonly actions$: Actions) {}
}
```
