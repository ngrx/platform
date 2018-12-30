import { compose, Action } from '@ngrx/store';
import { Observable } from 'rxjs';

const METADATA_KEY = '__@ngrx/effects__';
const METADATA_FUNCTION_KEY = '__@ngrx/effects_function__';

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

export function getEffectsFunctions<T>(instance: T): Array<EffectMetadata<T>> {
  return (Object.getOwnPropertyNames(instance) as Extract<keyof T, string>[])
    .filter(propertyName =>
      instance[propertyName].hasOwnProperty(METADATA_FUNCTION_KEY)
    )
    .map(propertyName => ({
      propertyName,
      dispatch: (<any>instance[propertyName])[METADATA_FUNCTION_KEY].dispatch,
    }));
}

export function getSourceMetadata<T>(instance: T): Array<EffectMetadata<T>> {
  const effectsDecorators = compose(
    getEffectMetadataEntries,
    getSourceForInstance
  )(instance);

  const effectsFunctions = getEffectsFunctions(instance);

  return effectsDecorators.concat(effectsFunctions);
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

export function effect<T extends Action>(
  source: () => Observable<T>,
  options: { dispatch: false }
): Observable<T>;
export function effect<T extends Action>(
  source: () => Observable<T>,
  options?: { dispatch: true }
): Observable<T>;
export function effect<T extends Action>(
  source: () => Observable<T>,
  { dispatch = true } = {}
): Observable<T> {
  const effect = source();
  Object.defineProperty(effect, METADATA_FUNCTION_KEY, {
    value: {
      dispatch,
    },
  })[METADATA_FUNCTION_KEY];
  return effect;
}
