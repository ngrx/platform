import { InjectionToken } from '@angular/core';
import {
  DevtoolsExtension,
  REDUX_DEVTOOLS_EXTENSION,
  ReduxDevtoolsExtension,
} from './extension';
import { DevtoolsDispatcher } from './devtools-dispatcher';
import {
  createConfig,
  INITIAL_OPTIONS,
  noMonitor,
  STORE_DEVTOOLS_CONFIG,
  StoreDevtoolsConfig,
  StoreDevtoolsOptions,
} from './config';
import {
  EnvironmentProviders,
  ReducerManagerDispatcher,
  StateObservable,
} from '@ngrx/store';
import { createStateObservable } from './instrument';
import { StoreDevtools } from './devtools';

export const IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken<boolean>(
  '@ngrx/store-devtools Is Devtools Extension or Monitor Present'
);

export function createIsExtensionOrMonitorPresent(
  extension: ReduxDevtoolsExtension | null,
  config: StoreDevtoolsConfig
) {
  return Boolean(extension) || config.monitor !== noMonitor;
}

export function createReduxDevtoolsExtension() {
  const extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';

  if (
    typeof window === 'object' &&
    typeof (window as any)[extensionKey] !== 'undefined'
  ) {
    return (window as any)[extensionKey];
  } else {
    return null;
  }
}

export function provideStoreDevtools(
  options: StoreDevtoolsOptions = {}
): EnvironmentProviders {
  return {
    ɵproviders: [
      DevtoolsExtension,
      DevtoolsDispatcher,
      StoreDevtools,
      {
        provide: INITIAL_OPTIONS,
        useValue: options,
      },
      {
        provide: IS_EXTENSION_OR_MONITOR_PRESENT,
        deps: [REDUX_DEVTOOLS_EXTENSION, STORE_DEVTOOLS_CONFIG],
        useFactory: createIsExtensionOrMonitorPresent,
      },
      {
        provide: REDUX_DEVTOOLS_EXTENSION,
        useFactory: createReduxDevtoolsExtension,
      },
      {
        provide: STORE_DEVTOOLS_CONFIG,
        deps: [INITIAL_OPTIONS],
        useFactory: createConfig,
      },
      {
        provide: StateObservable,
        deps: [StoreDevtools],
        useFactory: createStateObservable,
      },
      {
        provide: ReducerManagerDispatcher,
        useExisting: DevtoolsDispatcher,
      },
    ],
  };
}
