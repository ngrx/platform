import { ActionReducer } from '@ngrx/store';
import { InjectionToken, Type } from '@angular/core';


export interface StoreDevtoolsConfig {
  maxAge: number | false;
  monitor: ActionReducer<any, any>;
  shouldInstrument: Type<boolean> | InjectionToken<boolean>;
}

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<StoreDevtoolsConfig>('@ngrx/devtools Options');
export const INITIAL_OPTIONS = new InjectionToken<StoreDevtoolsConfig>('@ngrx/devtools Initial Config');
export const SHOULD_INSTRUMENT = new InjectionToken<boolean>('@ngrx/devtools Should Instrument');

export type StoreDevtoolsOptions
  = Partial<StoreDevtoolsConfig>
  | (() => Partial<StoreDevtoolsConfig>)
  ;
