# no-multiple-global-stores

There should only be one global store injected.

- **Type**: suggestion
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

There is only one global store, thus there should also only be one global store injected in a class (component, service, ...). Violating this rule is often paired with violating the [`no-typed-global-store`](guide/eslint-plugin/rules/no-typed-global-store) rule.

Examples of **incorrect** code for this rule:

<ngrx-code-example>

```ts
export class Component {
  constructor(
    private readonly customersStore: Store<Customers>,
    private readonly catalogStore: Store<Catalog>
  ) {}
}
```

</ngrx-code-example>

Examples of **correct** code for this rule:

<ngrx-code-example>

```ts
export class Component {
  constructor(private readonly store: Store) {}
}
```

</ngrx-code-example>
