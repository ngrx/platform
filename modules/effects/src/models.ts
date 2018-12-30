export interface EffectMetadata<T> {
  propertyName: Extract<keyof T, string>;
  dispatch: boolean;
}

export type EffectsMetadata<T> = {
  [key in Extract<keyof T, string>]?: { dispatch: boolean }
};
