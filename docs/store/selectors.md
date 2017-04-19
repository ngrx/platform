# Selectors

Selectors are methods uses for selecting slices of state. @ngrx/store provides methods for selecting state.

## createSelector

The `createSelector` method returns a callback function for selecting slices of state. It also memoizes
selected data for efficient reuse of selected state.


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

The `createFeatureSelector` methods returns a selector function for a feature slice of state.

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
