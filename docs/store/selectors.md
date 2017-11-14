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
  feature: FeatureState
}

export const selectFeature = (state: AppState) => state.feature;
export const selectFeatureCount = createSelector(selectFeature, (state: FeatureState) => state.counter);
```


### Using selectors for multiple pieces of state

The `createSelector` can be used to select some data from the state based on several slices of the same state.

The `createSelector` function can take up to 8 selector function for more complete state selections.

For example, imagine you have a `selectedUser` object in the state. You also have an `allBooks` array of book objects.

And you want to show all books for the current user.

You can use the `createSelector` to achieve just that. Your visible books will always be up to date even if you update them in `allBooks` and they will always show the books that belong to your user if there is one selected, and will show all the books when there is no user selected.

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

export const selectVisibleBooks = createSelector(selectUser, selectAllBooks, (selectedUser: User, allBooks: Books[]) => {
  if (selectedUser && allBooks) {
    return allBooks.filter((book: Book) => book.userId === selectedUser.id);
  } else {
    return allBooks;
  }
});
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
  feature: FeatureState
}

export const selectFeature = createFeatureSelector<FeatureState>('feature');
export const selectFeatureCount = createSelector(selectFeature, (state: FeatureState) => state.counter);

```

## Using a Selector with the Store 

The functions returned by the `createSelector` and `createFeatureSelector` methods become alternatives to the string syntax for retrieving the relevant piece of state. 

### Example 

```ts
// app.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromRoot from './reducers';

@Component({
	selector: 'my-app',
	template: `
		<div>Current Count: {{ counter | async }}</div>
	`
})
class MyAppComponent {
	counter: Observable<number>;

	constructor(private store: Store<fromRoot.AppState>){
		this.counter = store.select(fromRoot.selectFeatureCount);
	}
}
```
