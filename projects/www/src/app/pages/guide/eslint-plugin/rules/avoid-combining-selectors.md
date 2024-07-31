# avoid-combining-selectors

Prefer combining selectors at the selector level.

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
Because a selector is a pure function (and a synchronous function), it's easier to test.

That's why it's recommended to build a view model by composing multiple selectors into one selector, instead of consuming multiple selector observable streams to create a view model in the component.

Examples of **incorrect** code for this rule:

### Enrich state with other state in component

```ts
export class Component {
  vm$ = combineLatest(
    this.store.select(selectCustomers),
    this.store.select(selectOrders)
  ).pipe(
    map(([customers, orders]) => {
      return customers.map((c) => {
        return {
          customerId: c.id,
          name: c.name,
          orders: orders.filter((o) => o.customerId === c.id),
        };
      });
    })
  );
}
```

### Filter state in component

```ts
export class Component {
  customer$ = this.store
    .select(selectCustomers)
    .pipe(withLatestFrom(this.store.select(selectActiveCustomerId)))
    .pipe(
      map(([customers, customerId]) => {
        return customers[customerId];
      })
    );
}
```

Examples of **correct** code for this rule:

### Enrich state with other state in selector

```ts
export selectCustomersAndOrders = createSelector(
  selectCustomers,
  selectOrders,
  (customers, orders) => {
    return {
      customerId: c.id,
      name: c.name,
      orders: orders.filter((o) => o.customerId === c.id),
    }
  }
)

export class Component {
  vm$ = this.store.select(selectCustomersAndOrders);
}
```

### Filter state in selector

```ts
export selectActiveCustomer = createSelector(
  selectCustomers,
  selectActiveCustomerId,
  ([customers, customerId]) => {
    return customers[customerId];
  }
)

export class Component {
  customer$ = this.store.select(selectActiveCustomer);
}
```

## Further reading

- [Maximizing and Simplifying Component Views with NgRx Selectors - by Brandon Roberts](https://brandonroberts.dev/blog/posts/2020-12-14-maximizing-simplifying-component-views-ngrx-selectors/#building-view-models)
