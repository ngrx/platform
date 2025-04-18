# SignalState

SignalState is a lightweight utility designed for managing signal-based state in a concise and minimalistic manner.
It's suitable for managing modest-sized states and can be used directly in components, services, or standalone functions.

## Creating a SignalState

SignalState is instantiated using the `signalState` function, which accepts an initial state as an input argument.

<ngrx-code-example header="user-state.ts">

```ts
import { signalState } from '@ngrx/signals';
import { User } from './user.model';

type UserState = { user: User; isAdmin: boolean };

const userState = signalState<UserState>({
  user: { firstName: 'Eric', lastName: 'Clapton' },
  isAdmin: false,
});
```

</ngrx-code-example>

The state's type must be a record/object literal. Add arrays or primitive values to properties.

`signalState` returns an extended version of a signal that possesses all the capabilities of a read-only signal.

<ngrx-code-example header="user-state.ts">

```ts
import { computed, effect } from '@angular/core';

// 👇 Creating computed signals.
const userStateStr = computed(() => JSON.stringify(userState()));

// 👇 Performing side effects.
effect(() => console.log('userState', userState()));
```

</ngrx-code-example>

Additionally, the `signalState` function generates signals for each state property.

<ngrx-code-example header="user-state.ts">

```ts
const user = userState.user; // type: DeepSignal<User>
const isAdmin = userState.isAdmin; // type: Signal<boolean>

console.log(user()); // logs: { firstName: 'Eric', lastName: 'Clapton' }
console.log(isAdmin()); // logs: false
```

</ngrx-code-example>

When a state property holds an object as its value, the `signalState` function generates a `DeepSignal`.
It can be used as a regular read-only signal, but it also contains signals for each property of the object it refers to.

<ngrx-code-example header="user-state.ts">

```ts
const firstName = user.firstName; // type: Signal<string>
const lastName = user.lastName; // type: Signal<string>

console.log(firstName()); // logs: 'Eric'
console.log(lastName()); // logs: 'Clapton'
```

</ngrx-code-example>

<ngrx-docs-alert type="help">

For enhanced performance, deeply nested signals are generated lazily and initialized only upon first access.

</ngrx-docs-alert>

## Updating State

The `patchState` function provides a type-safe way to perform updates on pieces of state.
It takes a SignalState or SignalStore instance as the first argument, followed by a sequence of partial states or partial state updaters as additional arguments.

<ngrx-code-example header="user-state.ts">

```ts
import { patchState } from '@ngrx/signals';

// 👇 Providing a partial state object.
patchState(userState, { isAdmin: true });

// 👇 Providing a partial state updater.
patchState(userState, (state) => ({
  user: { ...state.user, firstName: 'Jimi' },
}));

// 👇 Providing a sequence of partial state objects and/or updaters.
patchState(userState, { isAdmin: false }, (state) => ({
  user: { ...state.user, lastName: 'Hendrix' },
}));
```

</ngrx-code-example>

<ngrx-docs-alert type="error">

Updaters passed to the `patchState` function must perform state updates in an immutable manner.

</ngrx-docs-alert>

### Custom State Updaters

Instead of providing partial states or updaters directly to the `patchState` function, it's possible to create custom state updaters.

<ngrx-code-example header="user-state.ts">

```ts
import { PartialStateUpdater } from '@ngrx/signals';

function setFirstName(
  firstName: string
): PartialStateUpdater<{ user: User }> {
  return (state) => ({ user: { ...state.user, firstName } });
}

const setAdmin = () => ({ isAdmin: true });
```

</ngrx-code-example>

Custom state updaters are easy to test and can be reused across different parts of the application.

<ngrx-code-example header="user-state.ts">

```ts
// Before:
patchState(userState, (state) => ({
  user: { ...state.user, firstName: 'Stevie' },
  isAdmin: true,
}));

// After:
patchState(userState, setFirstName('Stevie'), setAdmin());
```

</ngrx-code-example>

## Usage

### Example 1: SignalState in a Component

<ngrx-code-example header="counter.component.ts" linenums="true">

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { signalState, patchState } from '@ngrx/signals';

@Component({
  selector: 'ngrx-counter',
  standalone: true,
  template: `
    <p>Count: {{ state.count() }}</p>

    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
    <button (click)="reset()">Reset</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
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
```

</ngrx-code-example>

### Example 2: SignalState in a Service

<ngrx-code-example header="books.store.ts">

```ts
import { inject, Injectable } from '@angular/core';
import { exhaustMap, pipe, tap } from 'rxjs';
import { signalState, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { BooksService } from './books.service';
import { Book } from './book.model';

type BooksState = { books: Book[]; isLoading: boolean };

const initialState: BooksState = {
  books: [],
  isLoading: false,
};

@Injectable()
export class BooksStore {
  readonly #booksService = inject(BooksService);
  readonly #state = signalState(initialState);

  readonly books = this.#state.books;
  readonly isLoading = this.#state.isLoading;

  readonly loadBooks = rxMethod<void>(
    pipe(
      tap(() => patchState(this.#state, { isLoading: true })),
      exhaustMap(() => {
        return this.#booksService.getAll().pipe(
          tapResponse({
            next: (books) => patchState(this.#state, { books }),
            error: console.error,
            finalize: () =>
              patchState(this.#state, { isLoading: false }),
          })
        );
      })
    )
  );
}
```

</ngrx-code-example>

<ngrx-code-example header="books.component.ts">

```ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BooksStore } from './books.store';

@Component({
  selector: 'ngrx-books',
  standalone: true,
  template: `
    <h1>Books</h1>

    @if (store.isLoading()) {
    <p>Loading...</p>
    } @else {
    <ul>
      @for (book of store.books(); track book.id) {
      <li>{{ book.title }}</li>
      }
    </ul>
    }
  `,
  providers: [BooksStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit {
  readonly store = inject(BooksStore);

  ngOnInit(): void {
    this.store.loadBooks();
  }
}
```

</ngrx-code-example>
