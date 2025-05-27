<div class="alert is-important">

The Events plugin is currently marked as experimental.
This means its APIs are subject to change, and modifications may occur in future versions without standard breaking change announcements until it is deemed stable.

</div>

# Events

The Events plugin extends SignalStore with an event-based state management layer.
It takes inspiration from the original Flux architecture and incorporates the best practices and patterns from NgRx Store, NgRx Effects, and RxJS.

<figure>
  <img src="generated/images/guide/signals/app-architecture-with-events-plugin.png" alt="Application Architecture with Events Plugin" width="100%" height="100%" />
</figure>

The application architecture with the Events plugin is composed of the following building blocks:

1. **Event:** Describes an occurrence within the system. Events are dispatched to trigger state changes and/or side effects.
2. **Dispatcher:** An event bus that forwards events to their corresponding handlers in the stores.
3. **Store:** Contains reducers and effects that manage state and handle side effects, maintaining a clean and predictable application flow.
4. **View:** Reflects state changes and dispatches new events, enabling continuous interaction between the user interface and the underlying system.

By dispatching events and reacting to them, the _what_ (the event that occurred) is decoupled from the _how_ (the state changes or side effects that result), leading to predictable data flow and more maintainable code.

## Defining Event Creators

Event creators are defined using utilities provided by the Events plugin.
The `event` function is used for declaring individual event creators, while the `eventGroup` functions enables grouping multiple event creators under a common source.

### Using `event` Function

The simplest way to define an event creator is with the `event` function.
This function takes an event type and an optional payload schema.
Calling the event creator produces an event object with a `type` property and, if a payload is defined, a `payload` property.

<code-example header="book-search-events.ts">

import { type } from '@ngrx/signals';
import { event } from '@ngrx/signals/events';

export const opened = event('[Book Search Page] Opened');  
export const queryChanged = event(
  '[Book Search Page] Query Changed',
  // 👇 The payload type is defined using the `type` function.
  type&lt;string&gt;(),
); 

</code-example>

<code-example header="books-api-events.ts">

import { type } from '@ngrx/signals';
import { event } from '@ngrx/signals/events';
import { Book } from './book';

export const loadedSuccess = event('[Books API] Loaded Success', type&lt;Book[]&gt;());
export const loadedFailure = event('[Books API] Loaded Failure', type&lt;string&gt;());

</code-example>

<div class="alert is-important">

It's recommended to use the "[Source] EventName" pattern when defining the event type.

</div>

Each of these exported constants is an event creator function.
When called, it returns a plain event object.
For example, calling `opened()` returns an object `{ type: '[Book Search Page] Opened' }`, and calling `loadedSuccess([book1, book2])` returns an object `{ type: '[Books API] Loaded Success', payload: [book1, book2] }`.
The `type` property serves as a unique identifier for the event, and the optional `payload` carries additional data.

### Using `eventGroup` Function

Defining many events with the same source can become repetitive.
The `eventGroup` API is used to create a set of events with the common source.
This function takes an object with two properties:

- `source`: Identifies the origin of the event group (e.g., 'Book Search Page', 'Books API').
- `events`: A dictionary of named event creators, where each key defines the event name and each value defines the payload type.

The type of all event creators in the group are prefixed with the provided `source`.

<code-example header="book-search-events.ts">

import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const bookSearchEvents = eventGroup({
  source: 'Book Search Page',
  events: {
    // 👇 Defining an event creator without a payload.
    opened: type&lt;void&gt;(),
    queryChanged: type&lt;string&gt;(),
  },
});

</code-example>

<code-example header="books-api-events.ts">

import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Book } from './book';

export const booksApiEvents = eventGroup({
  source: 'Books API',
  events: {
    loadedSuccess: type&lt;Book[]&gt;(),
    loadedFailure: type&lt;string&gt;(),
  },
});

</code-example>

Event types are automatically formatted as "[Source] EventName".
For example, calling `bookSearchEvents.opened()` yields `{ type: '[Book Search Page] opened' }`, and `booksApiEvents.loadedSuccess([book1, book2])` yields `{ type: '[Books API] loadedSuccess', payload: [book1, book2] }`.

## Performing State Changes

To handle state changes in response to events, the Events plugin provides the `withReducer` feature.
Case reducers are defined using the `on` function, which maps one or more events to a case reducer handler.
A handler is a function that receives the dispatched event as the first and the current state as the second argument.
The return value of a case reducer handler can be a partial state object, a partial state updater, or an array of partial state objects and/or updaters.

<code-example header="book-search-store.ts">

