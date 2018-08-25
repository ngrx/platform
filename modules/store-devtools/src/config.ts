import { ActionReducer, Action } from '@ngrx/store';
import { InjectionToken, Type } from '@angular/core';

export type ActionSanitizer = (action: Action, id: number) => Action;
export type StateSanitizer = (state: any, index: number) => any;
export type SerializationOptions = {
  options?: boolean | any;
  replacer?: (key: any, value: any) => {};
  reviver?: (key: any, value: any) => {};
  immutable?: any;
  refs?: Array<any>;
};

export class StoreDevtoolsConfig {
  maxAge: number | false;
  monitor: ActionReducer<any, any>;
  actionSanitizer?: ActionSanitizer;
  stateSanitizer?: StateSanitizer;
  name?: string;
  serialize?: boolean | SerializationOptions;
  logOnly?: boolean;
  features?: any;
}

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/devtools Options'
);
export const INITIAL_OPTIONS = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/devtools Initial Config'
);

export type StoreDevtoolsOptions =
  | Partial<StoreDevtoolsConfig>
  | (() => Partial<StoreDevtoolsConfig>);

export function noMonitor(): null {
  return null;
}

export const DEFAULT_NAME = 'NgRx Store DevTools';

export function createConfig(
  _options: StoreDevtoolsOptions
): StoreDevtoolsConfig {
  const DEFAULT_OPTIONS: StoreDevtoolsConfig = {
    maxAge: false,
    monitor: noMonitor,
    actionSanitizer: undefined,
    stateSanitizer: undefined,
    name: DEFAULT_NAME,
    serialize: false,
    logOnly: false,
    // Add all features explicitely. This prevent buggy behavior for
    // options like "lock" which might otherwise not show up.
    features: {
      pause: true, // start/pause recording of dispatched actions
      lock: true, // lock/unlock dispatching actions and side effects
      persist: true, // persist states on page reloading
      export: true, // export history of actions in a file
      import: 'custom', // import history of actions from a file
      jump: true, // jump back and forth (time travelling)
      skip: true, // skip (cancel) actions
      reorder: true, // drag and drop actions in the history list
      dispatch: true, // dispatch custom actions or action creators
      test: true, // generate tests for the selected actions
    },
  };

  let options = typeof _options === 'function' ? _options() : _options;
  const logOnly = options.logOnly
    ? { pause: true, export: true, test: true }
    : false;
  const features = options.features || logOnly || DEFAULT_OPTIONS.features;
  const config = Object.assign({}, DEFAULT_OPTIONS, { features }, options);

  if (config.maxAge && config.maxAge < 2) {
    throw new Error(
      `Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`
    );
  }

  return config;
}
