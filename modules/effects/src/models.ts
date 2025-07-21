import { Observable } from 'rxjs';

/**
 * Configures an effect created by `createEffect`.
 * @public
 */
export interface EffectConfig {
  /**
   * Determines if the action emitted by the effect is dispatched to the store.
   * If false, effect does not need to return type `Observable<Action>`.
   */
  dispatch?: boolean;
  /**
   * Determines whether the functional effect will be created.
   * If true, the effect can be created outside the effects class.
   */
  functional?: boolean;
  /**
   * Determines if the effect will be resubscribed to if an error occurs in the main actions stream.
   */
  useEffectsErrorHandler?: boolean;
}

/**
 * @public
 */
export const DEFAULT_EFFECT_CONFIG: Readonly<Required<EffectConfig>> = {
  dispatch: true,
  functional: false,
  useEffectsErrorHandler: true,
};

/**
 * @public
 */
export const CREATE_EFFECT_METADATA_KEY = '__@ngrx/effects_create__';

/**
 * @public
 */
export interface CreateEffectMetadata {
  [CREATE_EFFECT_METADATA_KEY]: EffectConfig;
}

/**
 * @public
 */
export interface FunctionalCreateEffectMetadata extends CreateEffectMetadata {
  [CREATE_EFFECT_METADATA_KEY]: EffectConfig & { functional: true };
}

/**
 * @public
 */
export type FunctionalEffect<
  Source extends () => Observable<unknown> = () => Observable<unknown>
> = Source & FunctionalCreateEffectMetadata;

/**
 * @public
 */
export type EffectPropertyKey<T extends Record<keyof T, Object>> = Exclude<
  keyof T,
  keyof Object
>;

/**
 * @public
 */
export interface EffectMetadata<T extends Record<keyof T, Object>>
  extends Required<EffectConfig> {
  propertyName: EffectPropertyKey<T>;
}

/**
 * @public
 */
export type EffectsMetadata<T extends Record<keyof T, Object>> = {
  [Key in EffectPropertyKey<T>]?: EffectConfig;
};
