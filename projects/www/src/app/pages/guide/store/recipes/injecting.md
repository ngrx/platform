# Using Dependency Injection

## Injecting Reducers

To inject the root reducers into your application, use an `InjectionToken` and a `Provider` to register the reducers through dependency injection.

<ngrx-code-example header="app.module.ts">

```ts
import { NgModule, inject, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

import { SomeService } from './some.service';
import * as fromRoot from './reducers';

export const REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap<fromRoot.State>
>('Registered Reducers', {
  factory: () => {
    const serv = inject(SomeService);
    // return reducers synchronously
    return serv.getReducers();
  },
});

@NgModule({
  imports: [StoreModule.forRoot(REDUCER_TOKEN)],
})
export class AppModule {}
```

</ngrx-code-example>

Reducers are also injected when composing state through feature modules.

<ngrx-code-example header="feature.module.ts">

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
  imports: [
    StoreModule.forFeature(
      fromFeature.featureKey,
      FEATURE_REDUCER_TOKEN
    ),
  ],
  providers: [
    {
      provide: FEATURE_REDUCER_TOKEN,
      useFactory: getReducers,
    },
  ],
})
export class FeatureModule {}
```

</ngrx-code-example>

## Injecting Meta-Reducers

To inject 'middleware' meta reducers, use the `META_REDUCERS` injection token exported in
the Store API and a `Provider` to register the meta reducers through dependency
injection.

<ngrx-code-example header="app.module.ts">

```ts
import {
  ActionReducer,
  MetaReducer,
  META_REDUCERS,
} from '@ngrx/store';
import { SomeService } from './some.service';
import * as fromRoot from './reducers';

export function metaReducerFactory(): MetaReducer<fromRoot.State> {
  return (reducer: ActionReducer<any>) => (state, action) => {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

@NgModule({
  providers: [
    {
      provide: META_REDUCERS,
      deps: [SomeService],
      useFactory: metaReducerFactory,
      multi: true,
    },
  ],
})
export class AppModule {}
```

</ngrx-code-example>

<ngrx-docs-alert type="inform">

Careful attention should be called to the use of the `multi`
property in the provider here for `META_REDUCERS`. As this injection token may be utilized
by many libraries concurrently, specifying `multi: true` is critical to ensuring that all
library meta reducers are applied to any project that consumes multiple NgRx libraries with
registered meta reducers.

</ngrx-docs-alert>

## Injecting Feature Config

To inject the feature store configuration into your module, use an `InjectionToken` and a `Provider` to register the feature config object through dependency injection.

<ngrx-code-example header="feature.module.ts">

```ts
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, StoreConfig } from '@ngrx/store';
import { SomeService } from './some.service';

import * as fromFeature from './reducers';

export const FEATURE_CONFIG_TOKEN = new InjectionToken<
  StoreConfig<fromFeature.State>
>('Feature Config');

export function getConfig(
  someService: SomeService
): StoreConfig<fromFeature.State> {
  // return the config synchronously.
  return {
    initialState: someService.getInitialState(),

    metaReducers: [
      fromFeature.loggerFactory(someService.loggerConfig()),
    ],
  };
}

@NgModule({
  imports: [
    StoreModule.forFeature(
      fromFeature.featureKey,
      fromFeature.reducers,
      FEATURE_CONFIG_TOKEN
    ),
  ],
  providers: [
    {
      provide: FEATURE_CONFIG_TOKEN,
      deps: [SomeService],
      useFactory: getConfig,
    },
  ],
})
export class FeatureModule {}
```

</ngrx-code-example>
