import { InjectionToken, Type } from '@angular/core';

export const IMMEDIATE_EFFECTS = new InjectionToken<any[]>(
  'ngrx/effects: Immediate Effects',
);
export const ROOT_EFFECTS = new InjectionToken<Type<any>[]>(
  'ngrx/effects: Root Effects',
);
export const FEATURE_EFFECTS = new InjectionToken<any[][]>(
  'ngrx/effects: Feature Effects',
);
export const CONSOLE = new InjectionToken<Console>('Browser Console');
