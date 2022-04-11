---
Fixable: no
---

# no-multiple-global-stores

> There should only be one global store injected.

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

There is only one global store, thus there should also only be one global store injected in a class (component, service, ...). Violating this rule is often paired with violating the [`no-typed-global-store`](./no-typed-global-store.md) rule.

Examples of **incorrect** code for this rule:

```ts
export class Component {
  constructor(
    private readonly customersStore: Store<Customers>,
    private readonly catalogStore: Store<Catalog>
  ) {}
}
```

Examples of **correct** code for this rule:

```ts
export class Component {
  constructor(private readonly store: Store) {}
}
```
