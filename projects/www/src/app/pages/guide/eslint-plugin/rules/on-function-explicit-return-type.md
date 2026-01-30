# on-function-explicit-return-type

`On` function should have an explicit return type.

- **Type**: suggestion
- **Deprecated**: Yes
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Deprecation Notice

This rule is deprecated. The `on` function now enforces exact return types at the type level, so excess properties in `on` callbacks will produce TypeScript compilation errors without needing an explicit return type annotation. It is safe to remove this rule from your ESLint configuration. See the [Reducers guide](guide/store/reducers) for details and known limitations.

## Rule Details

When we use the `on` function to create reducers, we usually copy the state into a new object, and then add the properties that are being modified after that certain action. This may result in unexpected typing problems, we can add new properties into the state that did not exist previously. TypeScript doesn't see this as a problem and might change the state's interface. The solution is to provide an explicit return type to the `on` function callback.

Examples of **incorrect** code for this rule:

<ngrx-code-example>

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

</ngrx-code-example>

Examples of **correct** code for this rule:

<ngrx-code-example>

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

</ngrx-code-example>
