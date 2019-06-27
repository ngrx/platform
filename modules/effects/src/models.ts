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
   * Determines if the effect will be resubscribed if an error occurs in the main actions stream.
   */
  resubscribeOnError?: boolean;
}

export interface EffectMetadata<T> extends Required<EffectConfig> {
  propertyName: Extract<keyof T, string>;
}

export type EffectsMetadata<T> = {
  [key in Extract<keyof T, string>]?: EffectConfig
};
