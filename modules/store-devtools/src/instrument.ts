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
import { StoreDevtoolsConfig, StoreDevtoolsOptions, STORE_DEVTOOLS_CONFIG, INITIAL_OPTIONS } from './config';
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

export function createStateObservable(devtools: StoreDevtools) {
  return devtools.state;
}

export function noMonitor(): null {
  return null;
}

export function createConfig(_options: StoreDevtoolsOptions): StoreDevtoolsConfig {
  const DEFAULT_OPTIONS: StoreDevtoolsConfig = {
    maxAge: false,
    monitor: noMonitor
  };

  let options = typeof _options === 'function' ? _options() : _options;
  const config = Object.assign({}, DEFAULT_OPTIONS, options);

  if (config.maxAge && config.maxAge < 2) {
    throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`);
  }

  return config;
}

@NgModule({ })
export class StoreDevtoolsModule {
  static instrument(options: StoreDevtoolsOptions = {}): ModuleWithProviders {
    return {
      ngModule: StoreDevtoolsModule,
      providers: [
        DevtoolsExtension,
        DevtoolsDispatcher,
        StoreDevtools,
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
          provide: STORE_DEVTOOLS_CONFIG,
          deps: [ INITIAL_OPTIONS ],
          useFactory: createConfig
        },
        {
          provide: StateObservable,
          deps: [ StoreDevtools ],
          useFactory: createStateObservable
        },
        {
          provide: ReducerManagerDispatcher,
          useExisting: DevtoolsDispatcher
        },
      ]
    };
  }
}
