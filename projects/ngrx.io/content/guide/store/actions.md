# Actions

Actions are one of the main building blocks in NgRx. Actions express _unique events_ that happen throughout your application. From user interaction with the page, external interaction through network requests, and direct interaction with device APIs, these and more events are described with actions.

## Introduction

Actions are used in many areas of NgRx. Actions are the inputs and outputs of many systems in NgRx. Actions help you to understand how events are handled in your application. They are handled by reducers to cause state changes, and handled by effects to trigger side effects. Actions also help with the [debugging tools](guide/store-devtools) provided with NgRx. This guide provides general rules and examples for writing actions in your application.

## The Action interface

An `Action` in NgRx is made up of a simple interface:

```ts
interface Action {
  type: string;
}
```

The interface has a single property, the `type`, represented as a string. The `type` property is for describing the action that will be dispatched in your application. The value of the type is used to provide context of what category of action it is, and where an action was dispatched from. You add properties to an action to provide additional context or metadata for an action. The most common property is the `payload`, which adds any associated data need for the action.

## Writing actions

There are a few rules to writing good actions within your application.

- Upfront - write actions before developing features to understand and gain a shared knowledge of the feature being implemented.
- Divide - categorize actions based on the event source.
- Many - actions are inexpensive to write, so the more actions you write, the better you express flows in your application.
- Event-Driven - capture _events_ **not** _commands_ as you separating the description of an event and the handling of that event.
- Descriptive - provide context that are targeted to a unique event with glanceable information you can use to aid in debugging with the developer tools.

Following these guidelines helps you follow how these actions flow throughout your application, whether they cause state transitions or trigger side effects.

Let's look at an example action of initiating a login request.

```ts
import { Action } from '@ngrx/store';

export class Login implements Action {
  readonly type = '[Login Page] Login';

  constructor(public payload: { username: string; password: string }) {}
}
```

Actions are written as classes to provide a type-safe way to construct an action when its being dispatched. The `Login` action implements the `Action` interface to adhere to its structure. The `payload` in this example is an object of as username and password, that is additional metadata needed for the handling of the action.

Instantiate a new instance of the action to use when dispatching.

```ts
store.dispatch(new Login({ username: 'test', password: 'test' }));
```

The `Login` action has very specific context about where the action came from and what event happened.

- The category of the action is captured within the square brackets `[]`.
- The category is used to group actions for a particular area, whether it be a component page, backend API, or browser API.
- The `Login` text after the category is descriptive text about what event occurred from this actions. In this case, the user clicked a login button from the login page to attempt to authenticate with a username and password.

## Creating action unions

The consumers of actions, whether it be reducers or effects use the type information from an action to determine whether they need to handle the action. Actions are grouped together by feature area, but also need to expose the action type information. Looking at the previous example of the `Login` action, you'll define some additional type information for the actions.

```ts
import { Action } from '@ngrx/store';

export enum ActionTypes {
  Login = '[Login Page] Login',
}

export class Login implements Action {
  readonly type = ActionTypes.Login;

  constructor(public payload: { username: string; password: string }) {}
}

export type Union = Login;
```

Instead of putting the action type string directly in the class, the `[Login Page] Login` string is now provided in the `ActionTypes` enum. Also, an additional `Union` type is exported with the `Login` class. These additional exports allows you to take advantage of [discriminated unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html) in TypeScript. Switch statements use the provided `Union` to determine the correct shape of the action being consumed in each case. The `ActionTypes` are now reusable in your reducer functions as case statements, and filters for side effects. The `Union` is provided to your reducer function to constrain the available actions that are handled in that reducer function.

## Next Steps

Actions only responsibility are to express unique events and intents. Learn how they are handled in the guides below.

- [Reducers](guide/store/reducers)
- [Effects](guide/effects)
