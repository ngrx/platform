# Selectors

Selectors are pure functions used for obtaining slices of store state. @ngrx/store provides a few helper functions for optimizing this selection. Selectors provide many features when selecting slices of state:

- Portability
- Memoization
- Composition
- Testability
- Type Safety

When using the `createSelector` and `createFeatureSelector` functions @ngrx/store keeps track of the latest arguments in which your selector function was invoked. Because selectors are [pure functions](https://en.wikipedia.org/wiki/Pure_function), the last result can be returned when the arguments match without reinvoking your selector function. This can provide performance benefits, particularly with selectors that perform expensive computation. This practice is known as [memoization](https://en.wikipedia.org/wiki/Memoization).

### Using a selector for one piece of state

<ngrx-code-example header="index.ts">

```ts
import { createSelector } from '@ngrx/store';

export interface FeatureState {
  counter: number;
}

export interface AppState {
  feature: FeatureState;
}

export const selectFeature = (state: AppState) => state.feature;

export const selectFeatureCount = createSelector(
  selectFeature,
  (state: FeatureState) => state.counter
);
```

</ngrx-code-example>

### Using selectors for multiple pieces of state

The `createSelector` can be used to select some data from the state based on several slices of the same state.

The `createSelector` function can take up to 8 selector functions for more complete state selections.

For example, imagine you have a `selectedUser` object in the state. You also have an `allBooks` array of book objects.

And you want to show all books for the current user.

You can use `createSelector` to achieve just that. Your visible books will always be up to date even if you update them in `allBooks`. They will always show the books that belong to your user if there is one selected and will show all the books when there is no user selected.

The result will be just some of your state filtered by another section of the state. And it will be always up to date.

<ngrx-code-example header="index.ts">

```ts
import { createSelector } from '@ngrx/store';

export interface User {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  userId: number;
  name: string;
}

export interface AppState {
  selectedUser: User;
  allBooks: Book[];
}

export const selectUser = (state: AppState) => state.selectedUser;
export const selectAllBooks = (state: AppState) => state.allBooks;

export const selectVisibleBooks = createSelector(
  selectUser,
  selectAllBooks,
  (selectedUser: User, allBooks: Book[]) => {
    if (selectedUser && allBooks) {
      return allBooks.filter(
        (book: Book) => book.userId === selectedUser.id
      );
    } else {
      return allBooks;
    }
  }
);
```

</ngrx-code-example>

The `createSelector` function also provides the ability to pass a dictionary of selectors without a projector.
In this case, `createSelector` will generate a projector function that maps the results of the input selectors to a dictionary.

```ts
// result type - { books: Book[]; query: string }
const selectBooksPageViewModel = createSelector({
  books: selectBooks, // result type - Book[]
  query: selectQuery, // result type - string
});
```

### Using selectors with props

<ngrx-docs-alert type="error">

Selectors with props are [deprecated](https://github.com/ngrx/platform/issues/2980).

</ngrx-docs-alert>

To select a piece of state based on data that isn't available in the store you can pass `props` to the selector function. These `props` gets passed through every selector and the projector function.
To do so we must specify these `props` when we use the selector inside our component.

For example if we have a counter and we want to multiply its value, we can add the multiply factor as a `prop`:

The last argument of a selector or a projector is the `props` argument, for our example it looks as follows:

<ngrx-code-example header="index.ts">

```ts
export const selectCount = createSelector(
  selectCounterValue,
  (counter, props) => counter * props.multiply
);
```

</ngrx-code-example>

Inside the component we can define the `props`:

<ngrx-code-example header="app.component.ts">

```sh
ngOnInit() {
  this.counter = this.store.select(fromRoot.selectCount, { multiply: 2 })
}
```

</ngrx-code-example>

Keep in mind that a selector only keeps the previous input arguments in its cache. If you reuse this selector with another multiply factor, the selector would always have to re-evaluate its value. This is because it's receiving both of the multiply factors (e.g. one time `2`, the other time `4`). In order to correctly memoize the selector, wrap the selector inside a factory function to create different instances of the selector.

The following is an example of using multiple counters differentiated by `id`.

<ngrx-code-example header="index.ts">

```ts
export const selectCount = () =>
  createSelector(
    (state, props) => state.counter[props.id],
    (counter, props) => counter * props.multiply
  );
```

</ngrx-code-example>

The component's selectors are now calling the factory function to create different selector instances:

<ngrx-code-example header="app.component.ts">

```sh
ngOnInit() {
  this.counter2 = this.store.select(fromRoot.selectCount(), { id: 'counter2', multiply: 2 });
  this.counter4 = this.store.select(fromRoot.selectCount(), { id: 'counter4', multiply: 4 });
  this.counter6 = this.store.select(fromRoot.selectCount(), { id: 'counter6', multiply: 6 });
}
```

</ngrx-code-example>

## Selecting Feature States

The `createFeatureSelector` is a convenience method for returning a top level feature state. It returns a typed selector function for a feature slice of state.

<ngrx-code-example header="index.ts">

```ts
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const featureKey = 'feature';

export interface FeatureState {
  counter: number;
}

export const selectFeature =
  createFeatureSelector<FeatureState>(featureKey);

export const selectFeatureCount = createSelector(
  selectFeature,
  (state: FeatureState) => state.counter
);
```

</ngrx-code-example>

<ngrx-docs-alert type="inform">

Using a [Feature Creator](guide/store/feature-creators) generates the top-level selector and child selectors for each feature state property.

</ngrx-docs-alert>

## Resetting Memoized Selectors

The selector function returned by calling `createSelector` or `createFeatureSelector` initially has a memoized value of `null`. After a selector is invoked the first time its memoized value is stored in memory. If the selector is subsequently invoked with the same arguments it will return the memoized value. If the selector is then invoked with different arguments it will recompute and update its memoized value. Consider the following:

<ngrx-code-example header="example.ts">

```ts
import { createSelector } from '@ngrx/store';

export interface State {
  counter1: number;
  counter2: number;
}

export const selectCounter1 = (state: State) => state.counter1;
export const selectCounter2 = (state: State) => state.counter2;
export const selectTotal = createSelector(
  selectCounter1,
  selectCounter2,
  (counter1, counter2) => counter1 + counter2
); // selectTotal has a memoized value of null, because it has not yet been invoked.

let state = { counter1: 3, counter2: 4 };

selectTotal(state); // computes the sum of 3 & 4, returning 7. selectTotal now has a memoized value of 7
selectTotal(state); // does not compute the sum of 3 & 4. selectTotal instead returns the memoized value of 7

state = { ...state, counter2: 5 };

selectTotal(state); // computes the sum of 3 & 5, returning 8. selectTotal now has a memoized value of 8
```

</ngrx-code-example>

A selector's memoized value stays in memory indefinitely. If the memoized value is, for example, a large dataset that is no longer needed it's possible to reset the memoized value to null so that the large dataset can be removed from memory. This can be accomplished by invoking the `release` method on the selector.

<ngrx-code-example header="example.ts">

```ts
selectTotal(state); // returns the memoized value of 8
selectTotal.release(); // memoized value of selectTotal is now null
```

</ngrx-code-example>

Releasing a selector also recursively releases any ancestor selectors. Consider the following:

<ngrx-code-example header="index.ts">

```ts
export interface State {
  evenNums: number[];
  oddNums: number[];
}

export const selectSumEvenNums = createSelector(
  (state: State) => state.evenNums,
  (evenNums) => evenNums.reduce((prev, curr) => prev + curr)
);
export const selectSumOddNums = createSelector(
  (state: State) => state.oddNums,
  (oddNums) => oddNums.reduce((prev, curr) => prev + curr)
);
export const selectTotal = createSelector(
  selectSumEvenNums,
  selectSumOddNums,
  (evenSum, oddSum) => evenSum + oddSum
);

selectTotal({
  evenNums: [2, 4],
  oddNums: [1, 3],
});

/**
 * Memoized Values before calling selectTotal.release()
 *   selectSumEvenNums  6
 *   selectSumOddNums   4
 *   selectTotal        10
 */

selectTotal.release();

/**
 * Memoized Values after calling selectTotal.release()
 *   selectSumEvenNums  null
 *   selectSumOddNums   null
 *   selectTotal        null
 */
```

</ngrx-code-example>

## Using Store Without Type Generic

The most common way to select information from the store is to use a selector function defined with `createSelector`. TypeScript is able to automatically infer types from `createSelector`, which reduces the need to provide the shape of the state to `Store` via a generic argument.

So, when injecting `Store` into components and other injectables, the generic type can be omitted. If injected without the generic, the default generic applied is `Store<T = object>`.

<ngrx-docs-alert type="inform">
It is important to continue to provide a Store type generic if you are using the string version of selectors as types cannot be inferred automatically in those instances.
</ngrx-docs-alert>

The follow example demonstrates the use of `Store` without providing a generic:

<ngrx-code-example header="app.component.ts">

```ts
export class AppComponent {
  counter$ = this.store.select(fromCounter.selectCounter);

  constructor(private readonly store: Store) {}
}
```

</ngrx-code-example>

When using strict mode, the `select` method will expect to be passed a selector whose base selects from an `object`.

This is the default behavior of `createFeatureSelector` when providing only one generic argument:

<ngrx-code-example header="index.ts">

```ts
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const featureKey = 'feature';

export interface FeatureState {
  counter: number;
}

// selectFeature will have the type MemoizedSelector<object, FeatureState>
export const selectFeature =
  createFeatureSelector<FeatureState>(featureKey);

// selectFeatureCount will have the type MemoizedSelector<object, number>
export const selectFeatureCount = createSelector(
  selectFeature,
  (state) => state.counter
);
```

</ngrx-code-example>

## Using Signal Selector

The `selectSignal` method expects a selector as an input argument and returns a signal of the selected state slice. It has a similar signature to the `select` method, but unlike `select`, `selectSignal` returns a signal instead of an observable.

### Example Usage in Components

```typescript
import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { Store } from '@ngrx/store';

import { selectUsers } from './users.selectors';

@Component({
  standalone: true,
  imports: [NgFor],
  template: `
    <h1>Users</h1>
    <ul>
      <li *ngFor="let user of users()">
        {{ user.name }}
      </li>
    </ul>
  `,
})
export class UsersComponent {
  private readonly store = inject(Store);

  // type: Signal<User[]>
  readonly users = this.store.selectSignal(selectUsers);
}
```

### Selecting with Equality Function

Similar to the `computed` function, the `selectSignal` method also accepts the equality function to stop the recomputation of the deeper dependency chain if two values are determined to be equal.

## Advanced Usage

Selectors empower you to compose a [read model for your application state](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs#solution).
In terms of the CQRS architectural pattern, NgRx separates the read model (selectors) from the write model (reducers).
An advanced technique is to combine selectors with [RxJS pipeable operators](https://rxjs.dev/guide/v6/pipeable-operators).

This section covers some basics of how selectors compare to pipeable operators and demonstrates how `createSelector` and `scan` are utilized to display a history of state transitions.

### Breaking Down the Basics

#### Select a non-empty state using pipeable operators

Let's pretend we have a selector called `selectValues` and the component for displaying the data is only interested in defined values, i.e., it should not display empty states.

We can achieve this behaviour by using only RxJS pipeable operators:

<ngrx-code-example header="app.component.ts">

```ts
import { map, filter } from 'rxjs/operators';

store
  .pipe(
    map((state) => selectValues(state)),
    filter((val) => val !== undefined)
  )
  .subscribe(/* .. */);
```

</ngrx-code-example>

The above can be further rewritten to use the `select()` utility function from NgRx:

<ngrx-code-example header="app.component.ts">

```ts
import { select } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';

store
  .pipe(
    select(selectValues),
    filter((val) => val !== undefined)
  )
  .subscribe(/* .. */);
```

</ngrx-code-example>

#### Solution: Extracting a pipeable operator

To make the `select()` and `filter()` behaviour a reusable piece of code, we extract a [pipeable operator](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) using the RxJS `pipe()` utility function:

<ngrx-code-example header="app.component.ts">

```ts
import { select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

export const selectFilteredValues = pipe(
  select(selectValues),
  filter((val) => val !== undefined)
);

store.pipe(selectFilteredValues).subscribe(/* .. */);
```

</ngrx-code-example>

### Advanced Example: Select the last {n} state transitions

Let's examine the technique of combining NgRx selectors and RxJS operators in an advanced example.

In this example, we will write a selector function that projects values from two different slices of the application state.
The projected state will emit a value when both slices of state have a value.
Otherwise, the selector will emit an `undefined` value.

<ngrx-code-example header="index.ts">

```ts
export const selectProjectedValues = createSelector(
  selectFoo,
  selectBar,
  (foo, bar) => {
    if (foo && bar) {
      return { foo, bar };
    }

    return undefined;
  }
);
```

</ngrx-code-example>

Then, the component should visualize the history of state transitions.
We are not only interested in the current state but rather like to display the last `n` pieces of state.
Meaning that we will map a stream of state values (`1`, `2`, `3`) to an array of state values (`[1, 2, 3]`).

<ngrx-code-example header="select-last-state-transition.ts">

```ts
// The number of state transitions is given by the user (subscriber)
export const selectLastStateTransitions = (count: number) => {
  return pipe(
    // Thanks to `createSelector` the operator will have memoization "for free"
    select(selectProjectedValues), // Combines the last `count` state values in array
    scan((acc, curr) => {
      return [curr, ...acc].filter(
        (val, index) => index < count && val !== undefined
      );
    }, [] as { foo: number; bar: string }[]) // XX: Explicit type hint for the array.
    // Equivalent to what is emitted by the selector
  );
};
```

</ngrx-code-example>

Finally, the component will subscribe to the store, telling the number of state transitions it wishes to display:

<ngrx-code-example header="app.component.ts">

```ts
// Subscribe to the store using the custom pipeable operator
store.pipe(selectLastStateTransitions(3)).subscribe(/* .. */);
```

</ngrx-code-example>
