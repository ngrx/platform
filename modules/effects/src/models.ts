/**
 * Configures an effect created by `createEffect`.
 */
export interface EffectConfig {
  /**
   * Determines if the action emitted by the effect is dispatched to the store.
   * If false, effect does not need to return type `Observable<Action>`.
   */
  dispatch?: boolean;
  /**
   * Determines if the effect will be resubscribed to if an error occurs in the main actions stream.
   */
  useEffectsErrorHandler?: boolean;
}

export const DEFAULT_EFFECT_CONFIG: Readonly<Required<EffectConfig>> = {
  dispatch: true,
  useEffectsErrorHandler: true,
};

export const CREATE_EFFECT_METADATA_KEY = '__@ngrx/effects_create__';

export interface CreateEffectMetadata {
  [CREATE_EFFECT_METADATA_KEY]: EffectConfig;
}

export type EffectPropertyKey<T extends Object> = Exclude<
  keyof T,
  keyof Object
>;

export interface EffectMetadata<T extends Object>
  extends Required<EffectConfig> {
  propertyName: EffectPropertyKey<T>;
}

export type EffectsMetadata<T> = {
  [key in EffectPropertyKey<T>]?: EffectConfig;
};
