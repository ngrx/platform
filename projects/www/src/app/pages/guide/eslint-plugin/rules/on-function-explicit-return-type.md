# on-function-explicit-return-type

`On` function should have an explicit return type.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

When we use the `on` function to create reducers, we usually copy the state into a new object, and then add the properties that are being modified after that certain action. This may result in unexpected typing problems, we can add new properties into the state that did not exist previously. TypeScript doesn't see this as a problem and might change the state's interface. The solution is to provide an explicit return type to the `on` function callback.

Examples of **incorrect** code for this rule:

```ts
export interface AppState {
  username: string;
}

const reducer = createReducer<AppState>(
  { username: '' },
  on(setUsername, (state, action) => ({
    ...state,
    username: action.payload,
    newProperty: 1, // we added a property that does not exist on `AppState`, and TS won't catch this problem
  }))
);
```

Examples of **correct** code for this rule:

```ts
export interface AppState {
  username: string;
}

const reducer = createReducer<AppState>(
  { username: '' },
  on(
    setUsername,
    (state, action): AppState => ({
      ...state,
      username: action.payload,
      // adding new properties that do not exist on `AppState` is impossible, as the function return type is explicitly stated
    })
  )
);
```
