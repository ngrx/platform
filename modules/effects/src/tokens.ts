import { InjectionToken, Type } from '@angular/core';

export const _ROOT_EFFECTS_GUARD = new InjectionToken<void>(
  '@ngrx/effects Internal Root Guard'
);
export const IMMEDIATE_EFFECTS = new InjectionToken<any[]>(
  'ngrx/effects: Immediate Effects'
);
export const ROOT_EFFECTS = new InjectionToken<Type<any>[]>(
  'ngrx/effects: Root Effects'
);
export const FEATURE_EFFECTS = new InjectionToken<any[][]>(
  'ngrx/effects: Feature Effects'
);
