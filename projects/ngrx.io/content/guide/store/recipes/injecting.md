# Using Dependency Injection

## Injecting Reducers

To inject the root reducers into your application, use an `InjectionToken` and a `Provider` to register the reducers through dependency injection.

```ts
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

import { SomeService } from './some.service';
import * as fromRoot from './reducers';

export const REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap<fromRoot.State>
>('Registered Reducers');

export function getReducers(someService: SomeService) {
  return someService.getReducers();
}

@NgModule({
  imports: [StoreModule.forRoot(REDUCER_TOKEN)],
  providers: [
    {
      provide: REDUCER_TOKEN,
      deps: [SomeService],
      useFactory: getReducers,
    },
  ],
})
export class AppModule {}
```

Reducers are also injected when composing state through feature modules.

```ts
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

import * as fromFeature from './reducers';

export const FEATURE_REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap<fromFeature.State>
>('Feature Reducers');

export function getReducers(): ActionReducerMap<fromFeature.State> {
  // map of reducers
  return {};
}

@NgModule({
  imports: [StoreModule.forFeature('feature', FEATURE_REDUCER_TOKEN)],
  providers: [
    {
      provide: FEATURE_REDUCER_TOKEN,
      useFactory: getReducers,
    },
  ],
})
export class FeatureModule {}
```

## Injecting Meta-Reducers

To inject 'middleware' meta reducers, use the `META_REDUCERS` injection token exported in
the Store API and a `Provider` to register the meta reducers through dependency
injection.

```ts
import { MetaReducer, META_REDUCERS } from '@ngrx/store';
import { SomeService } from './some.service';
import * as fromRoot from './reducers';

export function getMetaReducers(
  some: SomeService
): MetaReducer<fromRoot.State>[] {
  // return array of meta reducers;
}

@NgModule({
  providers: [
    {
      provide: META_REDUCERS,
      deps: [SomeService],
      useFactory: getMetaReducers,
    },
  ],
})
export class AppModule {}
```
