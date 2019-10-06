# Using Dependency Injection

## Injecting Reducers

To inject the root reducers into your application, use an `InjectionToken` and a `Provider` to register the reducers through dependency injection.

<code-example header="app.module.ts">
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

import { SomeService } from './some.service';
import * as fromRoot from './reducers';

export const REDUCER_TOKEN = new InjectionToken&lt;ActionReducerMap&lt;fromRoot.State&gt;&gt;('Registered Reducers', {
  factory: () => {
    const serv = inject(SomeService);
    // return reducers synchronously
    return serv.getReducers();
  }
});

@NgModule({
  imports: [StoreModule.forRoot(REDUCER_TOKEN)]
})
export class AppModule {}
</code-example>

Reducers are also injected when composing state through feature modules.

<code-example header="feature.module.ts">
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

import * as fromFeature from './reducers';

export const FEATURE_REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap&lt;fromFeature.State&gt;
>('Feature Reducers');

export function getReducers(): ActionReducerMap&lt;fromFeature.State&gt; {
  // map of reducers
  return {};
}

@NgModule({
  imports: [StoreModule.forFeature(fromFeature.featureKey, FEATURE_REDUCER_TOKEN)],
  providers: [
    {
      provide: FEATURE_REDUCER_TOKEN,
      useFactory: getReducers,
    },
  ],
})
export class FeatureModule {}
</code-example>

## Injecting Meta-Reducers

To inject 'middleware' meta reducers, use the `META_REDUCERS` injection token exported in
the Store API and a `Provider` to register the meta reducers through dependency
injection.

<code-example header="app.module.ts">
import { MetaReducer, META_REDUCERS } from '@ngrx/store';
import { SomeService } from './some.service';
import * as fromRoot from './reducers';

export function metaReducerFactory(): MetaReducer&lt;fromRoot.State&gt; {
  return (reducer: ActionReducer&lt;any&gt;) => (state, action) => {
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
</code-example>

<div class="alert is-important">

Careful attention should be called to the use of the `multi` 
property in the provider here for `META_REDUCERS`. As this injection token may be utilized 
by many libraries concurrently, specifying `multi: true` is critical to ensuring that all 
library meta reducers are applied to any project that consumes multiple NgRx libraries with 
registered meta reducers.

</div>


## Injecting Feature Config

To inject the feature store configuration into your module, use an `InjectionToken` and a `Provider` to register the feature config object through dependency injection.

<code-example header="feature.module.ts">
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, StoreConfig } from '@ngrx/store';
import { SomeService } from './some.service';

import * as fromFeature from './reducers';

export const FEATURE_CONFIG_TOKEN = new InjectionToken&lt;StoreConfig&lt;fromFeature.State&gt;&gt;('Feature Config');

export function getConfig(someService: SomeService): StoreConfig&lt;fromFeature.State&gt; {
  // return the config synchronously.
  return {
    initialState: someService.getInitialState(),

    metaReducers: [
      fromFeature.loggerFactory(someService.loggerConfig())
    ]
  };
}

@NgModule({
  imports: [StoreModule.forFeature(fromFeature.featureKey, fromFeature.reducers, FEATURE_CONFIG_TOKEN)],
  providers: [
    {
      provide: FEATURE_CONFIG_TOKEN,
      deps: [SomeService],
      useFactory: getConfig,
    },
  ],
})
export class FeatureModule {}
</code-example>

