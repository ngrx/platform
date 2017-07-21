import { merge } from 'rxjs/observable/merge';
import { ignoreElements } from 'rxjs/operator/ignoreElements';
import { Observable } from 'rxjs/Observable';
import { compose } from '@ngrx/store';

const METADATA_KEY = '@ngrx/effects';
const r: any = Reflect;

export interface EffectMetadata {
  propertyName: string;
  dispatch: boolean;
}

function hasStaticMetadata(sourceType: any): boolean {
  return !!(sourceType as any).propDecorators;
}

function getStaticMetadata(sourceType: any): EffectMetadata[] {
  const propDecorators = sourceType.propDecorators;
  return Object.keys(propDecorators).reduce(
    (all, key) => all.concat(getStaticMetadataEntry(propDecorators[key], key)),
    []
  );
}

function getStaticMetadataEntry(metadataEntry: any, propertyName: string) {
  return metadataEntry
    .filter((entry: any) => entry.type === Effect)
    .map((entry: any) => {
      let dispatch = true;
      if (entry.args && entry.args.length) {
        dispatch = !!entry.args[0].dispatch;
      }
      return { propertyName, dispatch };
    });
}

function getEffectMetadataEntries(sourceProto: any): EffectMetadata[] {
  if (hasStaticMetadata(sourceProto.constructor)) {
    return getStaticMetadata(sourceProto.constructor);
  }

  if (r.hasOwnMetadata(METADATA_KEY, sourceProto)) {
    return r.getOwnMetadata(METADATA_KEY, sourceProto);
  }

  return [];
}

function setEffectMetadataEntries(sourceProto: any, entries: EffectMetadata[]) {
  r.defineMetadata(METADATA_KEY, entries, sourceProto);
}

/**
 * @Annotation
 */
export function Effect({ dispatch } = { dispatch: true }): PropertyDecorator {
  return function(target: any, propertyName: string) {
    const effects: EffectMetadata[] = getEffectMetadataEntries(target);
    const metadata: EffectMetadata = { propertyName, dispatch };

    setEffectMetadataEntries(target, [...effects, metadata]);
  };
}

export function getSourceForInstance(instance: Object): any {
  return Object.getPrototypeOf(instance);
}

export const getSourceMetadata = compose(
  getEffectMetadataEntries,
  getSourceForInstance
);
