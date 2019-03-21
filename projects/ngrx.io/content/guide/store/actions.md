# Actions

Actions are one of the main building blocks in NgRx. Actions express _unique events_ that happen throughout your application. From user interaction with the page, external interaction through network requests, and direct interaction with device APIs, these and more events are described with actions.

## Introduction

Actions are used in many areas of NgRx. Actions are the inputs and outputs of many systems in NgRx. Actions help you to understand how events are handled in your application. This guide provides general rules and examples for writing actions in your application.

## An action is an object

We've talked above what an action is on a conceptual level, that is `inputs` and `outputs` of our system. On a more tangible level though it is an object with the fields `type` and with the optional field `payload`. The `type` field is meant to communicate *what* you want done like adding an item to a list or incrementing a number. Depending on what you want done you may need additional information. That additional information is in the form of the field `payload`. This field should contain what information you are trying to change the state with like the product you are trying to add to a list or the `id` of the product you are trying to remove from the list. 

Below is an example of simple action that only carries the intent, i.e the `type` but there is also an example of an action that has a payload, i.e it carries some data that we want to make part of our state:

<code-example header="Action">
const action = { type: 'INCREMENT' };

const actionWithPayload = { 
  type: '[Products] add', 
  payload: { id: 1, name: 'Movie' }  
};
</code-example>

Above we are demonstrating two types of actions in the form of `action`, which is a simple action that only contains the field `type`. In our second action `actionWithPayload` we show an action that utilizes both fields `type` and `payload`. This is really as complicated as an action usually gets. 

Because we are using Typescript in Angular lets look at if we can be using constructs such as `Interfaces` and `Classes` to our advantage and make actions even more type safe.

## The need for type safety
As we mentioned above we are using Angular and Angular uses Typescript and thereby it makes sense to use some of the language constructs of Typescript to make our actions typesafe. So why would we want to make them typesafe in the first place? Well, remember when we constructed an action in our previous section and assigned a string value to the `type` field? That is actually quite error prone, cause you might mispel that string value. It's maybe hard to understand why a mispel would be such a big deal but let's very briefly mention how actions are used. 

### Dispatching an action
Actions are being *dispatched* to reducer functions. What does that mean? Normally when you set up NGRX you do so be setting up your store like this:

<code-example header="app.module.ts and products.reducer.ts">
// products.reducer.ts
export function productsReducer(state = [], action) {
  switch(action.type) {
    case '[Products] add':
      return [...state, action.payload]
    default:
      return state;
  }
}

// app.module.ts
StoreModule.forRoot({
  products: productsReducer
})
</code-example>

When you do that you say that `products` is a thing that will exist in a store and it's state is something we can either *read* or *change*. The way we *read* the value is by subscribing to it using the `Store` service inside of component usually like so:

<code-example header="app.module.ts">
constructor(private store: Store<AppState>) {
  this.store.pipe(
    select('products')
  ).subscribe(products => console.log('products', products));
}
</code-example>

The way we *change* we change our data in the store is by calling the same `Store` service and its `dispatch()` method. The `dispatch()` method will *dispatch*, i.e send an action to the `store` and try to match that to a reducer and specifically a matching case in a reducer. So if we in our component where to do this:

<code-example header="products-list.component.ts">
add() {
  this.store.dispatch({ 
    type: '[Products] add', 
    { id: 1, name: this.name } 
  });
}
</code-example>

Then we would match the case in our `products.reducer.ts`:

<code-example header="products.reducer.ts">
case '[Products] add':
  return [...state, action.payload]
</code-example>

The end result would be that our `products` store property would now contain one more product.

### When an action fails
This all seems good right. Set up a property, associate to a reducer, dispatch an action and our state changes. All is good or? All is good UNTIL you mispel your `action.type`. Consider the following code below:

