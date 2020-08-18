---
kind: FunctionDeclaration
name: createAction
module: store
---

# createAction

## description

Creates a configured `Creator` function that, when called, returns an object in the shape of the `Action` interface.

Action creators reduce the explicitness of class-based action creators.

```ts
function createAction<T extends string, C extends Creator>(
  type: T,
  config?: { _as: 'props' } | C
): ActionCreator<T>;
```

## Parameters

| Name   | Type                    | Description                                                                                                  |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| type   | `T`                     | Describes the action that will be dispatched                                                                 |
| config | `{ _as: 'props'; } | C` | Additional metadata needed for the handling of the action. See {@link createAction#usage-notes Usage Notes}. |

## usageNotes

**Declaring an action creator**

Without additional metadata:

```ts
export const increment = createAction('[Counter] Increment');
```

With additional metadata:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: User }>()
);
```

With a function:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  (response: Response) => response.user
);
```

**Dispatching an action**

Without additional metadata:

```ts
store.dispatch(increment());
```

With additional metadata:

```ts
store.dispatch(loginSuccess({ user: newUser }));
```

**Referencing an action in a reducer**

Using a switch statement:

```ts
switch (action.type) {
  // ...
  case AuthApiActions.loginSuccess.type: {
    return {
      ...state,
      user: action.user,
    };
  }
}
```

Using a reducer creator:

```ts
on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user }));
```

**Referencing an action in an effect**

```ts
effectName$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthApiActions.loginSuccess)
    // ...
  )
);
```

## Overloads

## description

Creates a configured `Creator` function that, when called, returns an object in the shape of the `Action` interface.

Action creators reduce the explicitness of class-based action creators.

```ts
function createAction<T extends string, C extends Creator>(
  type: T,
  config?: { _as: 'props' } | C
): ActionCreator<T>;
```

### Parameters

| Name   | Type                                                                                                              | Description                                  |
| ------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| type   | `T`                                                                                                               | Describes the action that will be dispatched |
| config | `` | Additional metadata needed for the handling of the action. See {@link createAction#usage-notes Usage Notes}. |

## usageNotes

**Declaring an action creator**

Without additional metadata:

```ts
export const increment = createAction('[Counter] Increment');
```

With additional metadata:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: User }>()
);
```

With a function:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  (response: Response) => response.user
);
```

**Dispatching an action**

Without additional metadata:

```ts
store.dispatch(increment());
```

With additional metadata:

```ts
store.dispatch(loginSuccess({ user: newUser }));
```

**Referencing an action in a reducer**

Using a switch statement:

```ts
switch (action.type) {
  // ...
  case AuthApiActions.loginSuccess.type: {
    return {
      ...state,
      user: action.user,
    };
  }
}
```

Using a reducer creator:

```ts
on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user }));
```

**Referencing an action in an effect**

```ts
effectName$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthApiActions.loginSuccess)
    // ...
  )
);
```

## description

Creates a configured `Creator` function that, when called, returns an object in the shape of the `Action` interface.

Action creators reduce the explicitness of class-based action creators.

```ts
function createAction<T extends string, C extends Creator>(
  type: T,
  config?: { _as: 'props' } | C
): ActionCreator<T>;
```

### Parameters

| Name   | Type                            | Description                                                                                                  |
| ------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| type   | `T`                             | Describes the action that will be dispatched                                                                 |
| config | `Props<P> & NotAllowedCheck<P>` | Additional metadata needed for the handling of the action. See {@link createAction#usage-notes Usage Notes}. |

## usageNotes

**Declaring an action creator**

Without additional metadata:

```ts
export const increment = createAction('[Counter] Increment');
```

With additional metadata:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: User }>()
);
```

With a function:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  (response: Response) => response.user
);
```

**Dispatching an action**

Without additional metadata:

```ts
store.dispatch(increment());
```

With additional metadata:

```ts
store.dispatch(loginSuccess({ user: newUser }));
```

**Referencing an action in a reducer**

Using a switch statement:

```ts
switch (action.type) {
  // ...
  case AuthApiActions.loginSuccess.type: {
    return {
      ...state,
      user: action.user,
    };
  }
}
```

Using a reducer creator:

```ts
on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user }));
```

**Referencing an action in an effect**

```ts
effectName$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthApiActions.loginSuccess)
    // ...
  )
);
```

## description

Creates a configured `Creator` function that, when called, returns an object in the shape of the `Action` interface.

Action creators reduce the explicitness of class-based action creators.

```ts
function createAction<T extends string, C extends Creator>(
  type: T,
  config?: { _as: 'props' } | C
): ActionCreator<T>;
```

### Parameters

| Name    | Type                                                                                                              | Description                                  |
| ------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| type    | `T`                                                                                                               | Describes the action that will be dispatched |
| config  | `` | Additional metadata needed for the handling of the action. See {@link createAction#usage-notes Usage Notes}. |
| creator | `FunctionWithParametersType<P, R> & NotAllowedCheck<R>`                                                           |                                              |

## usageNotes

**Declaring an action creator**

Without additional metadata:

```ts
export const increment = createAction('[Counter] Increment');
```

With additional metadata:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ user: User }>()
);
```

With a function:

```ts
export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  (response: Response) => response.user
);
```

**Dispatching an action**

Without additional metadata:

```ts
store.dispatch(increment());
```

With additional metadata:

```ts
store.dispatch(loginSuccess({ user: newUser }));
```

**Referencing an action in a reducer**

Using a switch statement:

```ts
switch (action.type) {
  // ...
  case AuthApiActions.loginSuccess.type: {
    return {
      ...state,
      user: action.user,
    };
  }
}
```

Using a reducer creator:

```ts
on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user }));
```

**Referencing an action in an effect**

```ts
effectName$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthApiActions.loginSuccess)
    // ...
  )
);
```
