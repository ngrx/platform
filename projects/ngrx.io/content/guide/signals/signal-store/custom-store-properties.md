# Custom Store Properties

The `withProps` feature can be used to add static properties, observables, dependencies, or other custom properties to a SignalStore.
It accepts a factory function that returns an object containing additional properties for the store.
The factory function receives an object containing state signals, previously defined properties, and methods as its input argument.

## Exposing Observables

`withProps` can be useful for exposing observables from a SignalStore, which can serve as integration points with RxJS-based APIs:

<code-example header="books.store.ts">

import { toObservable } from '@angular/core/rxjs-interop';
import { signalStore, withProps, withState } from '@ngrx/signals';
import { Book } from './book.model';

type BooksState = {
  books: Book[];
  isLoading: boolean;
};

export const BooksStore = signalStore(
  withState&lt;BooksState&gt;({ books: [], isLoading: false }),
  withProps(({ isLoading }) => ({
    isLoading$: toObservable(isLoading),
  })),
);

</code-example>

## Grouping Dependencies

Dependencies required across multiple store features can be grouped using `withProps`:

<code-example header="books.store.ts">

import { inject } from '@angular/core';
import { signalStore, withProps, withState } from '@ngrx/signals';
import { Logger } from './logger';
import { Book } from './book.model';
import { BooksService } from './books.service';

type BooksState = {
  books: Book[];
  isLoading: boolean;
};

export const BooksStore = signalStore(
  withState&lt;BooksState&gt;({ books: [], isLoading: false }),
  withProps(() => ({
    booksService: inject(BooksService),
    logger: inject(Logger),
  })),
  withMethods(({ booksService, logger, ...store }) => ({
    async loadBooks(): Promise&lt;void&gt; {
      logger.debug('Loading books...');
      patchState(store, { isLoading: true });
      
      const books = await booksService.getAll();
      logger.debug('Books loaded successfully', books);
      
      patchState(store, { books, isLoading: false });
    },
  })),
  withHooks({
    onInit({ logger }) {
      logger.debug('BooksStore initialized');
    },
  }),
);

</code-example>
