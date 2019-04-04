import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { EffectMetadata } from './models';

const CREATE_EFFECT_METADATA_KEY = '__@ngrx/effects_create__';

export function createEffect<
  R extends Observable<unknown> | ((...args: any[]) => Observable<unknown>)
>(source: () => R, options: { dispatch: false }): R;
export function createEffect<
  T extends Action,
  R extends Observable<T> | ((...args: any[]) => Observable<T>)
>(source: () => R, options?: { dispatch: true }): R;
export function createEffect<
  T extends Action,
  R extends Observable<T> | ((...args: any[]) => Observable<T>)
>(source: () => R, { dispatch = true } = {}): R {
  const effect = source();
  Object.defineProperty(effect, CREATE_EFFECT_METADATA_KEY, {
    value: {
      dispatch,
    },
  });
  return effect;
}

export function getCreateEffectMetadata<T>(instance: T): EffectMetadata<T>[] {
  const propertyNames = Object.getOwnPropertyNames(instance) as Extract<
    keyof T,
    string
  >[];

  const metadata: EffectMetadata<T>[] = propertyNames
    .filter(
      propertyName =>
        instance[propertyName] &&
        instance[propertyName].hasOwnProperty(CREATE_EFFECT_METADATA_KEY)
    )
    .map(propertyName => {
      const metaData = (instance[propertyName] as any)[
        CREATE_EFFECT_METADATA_KEY
      ];
      return {
        propertyName,
        ...metaData,
      };
    });

  return metadata;
}
