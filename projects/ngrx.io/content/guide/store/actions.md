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

The interface has a single property, the `type`, represented as a string. The `type` property is for describing the action that will be dispatched in your application. The value of the type comes in the form of `[Source] Event` and is used to provide a context of what category of action it is, and where an action was dispatched from. You add properties to an action to provide additional context or metadata for an action. The most common property is the `payload`, which adds any associated data needed for the action.

Listed below are examples of actions written as plain javascript objects (POJOS):

```json
{
  type: '[Auth API] Login Success'
}
```

This action describes an event triggered by a successful authentication after interacting with a backend API.

```json
{
  type: '[Login Page] Login',
  payload: {
    username: string;
    password: string;
  }
}
```

This action describes an event triggered by a user clicking a login button from the login page to attempt to authenticate a user. The `payload` contains the username and password provided from the login page.

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
import { Action } from '@ngrx/store';

export class Login implements Action {
  readonly type = '[Login Page] Login';

  constructor(public payload: { username: string; password: string }) {}
}
</code-example>

Actions are written as classes to provide a type-safe way to construct an action when it's being dispatched. The `Login` action implements the `Action` interface to adhere to its structure. The `payload` in this example is an object of a username and password, that is additional metadata needed for the handling of the action.

Instantiate a new instance of the action to use when dispatching.

<code-example header="login-page.component.ts">
click(username: string, password: string) {
  store.dispatch(new Login({ username: username, password: password }));
}
</code-example>

The `Login` action has very specific context about where the action came from and what event happened.

- The category of the action is captured within the square brackets `[]`.
- The category is used to group actions for a particular area, whether it be a component page, backend API, or browser API.
- The `Login` text after the category is a description about what event occurred from this action. In this case, the user clicked a login button from the login page to attempt to authenticate with a username and password.

## Creating action unions

The consumers of actions, whether it be reducers or effects use the type information from an action to determine whether they need to handle the action. Actions are grouped together by feature area, but also need to expose the action type information. Looking at the previous example of the `Login` action, you'll define some additional type information for the actions.

<code-example header="login-page.actions.ts">
import { Action } from '@ngrx/store';

export enum ActionTypes {
  Login = '[Login Page] Login',
}

export class Login implements Action {
  readonly type = ActionTypes.Login;

  constructor(public payload: { username: string; password: string }) {}
}

export type Union = Login;
</code-example>

Instead of putting the action type string directly in the class, the `[Login Page] Login` string is now provided in the `ActionTypes` enum. Also, an additional `Union` type is exported with the `Login` class. These additional exports allow you to take advantage of [discriminated unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html) in TypeScript. Why this is important is covered in the [reducers](guide/store/reducers) and [effects](guide/effects) guides.

## Next Steps

Action's only responsibilities are to express unique events and intents. Learn how they are handled in the guides below.

- [Reducers](guide/store/reducers)
- [Effects](guide/effects)
