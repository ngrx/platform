export interface EffectConfig {
  dispatch?: boolean;
  resubscribeOnError?: boolean;
}

export interface EffectMetadata<T> extends Required<EffectConfig> {
  propertyName: Extract<keyof T, string>;
}

export type EffectsMetadata<T> = {
  [key in Extract<keyof T, string>]?: EffectConfig
};
