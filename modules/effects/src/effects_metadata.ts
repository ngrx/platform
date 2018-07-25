import { compose } from '@ngrx/store';

const METADATA_KEY = '__@ngrx/effects__';

export interface EffectMetadata<T> {
  // Once TS is >= 2.8 replace with <Key extends Extract<keyof T, string>>
  propertyName: string;
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
  // Once TS is >= 2.8 replace with <Key extends Extract<keyof T, string>>
  // for propertyName.
  return function(target: T, propertyName: string) {
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

// Once TS is >= 2.8 replace with
// {[key in <Key extends Extract<keyof T, string>>]?:  { dispatch: boolean } };
export type EffectsMetadata<T> = { [key: string]: { dispatch: boolean } };

export function getEffectsMetadata<T>(instance: T): EffectsMetadata<T> {
  const metadata: EffectsMetadata<T> = {};

  for (const { propertyName, dispatch } of getSourceMetadata(instance)) {
    metadata[propertyName] = { dispatch };
  }

  return metadata;
}
