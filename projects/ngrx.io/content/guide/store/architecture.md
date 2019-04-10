# Architecture

NGRX is based on the architectural pattern Redux. Redux in turn is based upon the general pattern Pub-Sub or Publish, Subscribe. This means we send a message to a central data store and a number of listeners on that data store are being told there is a new message. 

A very typical usage for this is a Chat application. In a Chat application, the people in the chat room can communicate with specific participants or they can broadcast what they say to the entire chat room. Its messages being sent, some messages meant for specific people or for a group. 

Let's take this chat room analogy and apply it generally to an application. Every time we do something in an application like adding a product to a list or change the language or theme of the application some components want to be notified about it. In the case of a product being added to a list, a product list page component probably is the one that cares the most whereas with a change of the application language that would be an application wide change. 

So why do we need a Pub-Sub pattern on the above application? The answer is loose coupling. If we don't use a pattern like that we most likely have a service talking directly to a component and that's not usually a problem, at first. When you start adding other components and suddenly they might want to show the same data and they might even want to change that data. Without our Pub-Sub pattern it's very easy to make a mistake along the road where one component changes the data and the change doesn't reach the other component and suddenly the components are not in agreement on what the data should be. 

Ok, so we managed to find some problem areas like
- tight coupling, making it hard to add new components
- corrupted state, we made a mistake and suddenly one or more components are not in agreement what the state should be

## Redux
As stated earlier, Redux is a variant of the Pub-Sub pattern and it uses certain constructs to make sure we can listen to data from one place and also change the data in a predictable way. 

### Basic concepts
For Redux to work properly there are some players in there that needs to exist, those are:

- The store, this is the single source of truth, the one place where your data lives, your state. You read from it and if you want to make changes, this is the data that ultimately gets changed. 
- Reducers, these are functions, guards if you will that ensures that changes happen to the store in a predictable way. Changes to the store can only happen through a reducer. 
- Actions, these are messages that carry an intent and sometimes a payload. Typical intents are 'Adding a product', 'Login', 'Remove customer'. These are things you want to do. The payload is what we need to change the data to. In the case of 'Adding a product', the payload would be the product we would want to add. Actions gets *dispatched* to a Reducer that processes the action and the end result of that processing is a change to the state of the store

### Redux flow

The first thing that happens in Redux is the following:
- a store is created
- listeners are registered to the Store. Listeners usually only cares about specific parts of the state in the Store. The Store when used in an Application is usually a snapshot of what your application contains at a given point and can looks something like this:

```json
{
  "language": "english",
  "products": [{ "id": 1, "name": "movie" }]
}
```
If this is our state above that means the application is showing all its text in `english` and somewhere we are rendering a list of products. Let's say that now the user changes the language in the application, from `english` from `french`. How would we change this? 

#### Changing our state in the store

This is where we create an action representing our intent and because we want to change to something specific we need to have a payload with the value `french`. An action is nothing more than an object looking like this:

<code-example header="">
const action = { type: '[Language] change', payload: 'french' }
</code-example>

At this point we want to *dispatch* this action so our intended change ends up the store. As we said before Reducers are the guards of the store. Therefore we need to pass our action to a Reducer. 

Reducers are the guards of the store as has been mentioned a couple of times. So what other benefits do they have? We know they are functions but a thing that makes Redux really great is that it's predictable. What do we mean by that? Predictability is something we achieve by having our Reducers be pure functions. Ok, another concept, what does pure functions mean? Pure functions are functions that act like mathematical functions, that given the same input data they produce the same output data. Let's see an example:

<code-example header="A pure function">
function sum(lhs, rhs) { 
  return lhs + rhs; 
}

sum(1,1); // 2
sum(3,3); // 6 
</code-example>

Ok, so what does an *impure* function look like? Like this:

<code-example header="An impure function">
let sum = 0;

function sum(lhs, rhs) { 
  return sum + lhs + rhs; 
}

sum(3,3) // 6
sum(3,3) // 12
</code-example>

As you can see above we our *impure* example this a function that outputs a different result despite being invoked with the same input parameters.

How does this relate to a Reducer function though? Well a Reducer function only relies on input that consists of its previous state and the action we are about to pass it like so:

<code-example header="A reducer">
function reducer(state, action) {
  switch(action.type) {
    case '[Language] change':
      return action.payload;
    default:
      return state;
  }
}
</code-example>

Ok, so we have a reducer, so how do we use it? Well, that's just a matter of invoking the reducer, like so:

<code-example header="invoking our reducer">
let state = reducer('', { type: '[Language] change', payload: 'english' }); //english

state = reducer(state, { type: '[Language] change', payload: 'french' }) //french
</code-example>

As you can see above we are invoking the reducer first with an empty string and an action saying we want to change to `english`. At that point our `state` variable is updated to contain the value `english`. In our next invocation we change the value by passing the existing `state` variable as the first parameter and then as our second parameter we pass an action object that will change the value to `french`. 

#### Introducing a store
At this point we know about actions and reducers but we might not understand how the state makes it into a store, so what do we do? Well this is an implementation detail and it might differ depending on wether we are talking Redux for React or Angular or some other framework. However, let's look at a very small naive implementation so you get a sense of how it works:

<code-example header="naive store">
class Store {
  constructor() {
    this.state = {
      language: '',
      products: []
    }
  }

  select(fn) {
    return fn(this.state);
  }

  dispatch(action) {
    this.state = compute(this.state, action);
    // add a way to broadcast this store change to listeners
  }

  compute(state, action) {
    return {
      language: languageReducer(state.language, action),
      products: productsReducer(state.products, action) 
    }
  }
}
</code-example>
We have on purpose left out the part on how we subscribe to the store and how we broadcast a new store state after it has been changed by a call to `dispatch()`. The reason for that is that it's implementation specific to what Redux implementation we are talking about. In some implementations EventEmitters are being used, in NGRX it's RxJS. 

At this point we have mentioned all major concepts in Redux like `action`, `reducer` and `store`. We've even shown a very naive implementation so you understand how all the pieces go together. Next is understanding where NGRX comes with its specific solution and especially why the heavy usage of Typescript makes sense and helps creating a better experience.

## Introducing NGRX and the need for type safety
NGRX is a Redux implementation meant for Angular and it makes heave use of Typescript and RxJS. The biggest reason is probably typesafety. 

So why would we want to make them typesafe in the first place? Well, remember when we constructed an action in our previous section and assigned a string value to the `type` field? That is actually quite error prone, cause you might mispel that string value. It's maybe hard to understand why a mispel would be such a big deal but let's very briefly mention how actions are used. 

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

As you can see above we have no type safety. We could be feeding this `reducer()` function any kind of parameters. So lets fix that shall we?
The first thing we are going to do is add something called a union type. Union types works in the following way:

<code-example header="Example union">
type Cars = 'Ferrari' | 'Volkswagen' | 'Volvo';

function car(car: Cars) {
  console.log(car);
}

car('Ferrari'); // OK
car('Porsche'); // Not OK
car('Volvo') // OK
</code-example>

As you can see from the above code we are defining the type `Cars` and what we are doing is adding a number of values that it can assume. Each value it can assume are separated by a pipe, `|`. The example invocation of the method `car()` tells us that `Ferrari` and `Volvo` are ok to add but not `Porsche` as it's not part of the definition of our union type.

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

## Summary

We have discussed generally the Pub-Sub architecture and zoomed in on Redux and talked about the different artifacts making out Redux. We've even shown a naive implementation of Redux so we understand how the parts go together. Thereafter we have gone into different problems that we can encounter and how using different constructs in Typescript helps us mitigate that.  
