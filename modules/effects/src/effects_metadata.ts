import { compose } from '@ngrx/store';

const METADATA_KEY = '__@ngrx/effects__';

export interface EffectMetadata<T> {
  propertyName: Extract<keyof T, string>;
  dispatch: boolean;
}

function getEffectMetadataEntries<T>(sourceProto: T): Array<EffectMetadata<T>> {
  return sourceProto.constructor.hasOwnProperty(METADATA_KEY)
    ? (sourceProto.constructor as any)[METADATA_KEY]
    : [];
}

function setEffectMetadataEntries<T>(
  sourceProto: T,
  entries: Array<EffectMetadata<T>>
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

export function Effect<T>({ dispatch = true } = {}): PropertyDecorator {
  return function<K extends Extract<keyof T, string>>(
    target: T,
    propertyName: K
  ) {
    const metadata: EffectMetadata<T> = { propertyName, dispatch };
    setEffectMetadataEntries<T>(target, [metadata]);
  } as (target: {}, propertyName: string | symbol) => void;
}

export function getSourceForInstance<T>(instance: T): T {
  return Object.getPrototypeOf(instance);
}

export function getSourceMetadata<T>(instance: T): Array<EffectMetadata<T>> {
  return compose(
    getEffectMetadataEntries,
    getSourceForInstance
  )(instance);
}

export type EffectsMetadata<T> = {
  [key in Extract<keyof T, string>]?: { dispatch: boolean }
};

export function getEffectsMetadata<T>(instance: T): EffectsMetadata<T> {
  const metadata: EffectsMetadata<T> = {};

  for (const { propertyName, dispatch } of getSourceMetadata(instance)) {
    metadata[propertyName] = { dispatch };
  }

  return metadata;
}
