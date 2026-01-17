# no-store-subscription

Using the `async` pipe is preferred over `store` subscription.

- **Type**: suggestion
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule prevents manual subscriptions to the store, which can lead to memory leaks if not properly unsubscribed. Using the `async` pipe is the recommended approach because Angular automatically handles the subscription and unsubscription, keeping your component code cleaner and preventing memory leaks.

### Why Avoid Store Subscriptions?

⚠️ **Problems with manual store subscriptions:**

- Creates a manual subscription that must be explicitly unsubscribed (e.g., using `takeUntil`, `async`, or `destroyRef`), otherwise it will persist beyond the component's lifecycle causing memory leaks
Will not trigger change detection in zoneless mode. Users have to ensure it otherwise.

✅ **Benefits of using the async pipe:**

- No manual subscription management - Angular's `async` pipe handles subscription and unsubscription automatically
- Keeps the component more declarative

Examples of **incorrect** code for this rule:

1. Subscribing to the store to get data from a selector

<ngrx-code-example>

```ts
ngOnInit() {
  this.store.select(selectedProduct).subscribe(product => {
    this.product = product;
  })
}
```

</ngrx-code-example>

2. Subscribing to the store for side effects

<ngrx-code-example>

```ts
ngOnInit() {
  this.subscription = this.store
    .select(selectAuthenticatedUserState)
    .subscribe(state => {
      this.busy = state.busy;
      if (state.authenticated) {
        this.router.navigateByUrl('/');
      }
    });
}
```

</ngrx-code-example>

Examples of **correct** code for this rule:

1. Using the `async` pipe to get data from a selector

<ngrx-code-example>

```ts
// in code
selectedProduct$ = this.store.select(selectedProduct);

// in the template
<product-details [product]="selectedProduct$ | async"></product-details>
```

</ngrx-code-example>

2. Consider using an effect for side effects

<ngrx-code-example>

```ts
redirectIfAuthenticated$ = createEffect(
  () => {
    return this.store.select(selectAuthenticatedUserState).pipe(
      filter(state => state.authenticated),
      tap(() => {
        this.router.navigateByUrl('/');
      })
    );
  },
  { dispatch: false }
);
```

</ngrx-code-example>
