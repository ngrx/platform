import { ActionReducer } from '@ngrx/store';
import { InjectionToken, Type } from '@angular/core';


export interface StoreDevtoolsConfig {
  maxAge: number | false;
  monitor: ActionReducer<any, any>;
}

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<StoreDevtoolsConfig>('@ngrx/devtools Options');
export const INITIAL_OPTIONS = new InjectionToken<StoreDevtoolsConfig>('@ngrx/devtools Initial Config');

export type StoreDevtoolsOptions
  = Partial<StoreDevtoolsConfig>
  | (() => Partial<StoreDevtoolsConfig>)
  ;
