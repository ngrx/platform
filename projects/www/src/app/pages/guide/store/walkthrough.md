# Walkthrough

The following example more extensively utilizes the key concepts of store to manage the state of book list, and how the user can add a book to and remove it from their collection within an Angular component.

## Tutorial

1.  Generate a new project using StackBlitz <live-example name="ngrx-start" noDownload></live-example> and create a folder named `book-list` inside the `app` folder. This folder is used to hold the book list component later in the tutorial. For now, let's start with adding a file named `books.model.ts` to reference different aspects of a book in the book list.

<ngrx-code-example header="src/app/book-list/books.model.ts">

```ts
export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: Array<string>;
  };
}
```

</ngrx-code-example>

2.  Right click on the `app` folder to create a state management folder `state`. Within the new folder, create a new file `books.actions.ts` to describe the book actions. Book actions include the book list retrieval, and the add and remove book actions.

<ngrx-code-example header="src/app/state/books.actions.ts">

```ts
import { createActionGroup, props } from '@ngrx/store';
import { Book } from '../book-list/books.model';

export const BooksActions = createActionGroup({
  source: 'Books',
  events: {
    'Add Book': props<{ bookId: string }>(),
    'Remove Book': props<{ bookId: string }>(),
  },
});

export const BooksApiActions = createActionGroup({
  source: 'Books API',
  events: {
    'Retrieved Book List': props<{ books: ReadonlyArray<Book> }>(),
  },
});
```

</ngrx-code-example>

3.  Right click on the `state` folder and create a new file labeled `books.reducer.ts`. Within this file, define a reducer function to handle the retrieval of the book list from the state and consequently, update the state.

<ngrx-code-example header="src/app/state/books.reducer.ts">

```ts
import { createReducer, on } from '@ngrx/store';

import { BooksApiActions } from './books.actions';
import { Book } from '../book-list/books.model';

export const initialState: ReadonlyArray<Book> = [];

export const booksReducer = createReducer(
  initialState,
  on(BooksApiActions.retrievedBookList, (_state, { books }) => books)
);
```

</ngrx-code-example>

4. Create another file named `collection.reducer.ts` in the `state` folder to handle actions that alter the user's book collection. Define a reducer function that handles the add action by appending the book's ID to the collection, including a condition to avoid duplicate book IDs. Define the same reducer to handle the remove action by filtering the collection array with the book ID.

<ngrx-code-example header="src/app/state/collection.reducer.ts">

```ts
import { createReducer, on } from '@ngrx/store';
import { BooksActions } from './books.actions';

export const initialState: ReadonlyArray<string> = [];

export const collectionReducer = createReducer(
  initialState,
  on(BooksActions.removeBook, (state, { bookId }) =>
    state.filter((id) => id !== bookId)
  ),
  on(BooksActions.addBook, (state, { bookId }) => {
    if (state.indexOf(bookId) > -1) return state;

    return [...state, bookId];
  })
);
```

</ngrx-code-example>

5.  Import the `provideStore` from `@ngrx/store` and the `books.reducer` and `collection.reducer` file.

<ngrx-code-example header="src/app/app.config.ts (imports)">

```ts
import { provideStore } from '@ngrx/store';

import { booksReducer } from './state/books.reducer';
import { collectionReducer } from './state/collection.reducer';
```

</ngrx-code-example>

6.  Add the `provideStore` function in the `providers` array of your `app.config.ts` with an object containing the `books` and `booksReducer`, as well as the `collection` and `collectionReducer` that manage the state of the book list and the collection. The `provideStore` function registers the global providers needed to access the `Store` throughout your application.

<ngrx-code-example header="src/app/app.config.ts (StoreModule)">

```ts
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ..other providers
    provideStore({
      books: booksReducer,
      collection: collectionReducer,
    }),
  ],
};
```

</ngrx-code-example>

7. Create the book list and collection selectors to ensure we get the correct information from the store. As you can see, the `selectBookCollection` selector combines two other selectors in order to build its return value.

<ngrx-code-example header="src/app/state/books.selectors.ts">

```ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Book } from '../book-list/books.model';

export const selectBooks =
  createFeatureSelector<ReadonlyArray<Book>>('books');

export const selectCollectionState =
  createFeatureSelector<ReadonlyArray<string>>('collection');

export const selectBookCollection = createSelector(
  selectBooks,
  selectCollectionState,
  (books, collection) => {
    return collection.map(
      (id) => books.find((book) => book.id === id)!
    );
  }
);
```

</ngrx-code-example>

8. In the `book-list` folder, we want to have a service that fetches the data needed for the book list from an API. Create a file in the `book-list` folder named `books.service.ts`, which will call the Google Books API and return a list of books.

<ngrx-code-example header="src/app/book-list/books.service.ts">

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from './books.model';

