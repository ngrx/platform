# API

## Initial State

Configure initial state when providing Store:

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

## Reducer Factory

@ngrx/store composes your map of reducers into a single reducer. Use the `reducerFactory`
configuration option to provide a composed action reducer factory:

```ts
import { StoreModule, combineReducers, compose } from '@ngrx/store';
import { reducers } from './reducers';

// console.log all actions
function debug(state, action) {
  console.log('state', state);
  console.log('action', action);

  return state;
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
