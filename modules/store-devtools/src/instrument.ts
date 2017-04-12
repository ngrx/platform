import { NgModule, InjectionToken, Injector, ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  StoreModule,
  State,
  StateObservable,
  ActionsSubject,
  ScannedActionsSubject,
  ReducerObservable,
  ReducerManagerDispatcher,
  ActionReducerMap,
  ActionReducerFactory,
  INITIAL_STATE,
  INITIAL_REDUCERS,
  REDUCER_FACTORY } from '@ngrx/store';
import { StoreDevtools, DevtoolsDispatcher } from './devtools';
import { StoreDevtoolsConfig, StoreDevtoolsOptions, STORE_DEVTOOLS_CONFIG, INITIAL_OPTIONS, SHOULD_INSTRUMENT } from './config';
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION, ReduxDevtoolsExtension } from './extension';


export const IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken<boolean>(
  'Is Devtools Extension or Monitor Present'
);

export function createIsExtensionOrMonitorPresent(
  extension: ReduxDevtoolsExtension | null,
  config: StoreDevtoolsConfig
) {
  return Boolean(extension) || config.monitor !== noMonitor;
}

export function createReduxDevtoolsExtension() {
  const extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';

  if (typeof window === 'object' && typeof (window as any)[extensionKey] !== 'undefined') {
    return (window as any)[extensionKey];
  }
  else {
    return null;
  }
}

export function createStateObservable(shouldInstrument: boolean, injector: Injector) {
  return shouldInstrument ? injector.get(StoreDevtools).state : injector.get(State);
}

export function createReducerManagerDispatcher(shouldInstrument: boolean, injector: Injector) {
  return shouldInstrument ? injector.get(DevtoolsDispatcher) : injector.get(ActionsSubject);
}

export function noMonitor(): null {
  return null;
}

export function createConfig(_options: StoreDevtoolsOptions): StoreDevtoolsConfig {
  const DEFAULT_OPTIONS: StoreDevtoolsConfig = {
    maxAge: false,
    monitor: noMonitor,
    shouldInstrument: IS_EXTENSION_OR_MONITOR_PRESENT,
  };

  let options = typeof _options === 'function' ? _options() : _options;
  const config = Object.assign({}, DEFAULT_OPTIONS, options);

  if (config.maxAge && config.maxAge < 2) {
    throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`);
  }

  return config;
}

export function createShouldInstrument(injector: Injector, config: StoreDevtoolsConfig) {
  return injector.get(config.shouldInstrument);
}

@NgModule({
  imports: [
    StoreModule
  ],
  providers: [
    DevtoolsExtension,
    DevtoolsDispatcher,
    StoreDevtools,
  ]
})
export class StoreDevtoolsModule {
  static instrument(options: StoreDevtoolsOptions = {}): ModuleWithProviders {
    return {
      ngModule: StoreDevtoolsModule,
      providers: [
        {
          provide: INITIAL_OPTIONS,
          useValue: options
        },
        {
          provide: IS_EXTENSION_OR_MONITOR_PRESENT,
          deps: [ REDUX_DEVTOOLS_EXTENSION, STORE_DEVTOOLS_CONFIG ],
          useFactory: createIsExtensionOrMonitorPresent
        },
        {
          provide: REDUX_DEVTOOLS_EXTENSION,
          useFactory: createReduxDevtoolsExtension
        },
        {
          provide: SHOULD_INSTRUMENT,
          deps: [ Injector, STORE_DEVTOOLS_CONFIG ],
          useFactory: createShouldInstrument
        },
        {
          provide: STORE_DEVTOOLS_CONFIG,
          deps: [ INITIAL_OPTIONS ],
          useFactory: createConfig
        },
        {
          provide: StateObservable,
          deps: [ SHOULD_INSTRUMENT, Injector ],
          useFactory: createStateObservable
        },
        {
          provide: ReducerManagerDispatcher,
          deps: [ SHOULD_INSTRUMENT, Injector ],
          useFactory: createReducerManagerDispatcher
        },
      ]
    };
  }
}
