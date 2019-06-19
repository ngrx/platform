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
  imports: [StoreModule.forFeature('feature', FEATURE_REDUCER_TOKEN)],
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

export function getMetaReducers(
  some: SomeService
): MetaReducer&lt;fromRoot.State&gt;[] {
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
</code-example>


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
  return {initialState: someService.getInitialState()};
}

@NgModule({
  imports: [StoreModule.forFeature('feature', fromFeature.reducers, FEATURE_CONFIG_TOKEN)],
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

