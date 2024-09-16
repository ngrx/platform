# signal-store-feature-should-use-generic-type

A custom Signal Store feature that accepts an input should define a generic type.

- **Type**: problem
- **Fixable**: Yes
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule ensure that a Signal Store feature uses a generic type to define the feature state.

Examples of **incorrect** code for this rule:

```ts
const withY = () => signalStoreFeature(
    { state: type<{ y: number }>() },
    withState({})
  );
```

```ts
const withY = () => {
  return signalStoreFeature(
    type<{ state: { y: number } }>(),
    withState({})
  );
}
```

```ts
function withY() {
  return signalStoreFeature(
    type<{ state: { y: number } }>(),
    withState({})
  );
}
```

Examples of **correct** code for this rule:

```ts
const withY = <Y>() => signalStoreFeature(
  { state: type<{ y: Y }>() },
  withState({})
);
```

```ts
const withY = <_>() => {
  return signalStoreFeature(
    type<{ state: { y: number } }>(),
    withState({})
  );
};
```

```ts
function withY<_>() {
  return signalStoreFeature(
    { state: type<{ y: Y }>() },
    withState({})
  );
}
```

## Further reading

- [Known TypeScript Issues with Custom Store Features](guide/signals/signal-store/custom-store-features#known-typescript-issues)
