# prefer-one-generic-in-create-for-feature-selector

Prefer using a single generic to define the feature state.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

`createFeatureSelector` is typically used with `forFeature`, which should not be aware about the shape of the Global Store. Most of the time, feature states are lazy-loaded. As such, they only need to know (and care) about their own shape.

This doesn't affect the [composability of these selectors](https://timdeschryver.dev/blog/sharing-data-between-modules-is-peanuts) across features.
You can still use multiple selectors from different feature states together.

> Tip: If you're accessing a lazy loaded feature that isn't loaded yet, the state returned by `createFeatureSelector` is `undefined`.

Examples of **incorrect** code for this rule:

```ts
const customersFeatureState = createFeatureSelector<
  GlobalStore,
  CustomersFeatureState
>('customers');
```

Examples of **correct** code for this rule:

```ts
const customersFeatureState =
  createFeatureSelector<CustomersFeatureState>('customers');
```
