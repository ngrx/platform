# Feature Creators

## What is an NgRx feature?

There are three main building blocks of global state management with `@ngrx/store`: actions, reducers, and selectors.
For a particular feature state, we create a reducer for handling state transitions based on the dispatched actions
and selectors to obtain slices of the feature state. Also, we need to define a feature name needed to register
the feature reducer in the NgRx store. Therefore, we can consider the NgRx feature as a grouping of the feature name,
feature reducer, and selectors for the particular feature state.

## Using feature creator

The `createFeature` function reduces repetitive code in selector files by generating a feature selector and child selectors
for each feature state property. It accepts an object containing a feature name and a feature reducer as the input argument:

<code-example header="books.reducer.ts">
import { createFeature, createReducer } from '@ngrx/store';
import { Book } from './book.model';

import * as BookListPageActions from './book-list-page.actions';
import * as BooksApiActions from './books-api.actions';

interface State {
  books: Book[];
  loading: boolean;
}

const initialState: State = {
  books: [],
  loading: false,
};

export const booksFeature = createFeature({
  name: 'books',
  reducer: createReducer(
    initialState,
    on(BookListPageActions.enter, (state) => ({
      ...state,
      loading: true,
    })),
    on(BooksApiActions.loadBooksSuccess, (state, { books }) => ({
      ...state,
      books,
      loading: false,
    }))
  ),
});

export const {
  name, // feature name
  reducer, // feature reducer
  selectBooksState, // feature selector
  selectBooks, // selector for `books` property
  selectLoading, // selector for `loading` property
} = booksFeature;
</code-example>

An object created with the `createFeature` function contains a feature name, a feature reducer, a feature selector,
and a selector for each feature state property. All generated selectors have the "select" prefix, and the feature selector has
the "State" suffix. In this example, the name of the feature selector is `selectBooksState`, where "books" is the feature name.
The names of the child selectors are `selectBooks` and `selectLoading`, based on the property names of the books feature state.

The generated selectors can be used independently or to create other selectors:

<code-example header="books.selectors.ts">
import { createSelector } from '@ngrx/store';
import { booksFeature } from './books.reducer';

export const selectBookListPageViewModel = createSelector(
  booksFeature.selectBooks,
  booksFeature.selectLoading,
  (books, loading) => ({ books, loading })
);
</code-example>

## Feature registration

Registering the feature reducer in the store can be done by passing the entire feature object to the `StoreModule.forFeature` method:

<code-example header="books.module.ts">
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { booksFeature } from './books.reducer';

@NgModule({
  imports: [StoreModule.forFeature(booksFeature)],
})
export class BooksModule {}
</code-example>

## Restrictions

The `createFeature` function cannot be used for features whose state contains optional properties.
In other words, all state properties have to be passed to the initial state object.

So, if the state contains optional properties:

<code-example header="books.reducer.ts">
interface State {
  books: Book[];
  activeBookId?: string;
}

const initialState: State = {
  books: [],
};
</code-example>

Each optional symbol (`?`) have to be replaced with `| null` or `| undefined`:

<code-example header="books.reducer.ts">
interface State {
  books: Book[];
  activeBookId: string | null;
  // or activeBookId: string | undefined;
}

const initialState: State = {
  books: [],
  activeBookId: null,
  // or activeBookId: undefined,
};
</code-example>
