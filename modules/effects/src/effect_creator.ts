import { Observable } from 'rxjs';
import { Action, ActionCreator } from '@ngrx/store';
import {
  EffectMetadata,
  EffectConfig,
  DEFAULT_EFFECT_CONFIG,
  CreateEffectMetadata,
  CREATE_EFFECT_METADATA_KEY,
} from './models';

type DispatchType<T> = T extends { dispatch: infer U } ? U : true;
type ObservableType<T, OriginalType> = T extends false ? OriginalType : Action;
type EffectResult<OT> = Observable<OT> | ((...args: any[]) => Observable<OT>);
type ConditionallyDisallowActionCreator<DT, Result> = DT extends false
  ? unknown // If DT (DispatchType is false, then we don't enforce any return types)
  : Result extends EffectResult<infer OT>
  ? OT extends ActionCreator
    ? 'ActionCreator cannot be dispatched. Did you forget to call the action creator function?'
    : unknown
  : unknown;

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
  R extends EffectResult<OT>
>(
  source: () => R & ConditionallyDisallowActionCreator<DT, R>,
  config?: Partial<C>
): R & CreateEffectMetadata {
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
    .filter((propertyName) => {
      if (
        instance[propertyName] &&
        instance[propertyName].hasOwnProperty(CREATE_EFFECT_METADATA_KEY)
      ) {
        // If the property type has overridden `hasOwnProperty` we need to ensure
        // that the metadata is valid (containing a `dispatch`property)
        // https://github.com/ngrx/platform/issues/2975
        const property = instance[propertyName] as any;
        return property[CREATE_EFFECT_METADATA_KEY].hasOwnProperty('dispatch');
      }
      return false;
    })
    .map((propertyName) => {
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
