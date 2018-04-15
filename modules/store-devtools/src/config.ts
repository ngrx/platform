import { ActionReducer, Action } from '@ngrx/store';
import { InjectionToken, Type } from '@angular/core';

export type ActionSanitizer = (action: Action, id: number) => Action;
export type StateSanitizer = (state: any, index: number) => any;

export class StoreDevtoolsConfig {
  maxAge: number | false;
  monitor: ActionReducer<any, any>;
  actionSanitizer?: ActionSanitizer;
  stateSanitizer?: StateSanitizer;
  name?: string;
  serialize?: boolean;
  logOnly?: boolean;
  features?: any;
  sanitizerService?: boolean;
}

export const STORE_DEVTOOLS_OPTIONS = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/devtools Options'
);

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/devtools Config'
);

export const INITIAL_OPTIONS = new InjectionToken<StoreDevtoolsConfig>(
  '@ngrx/devtools Initial Options'
);

export type StoreDevtoolsOptions =
  | Partial<StoreDevtoolsConfig>
  | (() => Partial<StoreDevtoolsConfig>);
