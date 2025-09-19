# Walkthrough

The following example more extensively utilizes the key concepts of store to manage the state of book list, and how the user can add a book to and remove it from their collection within an Angular component. To build the example, follow the steps in the tutorial below.

The full example is available on StackBlitz:

<ngrx-docs-stackblitz name="store-walkthrough" embedded="true"></ngrx-docs-stackblitz>

## Tutorial

1. Generate a new project using the <ngrx-docs-stackblitz name="ngrx-start"></ngrx-docs-stackblitz> and create a folder named `book-list` inside the `src` folder. This folder is used to hold the book list component later in the tutorial. For now, let's start with adding a file named `book.ts` to reference different aspects of a book in the book list.

<ngrx-code-example header="src/book-list/book.ts" path="store-walkthrough/src/book-list/book.ts">
</ngrx-code-example>

1. Right click on the `app` folder to create a state management folder `state`. Within the new folder, create a new file `books.actions.ts` to describe the book actions. Book actions include the book list retrieval, and the add and remove book actions.

<ngrx-code-example header="src/state/books.actions.ts" path="store-walkthrough/src/state/books.actions.ts">
</ngrx-code-example>

3. Right click on the `state` folder and create a new file labeled `books.reducer.ts`. Within this file, define a reducer function to handle the retrieval of the book list from the state and consequently, update the state.

<ngrx-code-example header="src/state/books.reducer.ts" path="store-walkthrough/src/state/books.reducer.ts">
</ngrx-code-example>

4. Create another file named `collection.reducer.ts` in the `state` folder to handle actions that alter the user's book collection. Define a reducer function that handles the add action by appending the book's ID to the collection, including a condition to avoid duplicate book IDs. Define the same reducer to handle the remove action by filtering the collection array with the book ID.

<ngrx-code-example header="src/state/collection.reducer.ts" path="store-walkthrough/src/state/collection.reducer.ts">
</ngrx-code-example>

5. Add the `provideStore` function in the `providers` array of your `app.config.ts` with an object containing the `books` and `booksReducer`, as well as the `collection` and `collectionReducer` that manage the state of the book list and the collection. The `provideStore` function registers the global providers needed to access the `Store` throughout your application.

<ngrx-code-example header="src/app.config.ts" path="store-walkthrough/src/app.config.ts">
</ngrx-code-example>

6. Create the book list and collection selectors to ensure we get the correct information from the store. As you can see, the `selectBookCollection` selector combines two other selectors in order to build its return value.

<ngrx-code-example header="src/state/books.selectors.ts" path="store-walkthrough/src/state/books.selectors.ts">
</ngrx-code-example>

7. In the `book-list` folder, we want to have a service that fetches the data needed for the book list from an API. Create a file in the `book-list` folder named `books.service.ts`, which will call the Google Books API and return a list of books.

<ngrx-code-example header="src/book-list/books-service.ts" path="store-walkthrough/src/book-list/books-service.ts">
</ngrx-code-example>

8. Add the `HttpClient` module using the `provideHttpClient` provider in the `app.config.ts` file in order to make HTTP requests using the `HttpClient`.

<ngrx-code-example header="src/app.config.ts" path="store-walkthrough/src/app.config.ts">
</ngrx-code-example>

9. In the same folder (`book-list`), create the `BookList` with the following template. Update the `BookList` class to dispatch the `add` event.

<ngrx-code-example header="src/book-list/book-list.ts" path="store-walkthrough/src/book-list/book-list.ts">
</ngrx-code-example>

10. Create a new _Component_ named `book-collection` in the `app` folder. Update the `BookCollection` template and class.

<ngrx-code-example header="src/book-collection/book-collection.ts" path="store-walkthrough/src/book-collection/book-collection.ts">
</ngrx-code-example>

11. Add `BookList` and `BookCollection` to your `App` template, and to your imports in `app.ts` as well.

<ngrx-code-example header="src/app.ts" path="store-walkthrough/src/app.ts">
</ngrx-code-example>

12. In the `App` class, add the selectors and corresponding actions to dispatch on `add` or `remove` method calls. Then subscribe to the Google Books API in order to update the state. (This should probably be handled by NgRx Effects, which you can read about [here](guide/effects). For the sake of this demo, NgRx Effects is not being included).

<ngrx-code-example header="src/app.ts" path="store-walkthrough/src/app.ts">
</ngrx-code-example>

And that's it! Click the add and remove buttons to change the state.

Let's cover what you did:

- Defined actions to express events.
- Defined two reducer functions to manage different parts of the state.
- Registered the global state container that is available throughout your application.
- Defined the state, as well as selectors that retrieve specific parts of the state.
- Created two distinct components, as well as a service that fetches from the Google Books API.
- Injected the `Store` and Google Books API services to dispatch actions and select the current state.
