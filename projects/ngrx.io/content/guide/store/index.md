# @ngrx/store

Store is RxJS powered global state management for Angular applications, inspired by Redux. Store is a controlled state container designed to help write performant, consistent applications on top of Angular.

## Key concepts

- [Actions](guide/store/actions) describe unique events that are dispatched from components and services.
- State changes are handled by pure functions called [reducers](guide/store/reducers) that take the current state and the latest action to compute a new state.
- [Selectors](guide/store/selectors) are pure functions used to select, derive and compose pieces of state.
- State is accessed with the `Store`, an observable of state and an observer of actions.

## Local state management

NgRx Store is mainly for managing global state across an entire application. In cases where you need to manage temporary or local component state, consider using [NgRx ComponentStore](guide/component-store). 

## Installation

Detailed installation instructions can be found on the [Installation](guide/store/install) page.

## Diagram

The following diagram represents the overall general flow of application state in NgRx. 

<figure>
  <img src="generated/images/guide/store/state-management-lifecycle.png" alt="NgRx State Management Lifecycle Diagram" width="100%" height="100%" />
</figure>

## Tutorial

The following tutorial shows you how to manage the state of book list, and how the user can add a book to and remove it from their collection within an Angular component. Try the <live-example name="store" noDownload></live-example>.

1.  Generate a new project using StackBlitz <live-example name="ngrx-start" noDownload></live-example>.

2.  Right click on the `app` folder in StackBlitz. Create a state management folder `state`, and within the new folder, name a new file `allBooks.actions.ts` to describe the book actions. Book actions include the book list retrieval, and the add and remove book actions.

<code-example header="src/app/state/allBooks.actions.ts" path="store/src/app/state/allBooks.actions.ts">
</code-example>

3.  Right click on the `state` folder and create a new file labeled `books.reducer.ts`. Within this file, define a reducer function to handle the retrieval of the book list from the state and consequently, send an update to the state.

<code-example header="src/app/state/books.reducer.ts" path="store/src/app/state/books.reducer.ts">
</code-example>

4. Create another file named `collection.reducer.ts` in the `state` folder to handle actions that alter the user's book collection. Define a reducer function that handles the add action by returning the state when the book ID already exists in the collection, and appends the book ID to the collection array if it does not. Define the same reducer to handle the remove action by filtering the collection array with the book ID.

<code-example header="src/app/state/collection.reducer.ts" path="store/src/app/state/collection.reducer.ts">
</code-example>

5.  Import the `StoreModule` from `@ngrx/store` and the `books.reducer` and `collection.reducer` file.

<code-example header="src/app/app.module.ts (imports)" path="store/src/app/app.module.ts" region="imports">
</code-example>

6.  Add the `StoreModule.forRoot` function in the `imports` array of your `AppModule` with an object containing the `books` and `booksReducer`, as well as the `collection` and `collectionReducer` that manage the state of book list and collection. The `StoreModule.forRoot()` method registers the global providers needed to access the `Store` throughout your application.

<code-example header="src/app/app.module.ts (StoreModule)" path="store/src/app/app.module.ts">
</code-example>

7. Create a new file in `state` named `state.ts`. Define the state as as a list of books and a list of collection books' IDs. 

<code-example header="src/app/state/state.ts" path="store/src/app/state/state.ts">
</code-example>

8. Create another file in `state` named `allBooks.selectors.ts`. Create book list and collection selectors that pass corresponding parts of the state as parameters. 

<code-example header="src/app/state/allBooks.selectors.ts" path="store/src/app/state/allBooks.selectors.ts">
</code-example>

9.  Create a new _Component_ named `book-list` in the `app` folder. Create a new file in the same folder named `books.service.ts`, which will call the Google Books API and return a list of books. 

<code-example header="src/app/book-list/books.service.ts" path="store/src/app/book-list/books.service.ts">
</code-example>

10. Update the `BookListComponent` template with a button to handle the `add` method. Similarly, update the `BookListComponent` class to dispatch the `add` event.

<code-example header="src/app/book-list/book-list.component.html" path="store/src/app/book-list/book-list.component.html">
</code-example>

<code-example header="src/app/book-list/book-list.component.ts" path="store/src/app/book-list/book-list.component.ts">
</code-example>

11. Create a new _Component_ named `book-collection` in the `app` folder. As with `BookListComponent`, update the `BookCollectionComponent` template and class in order to handle and dispatch the `remove` event.

<code-example header="src/app/book-collection/book-collection.component.html" path="store/src/app/book-collection/book-collection.component.html">
</code-example>

<code-example header="src/app/book-collection/book-collection.component.ts" path="store/src/app/book-collection/book-collection.component.ts">
</code-example>

12.  Add `BookListComponents` and `BookCollectionComponent` to your `AppComponent` template. 

<code-example header="src/app/app.component.html" path="store/src/app/app.component.html">
</code-example>

In the `AppComponent` class, add the selectors and corresponding actions to dispatch on add or remove. Subscribe to the Google Books API in order to update the state.

<code-example header="src/app/app.component.ts" path="store/src/app/app.component.ts">
</code-example>

And that's it! Click the add and remove buttons to change the state.

Let's cover what you did:

- Defined actions to express events.
- Defined two reducer functions to manage different parts of the state.
- Registered the global state container that is available throughout your application.
- Defined the state, as well as selectors that retrieve specific parts of the state.
- Created two  distinct components, as well as a service that fetches from the Google Books API. 
- Injected the `Store` and Google Books API services to dispatch actions and select the current state.

## Next Steps

Learn about the architecture of an NgRx application through [actions](guide/store/actions), [reducers](guide/store/reducers), and [selectors](guide/store/selectors).
