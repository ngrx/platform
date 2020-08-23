# Runtime checks

Runtime checks are here to guide developers to follow the NgRx and Redux core concepts and best practices. They are here to shorten the feedback loop of easy-to-make mistakes when you're starting to use NgRx, or even a well-seasoned developer might make. During development, when a rule is violated, an error is thrown notifying you what and where something went wrong.

`@ngrx/store` ships with six (6) built-in runtime checks:

- Default On:
  - [`strictStateImmutability`](#strictstateimmutability): verifies that the state isn't mutated.
  - [`strictActionImmutability`](#strictactionimmutability): verifies that actions aren't mutated
- Default Off:
  - [`strictStateSerializability`](#strictstateserializability): verifies if the state is serializable
  - [`strictActionSerializability`](#strictactionserializability): verifies if the actions are serializable
  - [`strictActionWithinNgZone`](#strictactionwithinngzone): verifies if actions are dispatched within NgZone
  - [`strictActionTypeUniqueness`](#strictactiontypeuniqueness): verifies if registered action types are unique

All checks will automatically be disabled in production builds.

## Configuring runtime checks

It's possible to override the default configuration of runtime checks. To do so, use the `runtimeChecks` property on the root store's config object. For each runtime check you can toggle the check with a `boolean`, `true` to enable the check, `false` to disable the check.

```ts
@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
  ],
})
export class AppModule {}
```

<div class="alert is-important">

The serializability runtime checks cannot be enabled if you use `@ngrx/router-store` with the `DefaultRouterStateSerializer`. The [default serializer](guide/router-store/configuration) has an unserializable router state and actions that are not serializable. To use the serializability runtime checks either use the `MinimalRouterStateSerializer` or implement a custom router state serializer.
This also applies to Ivy with immutability runtime checks.

</div>

### strictStateImmutability

The number one rule of NgRx, immutability. This `strictStateImmutability` check verifies if a developer tries to modify the state object. This check is important to be able to work with the state in a predictable way, it should always be possible to recreate the state.

Example violation of the rule:

```ts
export const reducer = createReducer(initialState,
  on(addTodo, (state, { todo }) => ({
    // Violation 1: we assign a new value to `todoInput` directly
    state.todoInput = '',
    // Violation 2: `push` modifies the array
    state.todos.push(todo)
  }))
);
```

To fix the above violation, a new reference to the state has to be created:

```ts
export const reducer = createReducer(
  initialState,
  on(addTodo, (state, { todo }) => ({
    ...state,
    todoInput: '',
    todos: [...state.todos, todo],
  }))
);
```

### strictActionImmutability

Uses the same check as `strictStateImmutability`, but for actions. An action should not be modified.

Example violation of the rule:

```ts
export const reducer = createReducer(initialState,
  on(addTodo, (state, { todo }) => ({
    // Violation, it's not allowed to modify an action
    todo.id = generateUniqueId();
    return {
      ...state,
      todos: [...state.todos, todo]
    }
  }))
);
```

To fix the above violation, the todo's id should be set in the action creator or should be set in an immutable way. That way we can simply append the todo to the current `todos`:

```ts
export const addTodo = createAction(
  '[Todo List] Add Todo',
  (description: string) => ({ id: generateUniqueId(), description })
);
export const reducer = createReducer(
  initialState,
  on(addTodo, (state, { todo }) => ({
    ...state,
    todos: [...state.todos, todo],
  }))
);
```

### strictStateSerializability

This check verifies if the state is serializable. A serializable state is important to be able to persist the current state to be able to rehydrate the state in the future.

Example violation of the rule:

```ts
export const reducer = createReducer(
  initialState,
  on(completeTodo, (state, { id }) => ({
    ...state,
    todos: {
      ...state.todos,
      [id]: {
        ...state.todos[id],
        // Violation, Date is not serializable
        completedOn: new Date(),
      },
    },
  }))
);
```

As a fix of the above violation the `Date` object must be made serializable:

```ts
export const reducer = createReducer(
  initialState,
  on(completeTodo, (state, { id }) => ({
    ...state,
    todos: {
      ...state.todos,
      [id]: {
        ...state.todos[id],
        completedOn: new Date().toJSON(),
      },
    },
  }))
);
```

### strictActionSerializability

The `strictActionSerializability` check resembles `strictStateSerializability` but as the name says, it verifies if the action is serializable. An action must be serializable to be replayed, this can be helpful during development while using the Redux DevTools and in production to be able to debug errors.

Example violation of the rule:

```ts
const createTodo = createAction('[Todo List] Add new todo', todo => ({
  todo,
  // Violation, a function is not serializable
  logTodo: () => {
    console.log(todo);
  },
}));
```

The fix for this violation is to not add functions on actions, as a replacement a function can be created:

```ts
const createTodo = createAction(
  '[Todo List] Add new todo',
  props<{ todo: Todo }>()
);

function logTodo(todo: Todo) {
  console.log(todo);
}
```

<div class="alert is-important">

Please note, you may not need to set `strictActionSerializability` to `true` unless you are storing/replaying actions using external resources, for example `localStorage`.

</div>

### strictActionWithinNgZone

The `strictActionWithinNgZone` check verifies that Actions are dispatched by asynchronous tasks running within `NgZone`. Actions dispatched by tasks, running outside of `NgZone`, will not trigger ChangeDetection upon completion and may result in a stale view.

Example violation of the rule:

```ts
// Callback running outside of NgZone
function callbackOutsideNgZone() {
  this.store.dispatch(clearTodos());
}
```

To fix ensure actions are running within `NgZone`. Identify the event trigger and then verify if the code can be updated to use a `NgZone` aware feature. If this is not possible use the `NgZone.run` method to explicitly run the asynchronous task within NgZone.

```ts
import { NgZone } from '@angular/core';

constructor(private ngZone: NgZone){}

// Callback running outside of NgZone brought back in NgZone.
function callbackOutsideNgZone(){
  this.ngZone.run(() => {
    this.store.dispatch(clearTodos());
  }
}
```

### strictActionTypeUniqueness

The `strictActionTypeUniqueness` guards you against registering the same action type more than once.

Example violation of the rule:

```ts
export const customerPageLoaded = createAction('[Customers Page] Loaded');
export const customerPageRefreshed = createAction('[Customers Page] Loaded');
```

The fix of the violation is to create unique action types:

```ts
export const customerPageLoaded = createAction('[Customers Page] Loaded');
export const customerPageRefreshed = createAction('[Customers Page] Refreshed');
```
