# SignalStore

NgRx SignalStore is a fully-featured state management solution that offers a robust way to manage application state.
With its native support for Signals, it provides the ability to define stores in a clear and declarative manner.
The simplicity and flexibility of SignalStore, coupled with its opinionated and extensible design, establish it as a versatile solution for effective state management in Angular.

## Creating a Store

A SignalStore is created using the `signalStore` function. This function accepts a sequence of store features.
Through the combination of store features, the SignalStore gains state, properties, and methods, allowing for a flexible and extensible store implementation.
Based on the utilized features, the `signalStore` function returns an injectable service that can be provided and injected where needed.

The `withState` feature is used to add state slices to the SignalStore.
This feature accepts initial state as an input argument. As with `signalState`, the state's type must be a record/object literal.

<code-example header="book-search-store.ts">

import { signalStore, withState } from '@ngrx/signals';
import { Book } from './book';

type BookSearchState = {
  books: Book[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: BookSearchState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const BookSearchStore = signalStore(
  withState(initialState)
);

</code-example>

For each state slice, a corresponding signal is automatically created.
The same applies to nested state properties, with all deeply nested signals being generated lazily on demand.

The `BookSearchStore` instance will contain the following properties:

- `books: Signal<Book[]>`
- `isLoading: Signal<boolean>`
- `filter: DeepSignal<{ query: string; order: 'asc' | 'desc' }>`
- `filter.query: Signal<string>`
- `filter.order: Signal<'asc' | 'desc'>`

<div class="alert is-helpful">

The `withState` feature also has a signature that takes the initial state factory as an input argument.
The factory is executed within the injection context, allowing initial state to be obtained from a service or injection token.

```ts
const BOOK_SEARCH_STATE = new InjectionToken<BookSearchState>(
  'BookSearchState',
  { factory: () => initialState }
);

const BookSearchStore = signalStore(
  withState(() => inject(BOOK_SEARCH_STATE))
);
```

</div>

## Providing and Injecting the Store

SignalStore can be provided locally and globally.
By default, a SignalStore is not registered with any injectors and must be included in a providers array at the component, route, or root level before injection.

<code-example header="book-search.ts">

import { Component, inject } from '@angular/core';
import { BookSearchStore } from './book-search-store';

@Component({
  /* ... */
  // 👇 Providing `BookSearchStore` at the component level.
  providers: [BookSearchStore],
})
export class BookSearch {
  readonly store = inject(BookSearchStore);
}

</code-example>

When provided at the component level, the store is tied to the component lifecycle, making it useful for managing local/component state.
Alternatively, a SignalStore can be globally registered by setting the `providedIn` property to `root` when defining the store.

<code-example header="book-search-store.ts">

import { signalStore, withState } from '@ngrx/signals';
import { Book } from './book';

type BookSearchState = { /* ... */ };

const initialState: BookSearchState = { /* ... */ };

export const BookSearchStore = signalStore(
  // 👇 Providing `BookSearchStore` at the root level.
  { providedIn: 'root' },
  withState(initialState)
);

</code-example>

When provided globally, the store is registered with the root injector and becomes accessible anywhere in the application.
This is beneficial for managing global state, as it ensures a single shared instance of the store across the entire application.

## Reading State

Signals generated for state slices can be utilized to access state values, as demonstrated below.

<code-example header="book-search.ts">

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { BookSearchStore } from './book-search-store';

@Component({
  imports: [JsonPipe],
  template: `
    &lt;p&gt;Books: {{ store.books() | json }}&lt;/p&gt;
    &lt;p&gt;Loading: {{ store.isLoading() }}&lt;/p&gt;

    &lt;!-- 👇 The `DeepSignal` value can be read in the same way as `Signal`. --&gt;
    &lt;p&gt;Pagination: {{ store.filter() | json }}&lt;/p&gt;

    &lt;!-- 👇 Nested signals are created as `DeepSignal` properties. --&gt;
    &lt;p&gt;Query: {{ store.filter.query() }}&lt;/p&gt;
    &lt;p&gt;Order: {{ store.filter.order() }}&lt;/p&gt;
  `,
  providers: [BookSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookSearch {
  readonly store = inject(BookSearchStore);
}

</code-example>

## Defining Store Properties

Computed signals can be added to the store using the `withComputed` feature.
This feature accepts a factory function as an input argument, which is executed within the injection context.
The factory should return a dictionary containing either computed signals or functions that return values (which are automatically wrapped in computed signals), utilizing previously defined state signals, properties, and methods that are accessible through its input argument.

<code-example header="book-search-store.ts">

import { computed } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { Book } from './book';

type BookSearchState = { /* ... */ };

const initialState: BookSearchState = { /* ... */ };

export const BookSearchStore = signalStore(
  withState(initialState),
  // 👇 Accessing previously defined state signals and properties.
  withComputed(({ books, filter }) => ({
    booksCount: computed(() => books().length),
    // 👇 Adds computed automatically
    sortedBooks: () => {
      const direction = filter.order() === 'asc' ? 1 : -1;

      return books().toSorted((a, b) =>
        direction * a.title.localeCompare(b.title)
      );
    },
  }))
);

</code-example>

<div class="alert is-helpful">

The `withProps` feature can be used to add static properties, observables, dependencies, and any other custom properties to a SignalStore.
For more details, see the [Custom Store Properties](/guide/signals/signal-store/custom-store-properties) guide.

</div>

## Defining Store Methods

Methods can be added to the store using the `withMethods` feature.
This feature takes a factory function as an input argument and returns a dictionary of methods.
Similar to `withComputed`, the `withMethods` factory is also executed within the injection context.
The store instance, including previously defined state signals, properties, and methods, is accessible through the factory input.

<code-example header="book-search-store.ts">

import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Book } from './book';

type BookSearchState = { /* ... */ };

const initialState: BookSearchState = { /* ... */ };

export const BookSearchStore = signalStore(
  withState(initialState),
  withComputed(/* ... */),
  // 👇 Accessing a store instance with previously defined state signals,
  // properties, and methods.
  withMethods((store) => ({
    updateQuery(query: string): void {
      // 👇 Updating state using the `patchState` function.
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
  }))
);

</code-example>

<div class="alert is-helpful">

The state of the SignalStore is updated using the `patchState` function.
For more details on the `patchState` function, refer to the [Updating State](/guide/signals/signal-state#updating-state) guide.

</div>

<div class="alert is-important">

By default, SignalStore's state is protected from external modifications, ensuring a consistent and predictable data flow.
This is the recommended approach.
However, external updates to the state can be enabled by setting the `protectedState` option to `false` when creating a SignalStore.

```ts
export const BookSearchStore = signalStore(
  { protectedState: false }, // 👈
  withState(initialState)
);

@Component({ /* ... */ })
export class BookSearch {
  readonly store = inject(BookSearchStore);

  addBook(book: Book): void {
    // ⚠️ The state of the `BookSearchStore` is unprotected from external modifications.
    patchState(this.store, ({ books }) => ({ books: [...books, book] }));
  }
}
```

</div>

In addition to methods for updating state, the `withMethods` feature can also be used to create methods for performing side effects.
Asynchronous side effects can be executed using Promise-based APIs, as demonstrated below.

<code-example header="book-search-store.ts">

import { computed, inject } from '@angular/core';
import { patchState, signalStore, /* ... */ } from '@ngrx/signals';
import { BooksService } from './books-service';
import { Book } from './book';

type BookSearchState = { /* ... */ };

const initialState: BookSearchState = { /* ... */ };

export const BookSearchStore = signalStore(
  withState(initialState),
  withComputed(/* ... */),
  // 👇 `BooksService` can be injected within the `withMethods` factory.
  withMethods((store, booksService = inject(BooksService)) => ({
    /* ... */
    // 👇 Defining a method to load all books.
    async loadAll(): Promise&lt;void&gt; {
      patchState(store, { isLoading: true });

      const books = await booksService.getAll();
      patchState(store, { books, isLoading: false });
    },
  }))
);

</code-example>

### Reactive Store Methods

In more complex scenarios, opting for RxJS to handle asynchronous side effects is advisable.
To create a reactive SignalStore method that harnesses RxJS APIs, use the `rxMethod` function from the `rxjs-interop` plugin.

<code-example header="book-search-store.ts">

import { computed, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { patchState, signalStore, /* ... */ } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { BooksService } from './books-service';
import { Book } from './book';

type BookSearchState = { /* ... */ };

const initialState: BookSearchState = { /* ... */ };

export const BookSearchStore = signalStore(
  withState(initialState),
  withComputed(/* ... */),
  withMethods((store, booksService = inject(BooksService)) => ({
    /* ... */
    // 👇 Defining a method to load books by query.
    loadByQuery: rxMethod&lt;string&gt;(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) => {
          return booksService.getByQuery(query).pipe(
            tapResponse({
              next: (books) => patchState(store, { books, isLoading: false }),
              error: (err) => {
                patchState(store, { isLoading: false });
                console.error(err);
              },
            })
          );
        })
      )
    ),
  }))
);

</code-example>

<div class="alert is-helpful">

To learn more about the `rxMethod` function, visit the [RxJS Integration](/guide/signals/rxjs-integration) page.

</div>

## Putting It All Together

The final `BookSearchStore` implementation with state, computed signals, and methods from this guide is shown below.

<code-example header="book-search-store.ts">

import { computed, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { BooksService } from './books-service';
import { Book } from './book';

type BookSearchState = {
  books: Book[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: BookSearchState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const BookSearchStore = signalStore(
  withState(initialState),
  withComputed(({ books, filter }) => ({
    booksCount: computed(() => books().length),
    sortedBooks: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;

      return books().toSorted((a, b) =>
        direction * a.title.localeCompare(b.title)
      );
    }), 
  })),
  withMethods((store, booksService = inject(BooksService)) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    loadByQuery: rxMethod&lt;string&gt;(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) => {
          return booksService.getByQuery(query).pipe(
            tapResponse({
              next: (books) => patchState(store, { books }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
  }))
);

</code-example>

The `BookSearchStore` instance will contain the following properties and methods:

- State signals:
  - `books: Signal<Book[]>`
  - `isLoading: Signal<boolean>`
  - `filter: DeepSignal<{ query: string; order: 'asc' | 'desc' }>`
  - `filter.query: Signal<string>`
  - `filter.order: Signal<'asc' | 'desc'>`
- Computed signals:
  - `booksCount: Signal<number>`
  - `sortedBooks: Signal<Book[]>`
- Methods:
  - `updateQuery(query: string): void`
  - `updateOrder(order: 'asc' | 'desc'): void`
  - `loadByQuery: RxMethod<string>`

<div class="alert is-helpful">

The `BookSearchStore` implementation can be enhanced further by utilizing the `entities` plugin and creating custom SignalStore features.
For more details, refer to the [Entity Management](guide/signals/signal-store/entity-management) and [Custom Store Features](guide/signals/signal-store/custom-store-features) guides.

</div>

The `BookSearch` component can use the `BookSearchStore` to manage the state, as demonstrated below.

<code-example header="book-search.ts">

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BookFilter } from './book-filter';
import { BookList } from './book-list';
import { BooksStore } from './books.store';

@Component({
  imports: [BookFilter, BookList],
  template: `
    &lt;h1&gt;Books ({{ store.booksCount() }})&lt;/h1&gt;

    &lt;ngrx-book-filter
      [query]="store.filter.query()"
      [order]="store.filter.order()"
      (queryChange)="store.updateQuery($event)"
      (orderChange)="store.updateOrder($event)"
    /&gt;

    &lt;ngrx-book-list
      [books]="store.sortedBooks()"
      [isLoading]="store.isLoading()"
    /&gt;
  `,
  providers: [BookSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookSearch {
  readonly store = inject(BookSearchStore);

  constructor() {
    const query = this.store.filter.query;
    // 👇 Re-fetch books whenever the value of query signal changes.
    this.store.loadByQuery(query);
  }
}

</code-example>

<div class="alert is-helpful">

In addition to component lifecycle hooks, SignalStore also offers the ability to define them at the store level.
Learn more about SignalStore lifecycle hooks [here](/guide/signals/signal-store/lifecycle-hooks).

</div>