<code-example header="Reducer example">
function reducer(state = 0, action) {
  switch(action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
}
// this WON'T work as intended 
reducer({ type: 'INREMENT' })

// this WILL work, cause it's correctly spelled
reducer({ type: 'INCREMENT' })
</code-example>

Above we are showcasing how actions are used, namely that they are objects being sent to a reducer functions that lets them jump through a `switch` construct. We are also demonstrating how the spelling of your action matters. If we spell it `INREMENT` it wont hit the intended case but if we correctly spell it `INCREMENT` it will hit the correct case. 

## The Action interface
Now we have made the case for why type safety is a good idea. For that reason the `Action` interface exists to make this easy for you when you need to create actions.

The interface is made up of the following:

<code-example header="Action Interface">
interface Action {
  type: string;
}
</code-example>

The interface has a single property, the `type`, represented as a string. At it's core that's what an action is, an object containing a `type`. The reason the `payload` isn't a property on the `Action` interface is that it's considered *additional context* and is not mandatory. We can definitely add a `payload` property to the class implementing the above interface though.

## Writing actions
Lets see if we can use our `Action` interface by letting a class implement it. But first let's mention some general rules on how to write good actions within your application:

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
As you can see above we implemented the `Action` interface by creating the class `Login`. In doing so we also used the `readonly` keyword on the `type` field. Thereby we ensured that you can't change the value of `type` after we've instantiated an object from the `Login` class. 

We did another thing as well, namely adding the `payload` to the constructor of the `Login` class and we used the keyword `public` to do it. Using an accessor like `public`, `private` or `protected` in a constructor is a nice short hand for creating the field as well as pass it in as a parameter into the constructor. The below code in plain Javascript looks like the following:

<code-example header="Action in plain JavaScript">
class Login {
  constructor(payload) {
    this.type = '[Login Page] Login';
    this.payload = payload;
  }
}
</code-example>
As you can see above we lose quite a bit of features when using plain JavaScript like: 
- having fields like `payload` created for us via the constructor, 
- ensuring we can't change the `type` value after instantiation. 
- we would also need to perform checks on the `payload` being passed in to ensure it contains a `username` and `password`. 

At this point I hope you want to return to the nice and typesafe world of Typescript. Lets talk about Action creation next. 

### Creating an Action
Ok, time has come to instantiate an object from our `Login` class and thereby create an action. One of the common places to create an action is in the context of being inside of a component and responding to a user event. So imagine we are inside of `login-page.component.ts` and the user has just entered their `username` and `password` and clicked on a button to login. At this point the `clicked()` method is invoked on our component. The code in the component looks as follows:

<code-example header="login-page.component.ts">
click(username: string, password: string) {
  store.dispatch(new Login({ username: username, password: password }));
}
</code-example>
We do two things here:
- instantiate an action and pass in an object literal containing our username and password
- dispatch the action by calling `store.dispatch()`

When we instantiate our action `Login` we see that we pass an object literal. Wasn't that what we were trying to get away from by using Typescript? Actually the compiler helps us here because we declare that the constructor will accept a parameter `payload` that requires a `username` and `password` as properties. Let's show that part again from the definition of our `Login` action:

<code-example header="excerpt from Login action">
  constructor(public payload: { username: string; password: string }) {}
</code-example>
As you can see Typescript saves us many times in our `click()` method in `login-component.ts`, it saves us by us instantiating `Login` over create an object literal like this `{ type: '[Login Page] Login', payload: { username, password } }`, we know how easy it is to mispel a string. We are also saved by defining a shape of the `payload` field to ensure our `password` and `username` properties are set. 

### Action context
The `Login` action has very specific context about where the action came from and what event happened.

- The category of the action is captured within the square brackets `[]`.
- The category is used to group actions for a particular area, whether it be a component page, backend API, or browser API.
- The `Login` text after the category is a description about what event occurred from this action. In this case, the user clicked a login button from the login page to attempt to authenticate with a username and password.

## Improving our actions
So far we've been creating actions like this:

<code-example header="Login action">
import { Action } from '@ngrx/store';

export class Login implements Action {
  readonly type = '[Login Page] Login';

  constructor(public payload: { username: string; password: string }) {}
}
</code-example>

We've discussed previously how the above code, using Typescript, provides a lot of benefits over creating Actions using plain JavaScript and object literals or even using classes. We can take this one step further though, by using enums. Right now our `type` is a string. Let's first create an enum like so:

<code-example header="An ActionTypes enum">
export enum ActionTypes {
  Login = '[Login Page] Login',
}
</code-example>
As you can see above we've moved our `type` value into the `ActionTypes` enum and now we can perform the next step which is to replace our `type` value with our enum value:

<code-example header="login-page.actions.ts">
import { Action } from '@ngrx/store';

export enum ActionTypes {
  Login = '[Login Page] Login',
}

export class Login implements Action {
  readonly type = ActionTypes.Login;

  constructor(public payload: { username: string; password: string }) {}
}
</code-example>

Now this scales. Imagine we need a new action `Logout`. That class can use the same enum. The `Logout` class would look like so:

<code-example header="login-page.actions.ts">
import { Action } from '@ngrx/store';

export enum ActionTypes {
  Login = '[Login Page] Login',
  Logout = '[Login Page] Logout'
}

export class Logout implements Action {
  readonly type = ActionTypes.Logout
}

export class Login implements Action {
  readonly type = ActionTypes.Login;

  constructor(public payload: { username: string; password: string }) {}
}
</code-example>

Above we've added the `Logout` type to our `ActionTypes` enum and we've also created our `Logout` action class. As you can see everything that goes together can be using the same enum.

### Union types
Ok, so we've come to a point where we have defined two different actions `Login` and `Logout`. Let's see what an accompanying reducer could look like:

<code-example header="Login, Logout reducer">
function reducer(state, action) {
  switch(action.type) {
    // define code here
  }
}
</code-example>

As you can see above we have no typesafety. We could be feeding this `reducer()` function any kind of parameters. So lets fix that shall we ?
The first thing we are going to do is add something called a union type. Union types works in the following way:

<code-example header="Example union">
type Cars = 'Ferrari' | 'Wolkswagen' | 'Volvo';

function car(car: Cars) {
  console.log(car);
}

car('Ferrari'); // OK
car('Porsche'); // Not OK
car('Volvo') // OK
</code-example>

As you can see from above code we are defining the type `Cars` and what we are doing is adding a number of values that it can assume. Each value it can assume are separated by a pipe, `|`. The example invocation of the method `car()` tells us that `Ferrari` and `Volvo` are ok to add but not `Porsche` as it's not part of the definition of our union type.

So why is this interesting for our `reducer()` function? Well union types can take any type. Instead of it being different strings it could be class instead. The part we want to improve on our `reducer()` function is the `action` parameter. Lets head back to our `login-page.actions.ts` file and make a union type out our Action classes, like so:

<code-example header="login-page.actions.ts">
import { Action } from '@ngrx/store';

export enum ActionTypes {
  Login = '[Login Page] Login',
  Logout = '[Login Page] Logout'
}

export class Logout implements Action {
  readonly type = ActionTypes.Logout
}

export class Login implements Action {
  readonly type = ActionTypes.Login;

  constructor(public payload: { username: string; password: string }) {}
}

export type LoginPage = Login | Logout;
</code-example>

Above we've added the type `LoginPage` at the very end as you can see we say it consists of `Login` and `Logout` action classes. Lets head back to our reducer and now and fix it:

<code-example header="Login, Logout reducer">
import { LoginPage, Login, Logout } from './login-page.actions.ts';

function reducer(state, action: LoginPage) {
  switch(action.type) {
    // define code here
  }
}

// both of these two works
reducer({}, new Login({ username: 'chris', password: 'test123' }));
reducer({}, new Logout());

// wouldn't compile
reducer({}, { type: 'INCREMENT' });
</code-example>

### Further reading on Union Types

These additional exports allow you to take advantage of [discriminated unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html) in TypeScript. Why this is important is covered in the [reducers](guide/store/reducers) and [effects](guide/effects) guides.

## Next Steps

Action's only responsibilities are to express unique events and intents. Learn how they are handled in the guides below.

- [Reducers](guide/store/reducers)
- [Effects](guide/effects)
