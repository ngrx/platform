# avoid-duplicate-actions-in-reducer

A `Reducer` should handle an `Action` once.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

While it's technically allowed to handle an action more than once in a reducer, this often means something is wrong. Probably this is just a typo or a copy-paste mistake. When that's not the case, it's often desired to rethink and refactor the reducer.

A valid reason why an action can be handled more than once in a single reducer, is when the reducer is consumed by a [higher-order reducer](https://github.com/ngrx/platform/issues/1956#issuecomment-526720340). If that's the case, this rule isn't triggered.

Examples of **incorrect** code for this rule:

```ts
export const reducer = createReducer(
  initialState,
  on(customerLoaded, (state) => ({ ...state, status: 'loaded' })),
  on(customerLoaded, (state) => ({ ...state, status: 'loaded' }))
);
```

Examples of **correct** code for this rule:

```ts
export const reducer = createReducer(
  initialState,
  on(customerLoaded, (state) => ({ ...state, status: 'loaded' }))
);
```
