# API

## Initial State

Configure initial state when providing Store. `initialState` can be either the actual state, or a function that returns the initial state:

```ts
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      initialState: {
        counter: 3
      }
    })
  ]
})
export class AppModule {}
```

### Initial State and Ahead of Time (AoT) Compilation

Angular AoT requires all symbols referenced in the construction of its types (think `@NgModule`, `@Component`, `@Injectable`, etc.) to be statically defined. For this reason, we cannot dynamically inject state at runtime with AoT unless we provide `initialState` as a function. Thus the above `NgModule` definition simply changes to:

```ts
/// Pretend this is dynamically injected at runtime
const initialStateFromSomewhere = { counter: 3 };

/// Static state
const initialState = { counter: 2 };

/// In this function dynamic state slices, if they exist, will overwrite static state at runtime.
export function getInitialState() {
  return {...initialState, ...initialStateFromSomewhere};
}

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {initialState: getInitialState})
  ]
})
```

## Meta Reducers

@ngrx/store composes your map of reducers into a single reducer. Use the `metaReducers`
configuration option to provide an array of meta-reducers that are composed from right to left.

```ts
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { reducers } from './reducers';

// console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<any>[] = [debug];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers })
  ]
})
export class AppModule {}
```

## Feature Module State Composition

Store uses fractal state management, which provides state composition through feature modules,
loaded eagerly or lazily. Provide feature states using the `StoreModule.forFeature` method. This
method defines the name of the feature state and the reducers that make up the state. The same `initialState`
and `metaReducers` configuration options are available.

```ts
// feature.module.ts
import { StoreModule, ActionReducerMap } from '@ngrx/store';

export const reducers: ActionReducerMap<any> = {
  subFeatureA: featureAReducer,
  subFeatureB: featureBReducer,
};

@NgModule({
  imports: [
    StoreModule.forFeature('featureName', reducers)
  ]
})
export class FeatureModule {}
```

The feature state is added to the global application state once the feature is loaded. The feature state can then be selected using the [./selectors.md#createFeatureSelector](createFeatureSelector) convenience method.

## Injecting Reducers

To inject the root reducers into your application, use an `InjectionToken` and a `Provider` to register the reducers through dependency injection.

```ts
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

import { SomeService } from './some.service';
import * as fromRoot from './reducers';

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<fromRoot.State>>('Registered Reducers');

export function getReducers(someService: SomeService) {
  return someService.getReducers();
}

@NgModule({
  imports: [
    StoreModule.forRoot(REDUCER_TOKEN),
  ],
  providers: [
    {
      provide: REDUCER_TOKEN,
      deps: [SomeService],
      useFactory: getReducers
    }
  ]
})
export class AppModule { }
```

Reducers are also injected when composing state through feature modules.

```ts
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

import * as fromFeature from './reducers';

export const FEATURE_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<fromFeature.State>>('Feature Reducers');

// map of reducers
export const reducers: ActionReducerMap<fromFeature.State> = {

};

@NgModule({
  imports: [
    StoreModule.forFeature('feature', FEATURE_REDUCER_TOKEN),
  ],
  providers: [
    {
      provide: FEATURE_REDUCER_TOKEN,
      useValue: reducers
    }
  ]
})
export class FeatureModule { }
```

## Injecting Meta-Reducers

To inject meta reducers, use the `META_REDUCERS` injection token exported in
the Store API and a `Provider` to register the meta reducers through dependency
injection.

```
import { MetaReducer, META_REDUCERS } '@ngrx/store';
import { SomeService } from './some.service';

export function getMetaReducers(some: SomeService): MetaReducer[] {
  // return array of meta reducers;
}

@NgModule({
  providers: [
    {
      provide: META_REDUCERS,
      deps: [SomeService],
      useFactory: getMetaReducers
    }
  ]
})
export class AppModule {}
```
