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

This rule ensure that Signal Store feature that accepts an input defines a generic type.

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```ts
const withY = () => signalStoreFeature(
//                  ~~~~~~~~~~~~~~~~~~ [${messageId}]
    { state: type<{ y: number }>() },
    withState({})
  );
```

```ts
const withY = () =>
  signalStoreFeature(
    //                  ~~~~~~~~~~~~~~~~~~ [${messageId}]
    type<{ state: { y: number } }>(),
    withState({})
  );
```

<!-- prettier-ignore -->
```ts
const withY = () => {
  return signalStoreFeature(
//       ~~~~~~~~~~~~~~~~~~ [${messageId}]
    { state: type<{ y: number }>() },
    withState({})
  );
}
```

<!-- prettier-ignore -->
```ts
const withY = () => {
  return signalStoreFeature(
//       ~~~~~~~~~~~~~~~~~~ [${messageId}]
    type<{ state: { y: number } }>(),
    withState({})
  );
}
```

<!-- prettier-ignore -->
```ts
const withY = () => {
  return signalStoreFeature(
//       ~~~~~~~~~~~~~~~~~~ [${messageId}]
    type<{ state: { y: number } }>(),
    withState({})
  );
}
```

<!-- prettier-ignore -->
```ts
function withY() {
  return signalStoreFeature(
//       ~~~~~~~~~~~~~~~~~~ [${messageId}]
    type<{ state: { y: number } }>(),
    withState({})
  );
}
```

<!-- prettier-ignore -->
```ts
function withY() {
  return signalStoreFeature(
//       ~~~~~~~~~~~~~~~~~~ [${messageId}]
    { state: type<{ y: number }>() },
    withState({})
  );
}
```

<!-- prettier-ignore -->
```ts
function withY() {
  const feature = signalStoreFeature(
//                ~~~~~~~~~~~~~~~~~~ [${messageId}]
    { state: type<{ y: number }>() },
    withState({})
  );
  return feature;
}
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```ts
const withY = <Y>() => signalStoreFeature(
  { state: type<{ y: Y }>() },
  withState({})
);
```

<!-- prettier-ignore -->
```ts
export const withY = <Y>() => signalStoreFeature(
  type<{ state: { y: Y } }>(),
  withState({})
);
```

<!-- prettier-ignore -->
```ts
const withY = <_>() => {
  return signalStoreFeature(
    { state: type<{ y: number }>() },
    withState({})
  );
};
```

<!-- prettier-ignore -->
```ts
export const withY = <_>() => {
  return signalStoreFeature(
    type<{ state: { y: number } }>(),
    withState({})
  );
};
```

<!-- prettier-ignore -->
```ts
function withY<Y>() {
  return signalStoreFeature(
    { state: type<{ y: Y }>() },
    withState({})
  );
}
```

<!-- prettier-ignore -->
```ts
export function withY<_>() {
  return signalStoreFeature(
    type<{ state: { y: number } }>(),
    withState({})
  );
}
```

<!-- prettier-ignore -->
```ts
function withY<_>() {
  const feature = signalStoreFeature(
    type<{ state: { y: number } }>(),
    withState({})
  );
  return feature;
}
```
