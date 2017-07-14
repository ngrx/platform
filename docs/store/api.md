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

## Reducer Factory

@ngrx/store composes your map of reducers into a single reducer. Use the `reducerFactory`
configuration option to provide a composed action reducer factory:

```ts
import { StoreModule, combineReducers, compose } from '@ngrx/store';
import { reducers } from './reducers';

// console.log all actions
function debug(reducer) {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  }
}

const debugReducerFactory = compose(debug, combineReducers);

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { reducerFactory: debugReducerFactory })
  ]
})
export class AppModule {}
```

## Feature Module State Composition

Store uses fractal state management, which provides state composition through feature modules,
loaded eagerly or lazily. Provide feature states using the `StoreModule.forFeature` method. This
method defines the name of the feature state and the reducers that make up the state. The same `initialState`
and `reducerFactory` configuration options are available.

```ts
// feature.module.ts
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';

@NgModule({
  imports: [
    StoreModule.forFeature('featureName', reducers, { })
  ]
})
export class FeatureModule {}
```
