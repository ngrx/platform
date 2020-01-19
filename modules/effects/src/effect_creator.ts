import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  EffectMetadata,
  EffectConfig,
  DEFAULT_EFFECT_CONFIG,
  CreateEffectMetadata,
  CREATE_EFFECT_METADATA_KEY,
} from './models';

type DispatchType<T> = T extends { dispatch: infer U } ? U : true;
type ObservableType<T, OriginalType> = T extends false ? OriginalType : Action;
/**
 * @description
 * Creates an effect from an `Observable` and an `EffectConfig`.
 *
 * @param source A function which returns an `Observable`.
 * @param config A `Partial<EffectConfig>` to configure the effect.  By default, `dispatch` is true and `useEffectsErrorHandler` is true.
 * @returns If `EffectConfig`#`dispatch` is true, returns `Observable<Action>`.  Else, returns `Observable<unknown>`.
 *
 * @usageNotes
 *
 * ** Mapping to a different action **
 * ```ts
 * effectName$ = createEffect(
 *   () => this.actions$.pipe(
 *     ofType(FeatureActions.actionOne),
 *     map(() => FeatureActions.actionTwo())
 *   )
 * );
 * ```
 *
 *  ** Non-dispatching effects **
 * ```ts
 * effectName$ = createEffect(
 *   () => this.actions$.pipe(
 *     ofType(FeatureActions.actionOne),
 *     tap(() => console.log('Action One Dispatched'))
 *   ),
 *   { dispatch: false }
 *   // FeatureActions.actionOne is not dispatched
 * );
 * ```
 */
export function createEffect<
  C extends EffectConfig,
  DT extends DispatchType<C>,
  OT extends ObservableType<DT, OT>,
  R extends Observable<OT> | ((...args: any[]) => Observable<OT>)
>(source: () => R, config?: Partial<C>): R & CreateEffectMetadata {
  const effect = source();
  const value: EffectConfig = {
    ...DEFAULT_EFFECT_CONFIG,
    ...config, // Overrides any defaults if values are provided
  };
  Object.defineProperty(effect, CREATE_EFFECT_METADATA_KEY, {
    value,
  });
  return effect as typeof effect & CreateEffectMetadata;
}

export function getCreateEffectMetadata<
  T extends { [props in keyof T]: Object }
>(instance: T): EffectMetadata<T>[] {
  const propertyNames = Object.getOwnPropertyNames(instance) as Array<keyof T>;

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
