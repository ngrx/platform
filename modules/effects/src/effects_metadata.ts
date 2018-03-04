import { merge } from 'rxjs/observable/merge';
import { ignoreElements } from 'rxjs/operator/ignoreElements';
import { Observable } from 'rxjs/Observable';
import { compose } from '@ngrx/store';

const METADATA_KEY = '__@ngrx/effects__';
const r: any = Reflect;

export interface EffectMetadata {
  propertyName: string;
  dispatch: boolean;
}

function getEffectMetadataEntries(
  sourceProto: any,
  entries: EffectMetadata[] = []
): EffectMetadata[] {
  if (!sourceProto) return entries;

  const parent = Object.getPrototypeOf(sourceProto);

  if (!sourceProto.constructor.hasOwnProperty(METADATA_KEY)) {
    return getEffectMetadataEntries(parent, entries);
  }

  return getEffectMetadataEntries(
    parent,
    sourceProto.constructor[METADATA_KEY].concat(entries)
  );
}

function setEffectMetadataEntries(sourceProto: any, entries: EffectMetadata[]) {
  const constructor = sourceProto.constructor;
  const meta: EffectMetadata[] = constructor.hasOwnProperty(METADATA_KEY)
    ? (constructor as any)[METADATA_KEY]
    : Object.defineProperty(constructor, METADATA_KEY, { value: [] })[
        METADATA_KEY
      ];
  Array.prototype.push.apply(meta, entries);
}

export function Effect({ dispatch } = { dispatch: true }): PropertyDecorator {
  return function(target: any, propertyName: string) {
    const metadata: EffectMetadata = { propertyName, dispatch };
    setEffectMetadataEntries(target, [metadata]);
  } /*TODO(#823)*/ as any;
}

export function getSourceForInstance(instance: Object): any {
  return Object.getPrototypeOf(instance);
}

export const getSourceMetadata = compose(
  getEffectMetadataEntries,
  getSourceForInstance
);

export type EffectsMetadata<T> = {
  [key in keyof T]?:
    | undefined
    | {
        dispatch: boolean;
      }
};

export function getEffectsMetadata<T>(instance: T): EffectsMetadata<T> {
  const metadata: EffectsMetadata<T> = {};

  getSourceMetadata(instance).forEach(({ propertyName, dispatch }) => {
    (metadata /*TODO(#823)*/ as any)[propertyName] = { dispatch };
  });

  return metadata;
}
