import { compose } from '@ngrx/store';
import { EffectMetadata } from './models';
import { getSourceForInstance } from './utils';

const METADATA_KEY = '__@ngrx/effects__';

export function Effect<T>({ dispatch = true } = {}): PropertyDecorator {
  return function<K extends Extract<keyof T, string>>(
    target: T,
    propertyName: K
  ) {
    const metadata: EffectMetadata<T> = { propertyName, dispatch };
    setEffectMetadataEntries<T>(target, [metadata]);
  } as (target: {}, propertyName: string | symbol) => void;
}

export function getEffectDecoratorMetadata<T>(
  instance: T
): EffectMetadata<T>[] {
  const effectsDecorators: EffectMetadata<T>[] = compose(
    getEffectMetadataEntries,
    getSourceForInstance
  )(instance);

  return effectsDecorators;
}

function setEffectMetadataEntries<T>(
  sourceProto: T,
  entries: EffectMetadata<T>[]
) {
  const constructor = sourceProto.constructor;
  const meta: Array<EffectMetadata<T>> = constructor.hasOwnProperty(
    METADATA_KEY
  )
    ? (constructor as any)[METADATA_KEY]
    : Object.defineProperty(constructor, METADATA_KEY, { value: [] })[
        METADATA_KEY
      ];
  Array.prototype.push.apply(meta, entries);
}

function getEffectMetadataEntries<T>(sourceProto: T): EffectMetadata<T>[] {
  return sourceProto.constructor.hasOwnProperty(METADATA_KEY)
    ? (sourceProto.constructor as any)[METADATA_KEY]
    : [];
}
