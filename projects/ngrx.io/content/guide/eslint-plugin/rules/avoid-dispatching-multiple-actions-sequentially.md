# avoid-dispatching-multiple-actions-sequentially

It is recommended to only dispatch one `Action` at a time.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

An action should be an event that abstracts away the details of store internals.
An action can be a composition of several events, in which case the developer might be tempted to dispatch several actions in sequence. But a better approach is to dispatch one "combining" action, which exactly describes what that event entails.

Examples of **incorrect** code for this rule:

```ts
export class Component implement OnInit {
  constructor(
    private readonly store: Store,
  ) {}

  ngOnInit() {
    // ⚠ multiple actions dispatched
    this.store.dispatch(loadEmployeeList());
    this.store.dispatch(loadCompanyList());
    this.store.dispatch(cleanData());
  }
}
```

Examples of **correct** code for this rule:

```ts
// in component code:
export class Component implement OnInit {
  constructor(
    private readonly store: Store,
  ) {}

  ngOnInit() {
    this.store.dispatch(componentLoaded());
  }
}

// in effect:
export class Effects {

  loadEmployeeList$ = createEffect(() => this.actions.pipe(
    ofType(componentLoaded),
    exhaustMap(() => this.dataService.loadEmployeeList().pipe(
      map(response => loadEmployeeListSuccess(response)),
      catchError(error => loadEmployeeListError(error)),
    )),
  ));

  loadCompanyList$ = createEffect(() => this.actions.pipe(
    ofType(componentLoaded),
    // handle loadCompanyList
  ));

  cleanData$ = createEffect(() => this.actions.pipe(
    ofType(componentLoaded),
    // handle cleanData
  ));

  constructor(
    private readonly actions$: Actions,
  ) {}
}
```
