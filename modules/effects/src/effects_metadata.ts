import { EffectMetadata, EffectsMetadata } from './models';
import { getCreateEffectMetadata } from './effect_creator';

export function getEffectsMetadata<T extends Object>(
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

export function getSourceMetadata<T extends Object>(
  instance: T
): EffectMetadata<T>[] {
  const effects: Array<(instance: Object) => EffectMetadata<T>[]> = [
    getCreateEffectMetadata,
  ];

  return effects.reduce<EffectMetadata<T>[]>(
    (sources, source) => sources.concat(source(instance)),
    []
  );
}
