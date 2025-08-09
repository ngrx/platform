# Walkthrough

The following example more extensively utilizes the key concepts of store to manage the state of book list, and how the user can add a book to and remove it from their collection within an Angular component. Try the <live-example name="store-walkthrough" noDownload></live-example>.

## Tutorial

1.  Generate a new project using StackBlitz <ngrx-docs-stackblitz name="ngrx-start"></ngrx-docs-stackblitz> and create a folder named `book-list` inside the `app` folder. This folder is used to hold the book list component later in the tutorial. For now, let's start with adding a file named `books.model.ts` to reference different aspects of a book in the book list.

<ngrx-code-example header="src/app/book-list/books.model.ts" path="store-walkthrough/src/app/book-list/books.model.ts">

</ngrx-code-example>

2.  Right click on the `app` folder to create a state management folder `state`. Within the new folder, create a new file `books.actions.ts` to describe the book actions. Book actions include the book list retrieval, and the add and remove book actions.

<ngrx-code-example header="src/app/state/books.actions.ts" path="store-walkthrough/src/app/state/books.actions.ts">

</ngrx-code-example>

3.  Right click on the `state` folder and create a new file labeled `books.reducer.ts`. Within this file, define a reducer function to handle the retrieval of the book list from the state and consequently, update the state.

<ngrx-code-example header="src/app/state/books.reducer.ts" path="store-walkthrough/src/app/state/books.reducer.ts">

</ngrx-code-example>

4. Create another file named `collection.reducer.ts` in the `state` folder to handle actions that alter the user's book collection. Define a reducer function that handles the add action by appending the book's ID to the collection, including a condition to avoid duplicate book IDs. Define the same reducer to handle the remove action by filtering the collection array with the book ID.

<ngrx-code-example header="src/app/state/collection.reducer.ts" path="store-walkthrough/src/app/state/collection.reducer.ts">

</ngrx-code-example>

5.  Import the `StoreModule` from `@ngrx/store` and the `books.reducer` and `collection.reducer` file.

<ngrx-code-example header="src/app/app.module.ts (imports)" path="store-walkthrough/src/app/app.module.1.ts" region="partialTopLevelImports">

</ngrx-code-example>

6.  Add the `StoreModule.forRoot` function in the `imports` array of your `AppModule` with an object containing the `books` and `booksReducer`, as well as the `collection` and `collectionReducer` that manage the state of the book list and the collection. The `StoreModule.forRoot()` method registers the global providers needed to access the `Store` throughout your application.

<ngrx-code-example header="src/app/app.module.ts (StoreModule)" path="store-walkthrough/src/app/app.module.1.ts" region="storeModuleAddToImports">

</ngrx-code-example>

7. Create the book list and collection selectors to ensure we get the correct information from the store. As you can see, the `selectBookCollection` selector combines two other selectors in order to build its return value.

<ngrx-code-example header="src/app/state/books.selectors.ts" path="store-walkthrough/src/app/state/books.selectors.ts">

</ngrx-code-example>

8. In the `book-list` folder, we want to have a service that fetches the data needed for the book list from an API. Create a file in the `book-list` folder named `books.service.ts`, which will call the Google Books API and return a list of books.

<ngrx-code-example header="src/app/book-list/books.service.ts" path="store-walkthrough/src/app/book-list/books.service.ts">

</ngrx-code-example>

9. In the same folder (`book-list`), create the `BookListComponent` with the following template. Update the `BookListComponent` class to dispatch the `add` event.

<ngrx-code-example header="src/app/book-list/book-list.component.html" path="store-walkthrough/src/app/book-list/book-list.component.html">

</ngrx-code-example>

<ngrx-code-example header="src/app/book-list/book-list.component.ts" path="store-walkthrough/src/app/book-list/book-list.component.ts">

</ngrx-code-example>

10. Create a new _Component_ named `book-collection` in the `app` folder. Update the `BookCollectionComponent` template and class.

<ngrx-code-example header="src/app/book-collection/book-collection.component.html" path="store-walkthrough/src/app/book-collection/book-collection.component.html">

</ngrx-code-example>

<ngrx-code-example header="src/app/book-collection/book-collection.component.ts" path="store-walkthrough/src/app/book-collection/book-collection.component.ts">

```ts
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Book } from '../book-list/books.model';

@Component({
  selector: 'app-book-collection',
  templateUrl: './book-collection.component.html',
  styleUrls: ['./book-collection.component.css'],
})
export class BookCollectionComponent {
  @Input() books: ReadonlyArray<Book> = [];
  @Output() remove = new EventEmitter<string>();
}
```

</ngrx-code-example>

11. Add `BookListComponent` and `BookCollectionComponent` to your `AppComponent` template, and to your declarations (along with their top level import statements) in `app.module.ts` as well.

<ngrx-code-example header="src/app/app.component.html (Components)" path="store-walkthrough/src/app/app.component.html" region="components">

</ngrx-code-example>

<ngrx-code-example header="src/app/app.module.ts (Final)" path="store-walkthrough/src/app/app.module.ts">

</ngrx-code-example>

12. In the `AppComponent` class, add the selectors and corresponding actions to dispatch on `add` or `remove` method calls. Then subscribe to the Google Books API in order to update the state. (This should probably be handled by NgRx Effects, which you can read about [here](guide/effects). For the sake of this demo, NgRx Effects is not being included).

<ngrx-code-example header="src/app/app.component.ts" path="store-walkthrough/src/app/app.component.ts">

</ngrx-code-example>

And that's it! Click the add and remove buttons to change the state.

Let's cover what you did:

- Defined actions to express events.
- Defined two reducer functions to manage different parts of the state.
- Registered the global state container that is available throughout your application.
- Defined the state, as well as selectors that retrieve specific parts of the state.
- Created two distinct components, as well as a service that fetches from the Google Books API.
- Injected the `Store` and Google Books API services to dispatch actions and select the current state.
