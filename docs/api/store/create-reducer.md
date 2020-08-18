---
kind: FunctionDeclaration
name: createReducer
module: store
---

# createReducer

## description

Creates a reducer function to handle state transitions.

Reducer creators reduce the explicitness of reducer functions with switch statements.

```ts
function createReducer<S, A extends Action = Action>(
  initialState: S,
  ...ons: On<S>[]
): ActionReducer<S, A>;
```

## Parameters

| Name         | Type      | Description                                                                     |
| ------------ | --------- | ------------------------------------------------------------------------------- |
| initialState | `S`       | Provides a state value if the current state is `undefined`, as it is initially. |
| ons          | `On<S>[]` | Associations between actions and state changes.                                 |

## returns

A reducer function.

## usageNotes

- Must be used with `ActionCreator`'s (returned by `createAction`). Cannot be used with class-based action creators.
- The returned `ActionReducer` should additionally be wrapped with another function, if you are using View Engine AOT.
  In case you are using Ivy (or only JIT View Engine) the extra wrapper function is not required.

**Declaring a reducer creator**

```ts
export const reducer = createReducer(
  initialState,
  on(
    featureActions.actionOne,
    featureActions.actionTwo,
    (state, { updatedValue }) => ({ ...state, prop: updatedValue })
  ),
  on(featureActions.actionThree, () => initialState)
);
```

**Declaring a reducer creator using a wrapper function (Only needed if using View Engine AOT)**

```ts
const featureReducer = createReducer(
  initialState,
  on(
    featureActions.actionOne,
    featureActions.actionTwo,
    (state, { updatedValue }) => ({ ...state, prop: updatedValue })
  ),
  on(featureActions.actionThree, () => initialState)
);

export function reducer(state: State | undefined, action: Action) {
  return featureReducer(state, action);
}
```
