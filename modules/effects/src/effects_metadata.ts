import { EffectMetadata, EffectsMetadata } from './models';
import { getCreateEffectMetadata } from './effect_creator';
import { getEffectDecoratorMetadata } from './effect_decorator';

export function getEffectsMetadata<T>(instance: T): EffectsMetadata<T> {
  const metadata: EffectsMetadata<T> = {};

  for (const { propertyName, dispatch } of getSourceMetadata(instance)) {
    metadata[propertyName] = { dispatch };
  }

  return metadata;
}

export function getSourceMetadata<T>(instance: T): EffectMetadata<T>[] {
  const effects: Array<(instance: T) => EffectMetadata<T>[]> = [
    getEffectDecoratorMetadata,
    getCreateEffectMetadata,
  ];

  return effects.reduce<EffectMetadata<T>[]>(
    (sources, source) => sources.concat(source(instance)),
    []
  );
}
