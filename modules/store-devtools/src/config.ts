import { ActionReducer, Action } from '@ngrx/store';
import { InjectionToken, Type } from '@angular/core';

export class StoreDevtoolsConfig {
  maxAge: number | false;
  monitor: ActionReducer<any, any>;
  name: string;
  actionSanitizer?: <A extends Action>(action: A, id: number) => A;
  stateSanitizer?: <S>(state: S, index: number) => S;
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
