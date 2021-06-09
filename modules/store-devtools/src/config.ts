import { ActionReducer, Action } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

export type ActionSanitizer = (action: Action, id: number) => Action;
export type StateSanitizer = (state: any, index: number) => any;
export type SerializationOptions = {
  options?: boolean | any;
  replacer?: (key: any, value: any) => {};
  reviver?: (key: any, value: any) => {};
  immutable?: any;
  refs?: Array<any>;
};
export type Predicate = (state: any, action: Action) => boolean;
export interface DevToolsFeatureOptions {
  pause?: boolean;
  lock?: boolean;
  persist?: boolean;
  export?: boolean;
  import?: 'custom' | boolean;
  jump?: boolean;
  skip?: boolean;
  reorder?: boolean;
  dispatch?: boolean;
  test?: boolean;
}

export class StoreDevtoolsConfig {
  maxAge: number | false = false;
  monitor?: ActionReducer<any, any>;
  actionSanitizer?: ActionSanitizer;
  stateSanitizer?: StateSanitizer;
  name?: string;
  serialize?: boolean | SerializationOptions;
  logOnly?: boolean;
  features?: DevToolsFeatureOptions;
  actionsBlocklist?: string[];
  actionsSafelist?: string[];
  predicate?: Predicate;
  autoPause?: boolean;
}

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/store-devtools Options'
);
export const INITIAL_OPTIONS = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/store-devtools Initial Config'
);

export type StoreDevtoolsOptions =
  | Partial<StoreDevtoolsConfig>
  | (() => Partial<StoreDevtoolsConfig>);

export function noMonitor(): null {
  return null;
}

export const DEFAULT_NAME = 'NgRx Store DevTools';

export function createConfig(
  optionsInput: StoreDevtoolsOptions
): StoreDevtoolsConfig {
  const DEFAULT_OPTIONS: StoreDevtoolsConfig = {
    maxAge: false,
    monitor: noMonitor,
    actionSanitizer: undefined,
    stateSanitizer: undefined,
    name: DEFAULT_NAME,
    serialize: false,
    logOnly: false,
    autoPause: false,
    // Add all features explicitly. This prevent buggy behavior for
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

  const options =
    typeof optionsInput === 'function' ? optionsInput() : optionsInput;
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
