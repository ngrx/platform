import { InjectionToken, Type } from '@angular/core';
import {
  defaultEffectsErrorHandler,
  EffectsErrorHandler,
} from './effects_error_handler';
import { FunctionalEffect } from './models';

/**
 * @public
 */
export const _ROOT_EFFECTS_GUARD = new InjectionToken<void>(
  '@ngrx/effects Internal Root Guard'
);
/**
 * @public
 */
export const USER_PROVIDED_EFFECTS = new InjectionToken<
  Array<Type<unknown> | InjectionToken<unknown>>[]
>('@ngrx/effects User Provided Effects');
/**
 * @public
 */
export const _ROOT_EFFECTS = new InjectionToken<
  [Array<Type<unknown> | Record<string, FunctionalEffect>>]
>('@ngrx/effects Internal Root Effects');
/**
 * @public
 */
export const _ROOT_EFFECTS_INSTANCES = new InjectionToken<unknown[]>(
  '@ngrx/effects Internal Root Effects Instances'
);
/**
 * @public
 */
export const _FEATURE_EFFECTS = new InjectionToken<
  Array<Type<unknown> | Record<string, FunctionalEffect>>[]
>('@ngrx/effects Internal Feature Effects');
/**
 * @public
 */
export const _FEATURE_EFFECTS_INSTANCE_GROUPS = new InjectionToken<unknown[][]>(
  '@ngrx/effects Internal Feature Effects Instance Groups'
);
/**
 * @public
 */
export const EFFECTS_ERROR_HANDLER = new InjectionToken<EffectsErrorHandler>(
  '@ngrx/effects Effects Error Handler',
  { providedIn: 'root', factory: () => defaultEffectsErrorHandler }
);
