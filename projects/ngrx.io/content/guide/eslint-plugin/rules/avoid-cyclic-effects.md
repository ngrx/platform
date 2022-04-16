# avoid-cyclic-effects

Avoid `Effect` that re-emit filtered actions.

- **Type**: problem
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: Yes
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule prevents that the same action as the filtered action is dispatched in an effect, causing an infinite loop.
Effects that are configured with `dispatch: false`, are discarded.

For the rare cases where you need to re-dispatch the same action, you can disable this rule.

Examples of **incorrect** code for this rule:

```ts
class Effect {
  details$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomers.pageLoaded),
      map(() => fromCustomers.pageLoaded())
    )
  );

  constructor(private actions$: Actions) {}
}

class Effect {
  details$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomers.pageLoaded),
      tap(() => alert('Customers loaded'))
    )
  );

  constructor(private actions$: Actions) {}
}
```

Examples of **correct** code for this rule:

```ts
class Effect {
  details$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromCustomers.pageLoaded),
      map(() => fromCustomers.pageLoadedSuccess())
    )
  );

  constructor(private actions$: Actions) {}
}

class Effect {
  details$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromCustomers.pageLoaded),
        tap(() => alert('Customers loaded'))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
```
