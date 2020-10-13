import { InjectionToken, Type } from '@angular/core';
import { EffectsErrorHandler } from './effects_error_handler';

export const _ROOT_EFFECTS_GUARD = new InjectionToken<void>(
  '@ngrx/effects Internal Root Guard'
);
export const USER_PROVIDED_EFFECTS = new InjectionToken<Type<any>[][]>(
  '@ngrx/effects User Provided Effects'
);
export const _ROOT_EFFECTS = new InjectionToken<Type<any>[]>(
  '@ngrx/effects Internal Root Effects'
);
export const ROOT_EFFECTS = new InjectionToken<Type<any>[]>(
  '@ngrx/effects Root Effects'
);
export const _FEATURE_EFFECTS = new InjectionToken<Type<any>[]>(
  '@ngrx/effects Internal Feature Effects'
);
export const FEATURE_EFFECTS = new InjectionToken<any[][]>(
  '@ngrx/effects Feature Effects'
);
export const EFFECTS_ERROR_HANDLER = new InjectionToken<EffectsErrorHandler>(
  '@ngrx/effects Effects Error Handler'
);
