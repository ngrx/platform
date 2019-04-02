import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { EffectMetadata } from './models';

const CREATE_EFFECT_METADATA_KEY = '__@ngrx/effects_create__';

export function createEffect<T extends Action>(
  source: (() => Observable<T>),
  options: { dispatch: false }
): Observable<T>;
export function createEffect<T extends Action>(
  source: (() => (...args: any[]) => Observable<T>),
  options: { dispatch: false }
): ((...args: any[]) => Observable<T>);
export function createEffect<T extends Action>(
  source: (() => Observable<T>),
  options?: { dispatch: true }
): Observable<T>;
export function createEffect<T extends Action>(
  source: (() => (...args: any[]) => Observable<T>),
  options?: { dispatch: true }
): ((...args: any[]) => Observable<T>);
export function createEffect<T extends Action>(
  source: (() => Observable<T>) | (() => (...args: any[]) => Observable<T>),
  { dispatch = true } = {}
): Observable<T> | ((...args: any[]) => Observable<T>) {
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
