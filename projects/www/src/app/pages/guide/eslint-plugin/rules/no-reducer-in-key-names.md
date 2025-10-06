# no-reducer-in-key-names

Avoid the word "reducer" in the key names.

- **Type**: suggestion
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

Examples of **incorrect** code for this rule:

<ngrx-code-example>

```ts
StoreModule.forRoot({
  customersReducer: customersReducer,
});

StoreModule.forFeature({
  customersReducer,
});

export const reducers: ActionReducerMap<AppState> = {
  customersReducer: fromCustomers.reducer,
};
```

</ngrx-code-example>

Examples of **correct** code for this rule:

<ngrx-code-example>

```ts
StoreModule.forRoot({
  customers: customersReducer,
});

StoreModule.forFeature({
  customers: customersReducer,
});

export const reducers: ActionReducerMap<AppState> = {
  customers: fromCustomers.reducer,
};
```

</ngrx-code-example>

## Further reading

- [Redux Style Guide: Name State Slices Based On the Stored Data](https://redux.js.org/style-guide/style-guide#name-state-slices-based-on-the-stored-data)
