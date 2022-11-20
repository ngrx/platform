import { InjectionToken, Type } from '@angular/core';
import {
  defaultEffectsErrorHandler,
  EffectsErrorHandler,
} from './effects_error_handler';
import { FunctionalEffect } from './models';

export const _ROOT_EFFECTS_GUARD = new InjectionToken<void>(
  '@ngrx/effects Internal Root Guard'
);
export const USER_PROVIDED_EFFECTS = new InjectionToken<Type<unknown>[][]>(
  '@ngrx/effects User Provided Effects'
);
export const _ROOT_EFFECTS = new InjectionToken<
  [Array<Type<unknown> | Record<string, FunctionalEffect>>]
>('@ngrx/effects Internal Root Effects');
export const ROOT_EFFECTS_INSTANCES = new InjectionToken<unknown[]>(
  '@ngrx/effects Root Effects Instances'
);
export const _FEATURE_EFFECTS = new InjectionToken<
  Array<Type<unknown> | Record<string, FunctionalEffect>>[]
>('@ngrx/effects Internal Feature Effects');
export const FEATURE_EFFECTS_INSTANCE_GROUPS = new InjectionToken<unknown[][]>(
  '@ngrx/effects Feature Effects Instance Groups'
);
export const EFFECTS_ERROR_HANDLER = new InjectionToken<EffectsErrorHandler>(
  '@ngrx/effects Effects Error Handler',
  { providedIn: 'root', factory: () => defaultEffectsErrorHandler }
);
