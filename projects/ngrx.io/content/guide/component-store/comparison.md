# Comparison of ComponentStore and Store
 
Both ComponentStore and Store are designed to manage the state in an Angular application, however
they are addressing different problems. These libraries are independent of each other, and,
depending on many factors, one or the other or even both in tandem would be recommended.
 
Among the factors that would influence which of the libraries (or both) should be used are the following:
* **Size of the application**. How many components does it have?
* **Interconnection of the app**. Are these components tied together, or are they independent
groups of components sub-trees?
* **Depth of component tree**. How many levels of depth does the component tree have?
* **State ownership**. Could there be a clear separation of state ownership at different
nodes of the components tree?
* **State lifespan**. Is the state needed throughout the lifespan of the application, or only when
some pages are displayed and we want to automatically clean it up when the user navigates somewhere
else?
* **Business Requirements**. How well are all of the business requirements understood and finalized before the
implementation of the app starts? Would it be changing frequently?
* **Lifespan of the app**. Is this a short-lived Minimum Viable Product (MVP) that would be discarded, a solution that won't need much support or changes once it's released, or is it a long-term product
that would be constantly changing, based on changing business needs?
* **Backend APIs**. Does the team have influence over backend(s) and the APIs that they provide?
 
The longer the lifespan of the app and the larger it is, the greater the need to separate how the
data is retrieved and how components are displaying it. That drives earlier separation of
*"Data Transfer Objects"* (aka *"Network Models"*) - the models used to communicate with backend(s) - and *"View Models"* - the models
used by components in the templates.
 
ComponentStore is responsible for managing smaller, more local state. While it's possible to have
multiple ComponentStores, one has to have a clear understanding of state ownership of each one of
them.

## Benefits and Trade-offs

ComponentStore and Global Store have many benefits, some of which are listed in the [introduction](guide/store/why#why-use-ngrx-store-for-state-management). They help organize state, make migrations to new APIs easier,
encapsulate changes and side-effects, make our components smaller, easier to test and more 
performant, but they are also introducing code complexity with **indirections**. 

<div class="alert is-important">

**Note:** It's important to understand what the cost is and why we are adding it.

</div>

Both of them bring [push-based architecture](https://medium.com/@thomasburlesonIA/push-based-architectures-with-rxjs-81b327d7c32d), which is the first indirection. The developer can no longer 
get the result of a service method call, instead they would be listening for Observable values
exposed by that service. The benefit, on the other side, is that the developer no longer has to worry what
is changing the state - all the component needs to know is that something has changed it. If the
component wants to change the state itself, it sends the message about it (either dispatches an 
Action in Store, or calls ComponentStore's `updater` or `effect`).

Actions are the second indirection. They are present in the Global Store only. There are many benefits 
of this indirection, such as:
* ability to trigger multiple effects/reducers at the same time
* greater scalability
* useful DevTools

ComponentStore doesn't have that indirection, however it also loses the above-mentioned benefits.

The scale of state that it works with has to be smaller, which brings another set of benefits, such as:
* ComponentStore that is tied to the specific node in the components tree, will be automatically cleaned up when that node is destroyed
* state is fully self-contained with each ComponentStore, and thus allows to have multiple 
independent instances of the same component
* provides simpler state management to small/medium sized apps

<div class="alert is-helpful">

The difference between the benefits and trade-offs of Stores make Global Store better suited for
managing global shared state, where ComponentStore shines managing more local, encapsulated state,
as well as component UI state.

</div>

Depending on the needs of the application, the developer might choose Store or ComponentStore, or,
in cases of the larger apps, both Store **and** ComponentStore.

## State ownership

The Global Store works with the **single** immutable object, that contains all of the shared state throughout
the application. There are multiple reducers, each one responsible for a particular **slice** of
state.

Each ComponentStore is fully responsible for its own state. There could be **many** different
ComponentStores, but each one should store its own distinct state.

<figure>
  <img src="generated/images/guide/component-store/state-structure.png" alt="Comparison of NgRx Store and Component Store state ownership or placement" width="100%" height="100%" />
</figure>

## File structure

ComponentStore is focused on a smaller part the state, and thus should contain not only the state
itself, but also every "prescription" of how it could be changed. All "`updater`s" and "`effect`s"
should be part of the ComponentStore, responsible for the specific state.

It makes ComponentStore less scalable - if there are too many updaters and effects in a single class,
then it quickly becomes unreadable.

Shared `select`ors should also be part of the ComponentStore, however downstream components might
have their component-specific details, such as aggregating all the info needed for their _"View Model"_.
In such cases, it's acceptable to create `ComponentStore<object>` that won't be managing state
and would contain a number of selectors.

<figure>
  <img src="generated/images/guide/component-store/file-structure.png" alt="Comparison of NgRx Store and Component Store file structures" width="100%" height="100%" />
</figure>
