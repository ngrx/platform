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
