# API

## Initial State

The initial state for the store is provided when configuring the application state.

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

@ngrx/store composes your map of reducers into a single reducer. In order to provide additional
composition of reducers, you can use the `reducerFactory` configuration option.

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
loaded eagerly or lazily. Feature states are added using the `StoreModule.forFeature` method. This
method defines the name of the feature state, the reducers that make up the state. The same `initialState`
and `reducerFactory` configuration options are also available.

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
