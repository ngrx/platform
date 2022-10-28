import { EffectMetadata, EffectsMetadata } from './models';
import { getCreateEffectMetadata } from './effect_creator';

export function getEffectsMetadata<T extends Record<keyof T, Object>>(
  instance: T
): EffectsMetadata<T> {
  return getSourceMetadata(instance).reduce(
    (
      acc: EffectsMetadata<T>,
      { propertyName, dispatch, useEffectsErrorHandler }
    ) => {
      acc[propertyName] = { dispatch, useEffectsErrorHandler };
      return acc;
    },
    {}
  );
}

export function getSourceMetadata<T extends { [props in keyof T]: object }>(
  instance: T
): EffectMetadata<T>[] {
  return getCreateEffectMetadata(instance);
}
