# Selectors

Selectors are methods used for obtaining slices of store state. @ngrx/store provides a few helper functions for optimizing this selection.

When using the `createSelector` and `createFeatureSelector`functions @ngrx/store keeps track of the latest arguments in which your selector function was invoked. Because selectors are [pure functions](https://en.wikipedia.org/wiki/Pure_function), the last result can be returned when the arguments match without reinvoking your selector function. This can provide performance benefits, particularly with selectors that perform expensive computation. This practice is known as [memoization](https://en.wikipedia.org/wiki/Memoization).

## createSelector

The `createSelector` method returns a callback function for selecting a slice of state.

### Example

```ts
// reducers.ts
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

### Using selectors for multiple pieces of state

The `createSelector` can be used to select some data from the state based on several slices of the same state.

The `createSelector` function can take up to 8 selector function for more complete state selections.

For example, imagine you have a `selectedUser` object in the state. You also have an `allBooks` array of book objects.

And you want to show all books for the current user.

You can use `createSelector` to achieve just that. Your visible books will always be up to date even if you update them in `allBooks`. They will always show the books that belong to your user if there is one selected and will show all the books when there is no user selected.

The result will be just some of your state filtered by another section of the state. And it will be always up to date.

```ts
// reducers.ts
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
  (selectedUser: User, allBooks: Books[]) => {
    if (selectedUser && allBooks) {
      return allBooks.filter((book: Book) => book.userId === selectedUser.id);
    } else {
      return allBooks;
    }
  }
);
```

## createFeatureSelector

The `createFeatureSelector` is a convenience method for returning a top level feature state. It returns a typed selector function for a feature slice of state.

### Example

```ts
// reducers.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface FeatureState {
  counter: number;
}

export interface AppState {
  feature: FeatureState;
}

export const selectFeature = createFeatureSelector<FeatureState>('feature');
export const selectFeatureCount = createSelector(
  selectFeature,
  (state: FeatureState) => state.counter
);
```

## Reset Memoized Selector

The selector function returned by calling `createSelector` or `createFeatureSelector` initially has a memoized value of `null`. After a selector is invoked the first time its memoized value is stored in memory. If the selector is subsequently invoked with the same arguments it will return the memoized value. If the selector is then invoked with different arguments it will recompute and update its memoized value. Consider the following:

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

A selector's memoized value stays in memory indefinitely. If the memoized value is, for example, a large dataset that is no longer needed it's possible to reset the memoized value to null so that the large dataset can be removed from memory. This can be accomplished by invoking the `release` method on the selector.

```ts
selectTotal(state); // returns the memoized value of 8
selectTotal.release(); // memoized value of selectTotal is now null
```

Releasing a selector also recursively releases any ancestor selectors. Consider the following:

```ts
export interface State {
  evenNums: number[];
  oddNums: number[];
}

export const selectSumEvenNums = createSelector(
  (state: State) => state.evenNums,
  evenNums => evenNums.reduce((prev, curr) => prev + curr)
);
export const selectSumOddNums = createSelector(
  (state: State) => state.oddNums,
  oddNums => oddNums.reduce((prev, curr) => prev + curr)
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

## Using a Selector with the Store

The functions returned by the `createSelector` and `createFeatureSelector` methods become alternatives to the string syntax for retrieving the relevant piece of state.

### Example

```ts
// app.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromRoot from './reducers';

@Component({
  selector: 'my-app',
  template: `
    <div>Current Count: {{ counter | async }}</div>
  `,
})
class MyAppComponent {
  counter: Observable<number>;

  constructor(private store: Store<fromRoot.AppState>) {
    this.counter = store.pipe(select(fromRoot.selectFeatureCount));
  }
}
```

## Advanced Usage

Selectors empower you to compose a [read model for your application state](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs#solution).
In terms of the CQRS architectural pattern, NgRx separates the read model (selectors) from the write model (reducers).
An advanced technique is to combine selectors with [RxJS pipeable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md).

This section covers some basics of how selectors compare to pipeable operators and demonstrates how `createSelector` and `scan` are utilized to display a history of state transitions.

### Breaking Down the Basics

#### Step 1: Select a non-empty state

Let's pretend we have a selector called `selectValues` and the component for displaying the data is only interested in defined values, i.e., it should not display empty states.
The straight-forward solution is to apply the RxJS `filter` operator to the `Observable` returned by `store.select()`:

```ts
import { filter } from 'rxjs/operators';

store
  .select(selectValues)
  .pipe(
    filter(val => val !== undefined)
  )
  .subscribe(/* .. */);
```

#### Step 2: Refactoring to pipeable operators

The same behaviour can be achieved by re-writing the above piece of code to use only RxJS pipeable operators instead of the `store.select()` function:

```ts
import { map, filter } from 'rxjs/operators';

store.pipe(
  map(state => selectValues(state)),
  filter(val => val !== undefined)
).subscribe(/* .. */);
```

The above can be further re-written to use the `select()` utility function from NgRx:

```ts
import { select } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';

store.pipe(
  select(selectValues(state)),
  filter(val => val !== undefined)
).subscribe(/* .. */);
```

#### Solution: Extracting a pipeable operator

To make the `select()` and `filter()` behaviour a re-usable piece of code, we extract a [pipeable operator](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) using the RxJS `pipe()` utility function:

```ts
import { select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

export const selectFilteredValues = pipe(
  select(selectValues),
  filter(val => val !== undefined)
);

store.pipe(selectFilteredValues)
     .subcribe(/* .. */);
```

### Advanced Example: Select the last {n} state transitions

Let's examine the technique of combining NgRx selectors and RxJS operators in an advanced example.

In this example, we will write a  selector function that projects values from two different slices of the application state.
The projected state will emit a value when both slices of state have a value.
Otherwise, the selector will emit an `undefined` value.

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

Then, the component should visualize the history of state transitions.
We are not only interested in the current state but rather like to display the last `n` pieces of state.
Meaning that we will map a stream of state values (`1`, `2`, `3`)  to an array of state values (`[1, 2, 3]`).

```ts
// The number of state transitions is given by the user (subscriber)
export const selectLastStateTransitions = (count: number) => {

  return pipe(
    // Thanks to `createSelector` the operator will have memoization "for free"
    select(selectProjectedValues),
    // Combines the last `count` state values in array
    scan((acc, curr) => {
      return [ curr, acc[0], acc[1] ].filter(val => val !== undefined);
    } [] as {foo: number; bar: string}[]) // XX: Explicit type hint for the array.
                                          // Equivalent to what is emitted by the selelctor
  );
}
```

Finally, the component will subscribe to the store, telling the number of state transitions it wishes to display:

```ts
// Subscribe to the store using the custom pipeable operator
store.pipe(selectLastStateTransitions(3))
     .subscribe(/* .. */);
```

See the [advanced example live in action in a Stackblitz](https://stackblitz.com/edit/angular-ngrx-effects-1rj88y?file=app%2Fstore%2Ffoo.ts)
