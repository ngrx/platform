# Actions

Actions are one of the main building blocks in NgRx. Actions express _unique events_ that happen throughout your application. From user interaction with the page, external interaction through network requests, and direct interaction with device APIs, these and more events are described with actions.

## Introduction

Actions are used in many areas of NgRx. Actions are the inputs and outputs of many systems in NgRx. Actions help you to understand how events are handled in your application. This guide provides general rules and examples for writing actions in your application.

## The Action interface

An `Action` in NgRx is made up of a simple interface:

<code-example header="Action Interface">
interface Action {
  type: string;
}
</code-example>

The interface has a single property, the `type`, represented as a string. The `type` property is for describing the action that will be dispatched in your application. The value of the type comes in the form of `[Source] Event` and is used to provide a context of what category of action it is, and where an action was dispatched from. You add properties to an action to provide additional context or metadata for an action.

Listed below are examples of actions written as plain old JavaScript objects (POJOs):

```json
{
  type: '[Auth API] Login Success'
}
```

This action describes an event triggered by a successful authentication after interacting with a backend API.

```json
{
  type: '[Login Page] Login',
  username: string;
  password: string;
}
```

This action describes an event triggered by a user clicking a login button from the login page to attempt to authenticate a user. The username and password are defined as additional metadata provided from the login page.

## Writing actions

There are a few rules to writing good actions within your application.

- Upfront - write actions before developing features to understand and gain a shared knowledge of the feature being implemented.
- Divide - categorize actions based on the event source.
- Many - actions are inexpensive to write, so the more actions you write, the better you express flows in your application.
- Event-Driven - capture _events_ **not** _commands_ as you are separating the description of an event and the handling of that event.
- Descriptive - provide context that are targeted to a unique event with more detailed information you can use to aid in debugging with the developer tools.

Following these guidelines helps you follow how these actions flow throughout your application.

Let's look at an example action of initiating a login request.

<code-example header="login-page.actions.ts">
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Page] Login',
  props&lt;{ username: string; password: string }&gt;()
);
</code-example>

The `createAction` function returns a function, that when called returns an object in the shape of the `Action` interface. The `props` method is used to define any additional metadata needed for the handling of the action. Action creators provide a consistent, type-safe way to construct an action that is being dispatched.

Use the action creator to return the `Action` when dispatching.

<code-example header="login-page.component.ts">
  onSubmit(username: string, password: string) {
    store.dispatch(login({ username: username, password: password }));
  }
</code-example>

The `login` action creator receives an object of `username` and `password` and returns a plain JavaScript object with a `type` property of `[Login Page] Login`, with `username` and `password` as additional properties.

The returned action has very specific context about where the action came from and what event happened.

- The category of the action is captured within the square brackets `[]`.
- The category is used to group actions for a particular area, whether it be a component page, backend API, or browser API.
- The `Login` text after the category is a description about what event occurred from this action. In this case, the user clicked a login button from the login page to attempt to authenticate with a username and password.

<div class="alert is-important">

**Note:** You can also write actions using class-based action creators, which was the previously defined way before action creators were introduced in NgRx. If you are looking for examples of class-based action creators, visit the documentation for [versions 7.x and prior](https://v7.ngrx.io/guide/store/actions).

</div>

## Next Steps

Action's only responsibilities are to express unique events and intents. Learn how they are handled in the guides below.

- [Reducers](guide/store/reducers)
- [Effects](guide/effects)