@Injectable({ providedIn: 'root' })
export class GoogleBooksService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Array<Book>> {
    return this.http
      .get<{ items: Book[] }>(
        'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'
      )
      .pipe(map((books) => books.items || []));
  }
}
```

</ngrx-code-example>

9. In the same folder (`book-list`), create the `BookListComponent` with the following template. Update the `BookListComponent` class to dispatch the `add` event.

<ngrx-code-example header="src/app/book-list/book-list.component.html">

```angular-ts
@for(book of books; track book) {
  <div class="book-item">
    <p>{{book.volumeInfo.title}}</p><span> by {{book.volumeInfo.authors}}</span>
    <button
      (click)="add.emit(book.id)"
      data-test="add-button"
    >Add to Collection</button>
  </div>
}
```

</ngrx-code-example>

<ngrx-code-example header="src/app/book-list/book-list.component.ts">

```ts
import { Component, input, output } from '@angular/core';
import { Book } from './books.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent {
  books = input<ReadonlyArray<Book>>([]);
  add = output<string>();
}
```

</ngrx-code-example>

10. Create a new _Component_ named `book-collection` in the `app` folder. Update the `BookCollectionComponent` template and class.

<ngrx-code-example header="src/app/book-collection/book-collection.component.html">

```angular-ts
@for(book of books; track book) {
  <div class="book-item">
    <p>{{book.volumeInfo.title}}</p><span> by {{book.volumeInfo.authors}}</span>
    <button
      (click)="remove.emit(book.id)"
      data-test="remove-button"
    >Remove from Collection</button>
  </div>
}
```

</ngrx-code-example>

<ngrx-code-example header="src/app/book-collection/book-collection.component.ts">

```ts
import { Component, input, output } from '@angular/core';
import { Book } from '../book-list/books.model';

@Component({
  selector: 'app-book-collection',
  templateUrl: './book-collection.component.html',
  styleUrls: ['./book-collection.component.css'],
})
export class BookCollectionComponent {
  books = input<ReadonlyArray<Book>>([]);
  add = output<string>();
}
```

</ngrx-code-example>

11. Add `BookListComponent` and `BookCollectionComponent` to your `AppComponent` template, and to your imports in `app.component.ts` as well.

<ngrx-code-example header="src/app/app.component.html (Components)">

```html
<h2>Books</h2>

<app-book-list
  class="book-list"
  [books]="books()!"
  (add)="onAdd($event)"
>
</app-book-list>

<h2>My Collection</h2>

<app-book-collection
  class="book-collection"
  [books]="bookCollection()!"
  (remove)="onRemove($event)"
>
</app-book-collection>
```

</ngrx-code-example>

```ts
import { Component, input, output } from '@angular/core';
import { Book } from '../book-list/books.model';

@Component({
  selector: 'app-book-collection',
  templateUrl: './book-collection.component.html',
  styleUrls: ['./book-collection.component.css'],
  imports: [BookListComponent, BookCollectionComponent],
})
export class BookCollectionComponent {
  books = input<ReadonlyArray<Book>>([]);
  add = output<string>();
}
```

</ngrx-code-example>

12. In the `AppComponent` class, add the selectors and corresponding actions to dispatch on `add` or `remove` method calls. Then subscribe to the Google Books API in order to update the state. (This should probably be handled by NgRx Effects, which you can read about [here](guide/effects). For the sake of this demo, NgRx Effects is not being included).

<ngrx-code-example header="src/app/app.component.ts">

```ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  selectBookCollection,
  selectBooks,
} from './state/books.selectors';
import { BooksActions, BooksApiActions } from './state/books.actions';
import { GoogleBooksService } from './book-list/books.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  books = this.store.selectSignal(selectBooks);
  bookCollection = this.store.selectSignal(selectBookCollection);

  onAdd(bookId: string) {
    this.store.dispatch(BooksActions.addBook({ bookId }));
  }

  onRemove(bookId: string) {
    this.store.dispatch(BooksActions.removeBook({ bookId }));
  }

  constructor(
    private booksService: GoogleBooksService,
    private store: Store
  ) {}

  ngOnInit() {
    this.booksService
      .getBooks()
      .subscribe((books) =>
        this.store.dispatch(
          BooksApiActions.retrievedBookList({ books })
        )
      );
  }
}
```

</ngrx-code-example>

And that's it! Click the add and remove buttons to change the state.

Let's cover what you did:

- Defined actions to express events.
- Defined two reducer functions to manage different parts of the state.
- Registered the global state container that is available throughout your application.
- Defined the state, as well as selectors that retrieve specific parts of the state.
- Created two distinct components, as well as a service that fetches from the Google Books API.
- Injected the `Store` and Google Books API services to dispatch actions and select the current state.
