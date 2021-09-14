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

/**
 * Chrome extension documentation
 * @see https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md#features
 * Firefox extension documentation
 * @see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#features
 */
export interface DevToolsFeatureOptions {
  /**
   * Start/pause recording of dispatched actions
   */
  pause?: boolean;
  /**
   * Lock/unlock dispatching actions and side effects
   */
  lock?: boolean;
  /**
   * Persist states on page reloading
   */
  persist?: boolean;
  /**
   * Export history of actions in a file
   */
  export?: boolean;
  /**
   * Import history of actions from a file
   */
  import?: 'custom' | boolean;
  /**
   * Jump back and forth (time travelling)
   */
  jump?: boolean;
  /**
   * Skip (cancel) actions
   */
  skip?: boolean;
  /**
   * Drag and drop actions in the history list
   */
  reorder?: boolean;
  /**
   * Dispatch custom actions or action creators
   */
  dispatch?: boolean;
  /**
   * Generate tests for the selected actions
   */
  test?: boolean;
}

/**
 * Chrome extension documentation
 * @see https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md
 * Firefox extension documentation
 * @see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
 */
export class StoreDevtoolsConfig {
  /**
   * Maximum allowed actions to be stored in the history tree (default: `false`)
   */
  maxAge: number | false = false;
  monitor?: ActionReducer<any, any>;
  /**
   * Function which takes `action` object and id number as arguments, and should return `action` object back.
   */
  actionSanitizer?: ActionSanitizer;
  /**
   * Function which takes `state` object and index as arguments, and should return `state` object back.
   */
  stateSanitizer?: StateSanitizer;
  /**
   * The instance name to be shown on the monitor page (default: `document.title`)
   */
  name?: string;
  serialize?: boolean | SerializationOptions;
  logOnly?: boolean;
  features?: DevToolsFeatureOptions;
  /**
   * Action types to be hidden in the monitors. If `actionsSafelist` specified, `actionsBlocklist` is ignored.
   */
  actionsBlocklist?: string[];
  /**
   * Action types to be shown in the monitors
   */
  actionsSafelist?: string[];
  /**
   * Called for every action before sending, takes state and action object, and returns true in case it allows sending the current data to the monitor.
   */
  predicate?: Predicate;
  /**
   * Auto pauses when the extension’s window is not opened, and so has zero impact on your app when not in use.
   */
  autoPause?: boolean;
}

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/store-devtools Options'
);

/**
 * Used to provide a `StoreDevtoolsConfig` for the store-devtools.
 */
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
      pause: true, // Start/pause recording of dispatched actions
      lock: true, // Lock/unlock dispatching actions and side effects
      persist: true, // Persist states on page reloading
      export: true, // Export history of actions in a file
      import: 'custom', // Import history of actions from a file
      jump: true, // Jump back and forth (time travelling)
      skip: true, // Skip (cancel) actions
      reorder: true, // Drag and drop actions in the history list
      dispatch: true, // Dispatch custom actions or action creators
      test: true, // Generate tests for the selected actions
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
