## ngrx-store-freeze

[![npm version](https://badge.fury.io/js/ngrx-store-freeze.svg)](https://badge.fury.io/js/ngrx-store-freeze)
[![CircleCI](https://circleci.com/gh/brandonroberts/ngrx-store-freeze/tree/master.svg?style=svg&circle-token=6ba0f6b74d2186f7896a58377b8607346c07cee6)](https://circleci.com/gh/brandonroberts/ngrx-store-freeze/tree/master)

ngrx-store-freeze is a meta-reducer that prevents state from being mutated

- Recursively freezes the **current state**, the dispatched **action payload** if provided and the **new state**.
- When mutation occurs, an exception will be thrown.
- Should be used **only in development** to ensure that the state remains immutable.

### Installation

```sh
npm i --save-dev ngrx-store-freeze
```

OR

```sh
yarn add ngrx-store-freeze --dev
```

### Setup

```ts
import { StoreModule, MetaReducer, ActionReducerMap } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../environments/environment'; // Angular CLI environment

export interface State {
  // reducer interfaces
}

export const reducers: ActionReducerMap<State> = {
  // reducers
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

@NgModule({
  imports: [StoreModule.forRoot(reducers, { metaReducers })],
})
export class AppModule {}
```

## Additional Documentation

- [Usage with `@ngrx/router-store`](./docs/docs.md#router-store-compatibility)

## Credits

[redux-freeze](https://github.com/buunguyen/redux-freeze) - Redux middleware that prevents state from being mutated  
[Attila Egyed](https://github.com/tsm91) - The original maintainer of this project
