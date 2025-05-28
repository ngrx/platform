# SignalState

SignalState is a lightweight utility designed for managing signal-based state in a concise and minimalistic manner.
It's suitable for managing modest-sized states and can be used directly in components, services, or standalone functions.

## Creating a SignalState

SignalState is instantiated using the `signalState` function, which accepts an initial state as an input argument.

```ts
import { signalState } from '@ngrx/signals';
import { User } from './user';

type UserState = { user: User; isAdmin: boolean };

const userState = signalState<UserState>({
  user: { firstName: 'Eric', lastName: 'Clapton' },
  isAdmin: false,
});
```

The state's type must be a record/object literal. Add arrays or primitive values to properties.

`signalState` returns an extended version of a signal that possesses all the capabilities of a read-only signal.

```ts
import { computed, effect } from '@angular/core';

// 👇 Creating computed signals.
const userStateStr = computed(() => JSON.stringify(userState()));

// 👇 Performing side effects.
effect(() => console.log('userState', userState()));
```

Additionally, the `signalState` function generates signals for each state property.

```ts
const user = userState.user; // type: DeepSignal<User>
const isAdmin = userState.isAdmin; // type: Signal<boolean>

console.log(user()); // logs: { firstName: 'Eric', lastName: 'Clapton' }
console.log(isAdmin()); // logs: false
```

When a state property holds an object as its value, the `signalState` function generates a `DeepSignal`.
It can be used as a regular read-only signal, but it also contains signals for each property of the object it refers to.

```ts
const firstName = user.firstName; // type: Signal<string>
const lastName = user.lastName; // type: Signal<string>

console.log(firstName()); // logs: 'Eric'
console.log(lastName()); // logs: 'Clapton'
```

<div class="alert is-helpful">

For enhanced performance, deeply nested signals are generated lazily and initialized only upon first access.

</div>

## Updating State

The `patchState` function provides a type-safe way to perform updates on pieces of state.
It takes a SignalState or SignalStore instance as the first argument, followed by a sequence of partial states or partial state updaters as additional arguments.

```ts
import { patchState } from '@ngrx/signals';

// 👇 Providing a partial state object.
patchState(userState, { isAdmin: true });

// 👇 Providing a partial state updater.
patchState(userState, (state) => ({
  user: { ...state.user, firstName: 'Jimi' },
}));

// 👇 Providing a sequence of partial state objects and/or updaters.
patchState(
  userState,
  { isAdmin: false },
  (state) => ({ user: { ...state.user, lastName: 'Hendrix' } })
);
```

<div class="alert is-critical">

Updaters passed to the `patchState` function must perform state updates in an immutable manner.

</div>

### Custom State Updaters

Instead of providing partial states or updaters directly to the `patchState` function, it's possible to create custom state updaters.

```ts
import { PartialStateUpdater } from '@ngrx/signals';

function setFirstName(firstName: string): PartialStateUpdater<{ user: User }> {
  return (state) => ({ user: { ...state.user, firstName } });
}

const setAdmin = () => ({ isAdmin: true });
```

Custom state updaters are easy to test and can be reused across different parts of the application.

```ts
// Before:
patchState(userState, (state) => ({
  user: { ...state.user, firstName: 'Stevie' },
  isAdmin: true,
}));

// After:
patchState(userState, setFirstName('Stevie'), setAdmin());
```

## Usage

### Example 1: SignalState in a Component

<code-example header="counter.ts" linenums="true">

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { signalState, patchState } from '@ngrx/signals';

@Component({
  selector: 'ngrx-counter',
  template: `
    &lt;p&gt;Count: {{ state.count() }}&lt;/p&gt;

    &lt;button (click)="increment()"&gt;Increment&lt;/button&gt;
    &lt;button (click)="decrement()"&gt;Decrement&lt;/button&gt;
    &lt;button (click)="reset()"&gt;Reset&lt;/button&gt;
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  readonly state = signalState({ count: 0 });

  increment(): void {
    patchState(this.state, (state) => ({ count: state.count + 1 }));
  }

  decrement(): void {
    patchState(this.state, (state) => ({ count: state.count - 1 }));
  }

  reset(): void {
    patchState(this.state, { count: 0 });
  }
}

</code-example>


### Example 2: SignalState in a Service

<code-tabs linenums="true">
<code-pane header="book-list-store.ts">

import { inject, Injectable } from '@angular/core';
import { exhaustMap, pipe, tap } from 'rxjs';
import { signalState, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { BooksService } from './books-service';
import { Book } from './book';

type BookListState = { books: Book[]; isLoading: boolean };

const initialState: BookListState = {
  books: [],
  isLoading: false,
};

@Injectable()
export class BookListStore {
  readonly #booksService = inject(BooksService);
  readonly #state = signalState(initialState);

  readonly books = this.#state.books;
  readonly isLoading = this.#state.isLoading;

  readonly loadBooks = rxMethod&lt;void&gt;(
    pipe(
      tap(() => patchState(this.#state, { isLoading: true })),
      exhaustMap(() => {
        return this.#booksService.getAll().pipe(
          tapResponse({
            next: (books) => patchState(this.#state, { books }),
            error: console.error,
            finalize: () => patchState(this.#state, { isLoading: false }),
          })
        );
      })
    )
  );
}

</code-pane>

<code-pane header="book-list.ts">

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BookListStore } from './book-list-store';

@Component({
  selector: 'ngrx-book-list',
  template: `
    &lth1&gt;Books&lt;/h1&gt;
  
    @if (store.isLoading()) {
      &lt;p&gt;Loading...&lt;/p&gt;
    } @else {
      &lt;ul&gt;
        @for (book of store.books(); track book.id) {
          &lt;li&gt;{{ book.title }}&lt;/li&gt;
        }
      &lt;/ul&gt;
    }
  `,
  providers: [BookListStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  readonly store = inject(BookListStore);

  constructor() {
    this.store.loadBooks();
  }
}

</code-pane>
</code-tabs>
