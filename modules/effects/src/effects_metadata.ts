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

function getEffectMetadataEntries(sourceProto: any): EffectMetadata[] {
  if (r.hasOwnMetadata(METADATA_KEY, sourceProto)) {
    return r.getOwnMetadata(METADATA_KEY, sourceProto);
  }

  return [];
}

function setEffectMetadataEntries(sourceProto: any, entries: EffectMetadata[]) {
  r.defineMetadata(METADATA_KEY, entries, sourceProto);
}

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
  getSourceForInstance,
);
