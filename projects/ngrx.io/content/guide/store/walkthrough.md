# Walkthrough

The following example more extensively utilizes the key concepts of store to manage the state of book list, and how the user can add a book to and remove it from their collection within an Angular component. Try the <live-example name="store-walkthrough" noDownload></live-example>.

## Tutorial

1.  Generate a new project using StackBlitz <live-example name="ngrx-start" noDownload></live-example>.

2.  Right click on the `app` folder in StackBlitz. Create a state management folder `state`, and within the new folder, name a new file `books.actions.ts` to describe the book actions. Book actions include the book list retrieval, and the add and remove book actions.

<code-example header="src/app/state/books.actions.ts" path="store-walkthrough/src/app/state/books.actions.ts">
</code-example>

3.  Right click on the `state` folder and create a new file labeled `books.reducer.ts`. Within this file, define a reducer function to handle the retrieval of the book list from the state and consequently, update the state.

<code-example header="src/app/state/books.reducer.ts" path="store-walkthrough/src/app/state/books.reducer.ts">
</code-example>

4. Create another file named `collection.reducer.ts` in the `state` folder to handle actions that alter the user's book collection. Define a reducer function that handles the add action by appending the book's ID to the collection, including a condition to avoid duplicate book IDs. Define the same reducer to handle the remove action by filtering the collection array with the book ID.

<code-example header="src/app/state/collection.reducer.ts" path="store-walkthrough/src/app/state/collection.reducer.ts">
</code-example>

5.  Import the `StoreModule` from `@ngrx/store` and the `books.reducer` and `collection.reducer` file.

<code-example header="src/app/app.module.ts (imports)" path="store-walkthrough/src/app/app.module.ts" region="imports">
</code-example>

6.  Add the `StoreModule.forRoot` function in the `imports` array of your `AppModule` with an object containing the `books` and `booksReducer`, as well as the `collection` and `collectionReducer` that manage the state of the book list and the collection. The `StoreModule.forRoot()` method registers the global providers needed to access the `Store` throughout your application.

<code-example header="src/app/app.module.ts (StoreModule)" path="store-walkthrough/src/app/app.module.1.ts">
</code-example>

7. Create a new file in `state` named `app.state.ts`. Define the state as a list of books and a list of collection books' IDs. 

<code-example header="src/app/state/app.state.ts" path="store-walkthrough/src/app/state/app.state.ts">
</code-example>

8. Create the book list and collection selectors to ensure we get the correct information from the store. As you can see, the `selectBookCollection`  selector combines two other selectors in order to build its return value.

<code-example header="src/app/state/books.selectors.ts" path="store-walkthrough/src/app/state/books.selectors.ts">
</code-example>

9.  Create a folder named `book-list`, which we will be using soon to hold our book list component. For now, let's start with adding a file named `books.model.ts` to reference different aspects of a book in the book list.

<code-example header="src/app/book-list/books.model.ts" path="store-walkthrough/src/app/book-list/books.model.ts">
</code-example>

10. In the same folder, we will have a service that fetches the data needed for the book list from an API. Create a file in the `book-list` folder named `books.service.ts`, which will call the Google Books API and return a list of books.

<code-example header="src/app/book-list/books.service.ts" path="store-walkthrough/src/app/book-list/books.service.ts">
</code-example>

11. In the `book-list` folder, create the `BookListComponent` with the following template. Update the `BookListComponent` class to dispatch the `add` event.

<code-example header="src/app/book-list/book-list.component.html" path="store-walkthrough/src/app/book-list/book-list.component.html">
</code-example>

<code-example header="src/app/book-list/book-list.component.ts" path="store-walkthrough/src/app/book-list/book-list.component.ts">
</code-example>

12. Create a new _Component_ named `book-collection` in the `app` folder. Update the `BookCollectionComponent` template and class.

<code-example header="src/app/book-collection/book-collection.component.html" path="store-walkthrough/src/app/book-collection/book-collection.component.html">
</code-example>

<code-example header="src/app/book-collection/book-collection.component.ts" path="store-walkthrough/src/app/book-collection/book-collection.component.ts">
</code-example>

13.  Add `BookListComponents` and `BookCollectionComponent` to your `AppComponent` template, and to your declarations in `app.module.ts` as well. 

<code-example header="src/app/app.component.html (Components)" path="store-walkthrough/src/app/app.component.html" region="components">
</code-example>

<code-example header="src/app/app.module.ts" path="store-walkthrough/src/app/app.module.ts" region="declareComponents">
</code-example>

14. In the `AppComponent` class, add the selectors and corresponding actions to dispatch on `add` or `remove` method calls. Then subscribe to the Google Books API in order to update the state. (This should probably be handled by NgRx Effects, which you can read about [here](guide/effects). For the sake of this demo, NgRx Effects is not being included).

<code-example header="src/app/app.component.ts" path="store-walkthrough/src/app/app.component.ts">
</code-example>

And that's it! Click the add and remove buttons to change the state.

Let's cover what you did:

- Defined actions to express events.
- Defined two reducer functions to manage different parts of the state.
- Registered the global state container that is available throughout your application.
- Defined the state, as well as selectors that retrieve specific parts of the state.
- Created two distinct components, as well as a service that fetches from the Google Books API. 
- Injected the `Store` and Google Books API services to dispatch actions and select the current state.

