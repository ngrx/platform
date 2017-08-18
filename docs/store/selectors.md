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

```ts
// app.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
