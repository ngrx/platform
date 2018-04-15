import {
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
} from '@angular/core';
import { ReducerManagerDispatcher, StateObservable } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  INITIAL_OPTIONS,
  STORE_DEVTOOLS_CONFIG,
  StoreDevtoolsConfig,
  StoreDevtoolsOptions,
  STORE_DEVTOOLS_OPTIONS,
} from './config';
import { DevtoolsDispatcher, StoreDevtools } from './devtools';
import {
  DevtoolsExtension,
  REDUX_DEVTOOLS_EXTENSION,
  ReduxDevtoolsExtension,
} from './extension';
import { DevToolsSanitizerService } from './sanitizer-service';

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

  if (
    typeof window === 'object' &&
    typeof (window as any)[extensionKey] !== 'undefined'
  ) {
    return (window as any)[extensionKey];
  } else {
    return null;
  }
}

export function createStateObservable(
  devtools: StoreDevtools
): Observable<any> {
  return devtools.state;
}

export function noMonitor(): null {
  return null;
}

export const DEFAULT_NAME = 'NgRx Store DevTools';

export function createConfig(
  _options: StoreDevtoolsOptions,
  sanitizerService?: DevToolsSanitizerService,
  _injectedOptions?: StoreDevtoolsOptions
): StoreDevtoolsConfig {
  const DEFAULT_OPTIONS: StoreDevtoolsConfig = {
    maxAge: false,
    monitor: noMonitor,
    actionSanitizer: undefined,
    stateSanitizer: undefined,
    name: DEFAULT_NAME,
    serialize: false,
    logOnly: false,
    features: false,
    sanitizerService: false,
  };

  let options = typeof _options === 'function' ? _options() : _options;

  if (_injectedOptions) {
    let injectedOptions =
      typeof _injectedOptions === 'function'
        ? _injectedOptions()
        : _injectedOptions;
    options = {
      ...options,
      ...injectedOptions,
    };
  }

  const logOnly = options.logOnly
    ? { pause: true, export: true, test: true }
    : false;
  const features = options.features || logOnly;
  const config = Object.assign({}, DEFAULT_OPTIONS, { features }, options);

  if (config.maxAge && config.maxAge < 2) {
    throw new Error(
      `Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`
    );
  }

  if (config.sanitizerService === true && sanitizerService) {
    config.actionSanitizer = sanitizerService.sanitizeAction;
    config.stateSanitizer = sanitizerService.sanitizeState;
  }

  return config;
}

@NgModule({})
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
          deps: [
            INITIAL_OPTIONS,
            DevToolsSanitizerService,
            [new Optional(), STORE_DEVTOOLS_OPTIONS],
          ],
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
        {
          provide: DevToolsSanitizerService,
          useClass: DevToolsSanitizerService,
        },
      ],
    };
  }
}
