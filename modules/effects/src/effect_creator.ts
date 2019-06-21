import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { EffectMetadata, EffectConfig } from './models';

const CREATE_EFFECT_METADATA_KEY = '__@ngrx/effects_create__';

type DispatchType<T> = T extends { dispatch: infer U } ? U : unknown;
export function createEffect<
  C extends EffectConfig,
  T extends DispatchType<C>,
  O extends T extends false ? Observable<unknown> : Observable<Action>,
  R extends O | ((...args: any[]) => O)
>(source: () => R, config?: Partial<C>): R {
  const effect = source();
  // Right now both createEffect and @Effect decorator set default values.
  // Ideally that should only be done in one place that aggregates that info,
  // for example in mergeEffects().
  const value: EffectConfig = {
    dispatch: true,
    resubscribeOnError: true,
    ...config, // Overrides any defaults if values are provided
  };
  Object.defineProperty(effect, CREATE_EFFECT_METADATA_KEY, {
    value,
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
