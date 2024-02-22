import * as operators from '@ngrx/operators';

export { createEffect } from './effect_creator';
export { EffectConfig } from './models';
export { getEffectsMetadata } from './effects_metadata';
export { mergeEffects } from './effects_resolver';
export {
  EffectsErrorHandler,
  defaultEffectsErrorHandler,
} from './effects_error_handler';
export {
  EffectsMetadata,
  CreateEffectMetadata,
  FunctionalEffect,
} from './models';
export { Actions, ofType } from './actions';
export { EffectsModule } from './effects_module';
export { EffectSources } from './effect_sources';
export { ROOT_EFFECTS_INIT, rootEffectsInit } from './effects_actions';
export { EffectsRunner } from './effects_runner';
export { EffectNotification } from './effect_notification';
export { EffectsFeatureModule } from './effects_feature_module';
export { EffectsRootModule } from './effects_root_module';
export { EFFECTS_ERROR_HANDLER } from './tokens';
export { act } from './act';
export {
  OnIdentifyEffects,
  OnRunEffects,
  OnInitEffects,
} from './lifecycle_hooks';
export { USER_PROVIDED_EFFECTS } from './tokens';
export { provideEffects } from './provide_effects';

/**
 * @deprecated Use `concatLatestFrom` from `@ngrx/operators` instead.
 */
export const concatLatestFrom = operators.concatLatestFrom;