import { signalStore, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { bookSearchEvents } from './book-search-events';
import { booksApiEvents } from './books-api-events';
import { Book } from './book';

type State = { query: string; books: Book[]; isLoading: boolean };

export const BookSearchStore = signalStore(
  withState&lt;State&gt;({ query: '', books: [], isLoading: false }),
  withReducer(
    on(bookSearchEvents.opened, () => ({ isLoading: true })),
    on(
      bookSearchEvents.queryChanged,
      ({ payload: query }) => ({ query, isLoading: true }),
    ),
    on(
      booksApiEvents.loadedSuccess,
      ({ payload: books }) => ({ books, isLoading: false }),
    ),
    on(booksApiEvents.loadedFailure, () => ({ isLoading: false })),
  ),
);

</code-example>

When an event is dispatched, the corresponding case reducer logic runs and the SignalStore state is updated.

<div class="alert is-helpful">

In addition to partial state objects, it's also possible to return a partial state updater or an array of partial state objects and/or updaters as the result of a case reducer handler.

```ts
const incrementBy = event('[Counter Page] Increment By', type<number>());
const increment = event('[Counter Page] Increment');
const incrementBoth = event('[Counter Page] Increment Both');

export const CounterStore = signalStore(
  withState({ count1: 0, count2: 0 }),
  withReducer(
    // 👇 Returning a partial state object.
    on(incrementBy, (event, state) => ({
      count1: state.count1 + event.payload,
    })),
    // 👇 Returning a partial state updater.
    on(increment, () => incrementFirst()),
    // 👇 Returning an array of partial state updaters.
    on(incrementBoth, () => [incrementFirst(), incrementSecond()]),
  ),
);

function incrementFirst(): PartialStateUpdater<{ count1: number }> {
  return (state) => ({ count1: state.count1 + 1 });
}

function incrementSecond(): PartialStateUpdater<{ count2: number }> {
  return (state) => ({ count2: state.count2 + 1 });
}
```

</div>

## Performing Side Effects

Side effects are handled using the `withEffects` feature.
This feature accepts a function that receives the store instance as an argument and returns a dictionary of effects.
Each effect is defined as an observable that reacts to specific events using the `Events` service.
This service provides the `on` method that returns an observable of dispatched events filtered by the specified event types.
If an effect returns a new event, that event is automatically dispatched.

<code-example header="book-search-store.ts">

// ... other imports
import { switchMap, tap } from 'rxjs';
import { Events, withEffects } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { BooksService } from './books-service';

export const BookSearchStore = signalStore(
  // ... other features
  withEffects(
    (
      store,
      events = inject(Events),
      booksService = inject(BooksService),
    ) => ({
      loadBooksByQuery$: events
        .on(bookSearchEvents.opened, bookSearchEvents.queryChanged)
        .pipe(
          switchMap(() =>
            booksService.getByQuery(store.query()).pipe(
              mapResponse({
                next: (books) => booksApiEvents.loadedSuccess(books),
                error: (error: { message: string }) =>
                  booksApiEvents.loadedFailure(error.message),
              }),
            ),
          ),
        ),
      logError$: events
        .on(booksApiEvents.loadedFailure)
        .pipe(tap(({ payload }) => console.error(payload))),
    }),
  ),
);

</code-example>

## Reading State

The Events plugin doesn’t change how the state is exposed or consumed.
It only changes how the state is updated (via reducers rather than direct method calls).
Therefore, components can access state and computed signals by using the store instance.

<code-example header="book-search.ts">

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookSearchStore } from './book-search-store';

@Component({
  selector: 'ngrx-book-search',
  imports: [FormsModule],
  template: `
    &lt;h1&gt;Search Books&lt;/h1&gt;
  
    &lt;input type="text" [ngModel]="store.query()" /&gt;
    
    @if (store.isLoading()) {
      &lt;p&gt;Loading...&lt;/p&gt;
    }

    &lt;ul&gt;
      @for (book of store.books(); track book.id) {
        &lt;li&gt;{{ book.title }}&lt;/li&gt;
      }
    &lt;/ul&gt;
  `,
  providers: [BookSearchStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookSearch {
  readonly store = inject(BookSearchStore);
}

</code-example>

## Dispatching Events

Once events and their corresponding handlers have been defined, the remaining step is to dispatch events in response to user interactions or other triggers.
Dispatching an event allows any matching reducers or effects to process it accordingly.

### Using `Dispatcher` Service

To initiate state changes or side effects, events can be dispatched using the `Dispatcher` service.
It provides the `dispatch` method that takes an event as input.

<code-example header="book-search.ts">

// ... other imports
import { Dispatcher } from '@ngrx/signals/events';
import { bookSearchEvents } from './book-search-events';

@Component({
  // ... component config
  template: `
    &lt;h1>Search Books&lt;/h1&gt;
  
    &lt;input
      type="text"
      [ngModel]="store.query()"
      (ngModelChange)="changeQuery($event)"
    /&gt;

    &lt;!-- ... rest of the template --&gt;
  `,
})
export class BookSearch {
  readonly dispatcher = inject(Dispatcher);
  readonly store = inject(BookSearchStore);

  constructor() {
    this.dispatcher.dispatch(bookSearchEvents.opened());
  }

  changeQuery(query: string): void {
    this.dispatcher.dispatch(bookSearchEvents.queryChanged(query));
  }
}

</code-example>

### Using `injectDispatch` Function

Manually injecting the `Dispatcher` service and invoking the `dispatch` method for each event can lead to repetitive code.
To streamline this process, the Events plugin provides the `injectDispatch` utility.
When invoked with a dictionary of event creators, this function returns an object that reflects the structure of the event definitions.
Each member of the returned object is a method that, when called, automatically creates and dispatches the corresponding event.

<code-example header="book-search.ts">

// ... other imports
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  // ... component config
  template: `
    &lt;h1&gt;Search Books&lt;/h1&gt;
  
    &lt;input
      type="text"
      [ngModel]="store.query()"
      (ngModelChange)="dispatch.queryChanged($event)"
    /&gt;

    &lt;!-- ... rest of the template --&gt;
  `,
})
export class BookSearch {
  readonly dispatch = injectDispatch(bookSearchEvents);
  readonly store = inject(BookSearchStore);

  constructor() {
    this.dispatch.opened();
  }
}

</code-example>
