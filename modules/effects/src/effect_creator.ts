import { Observable } from 'rxjs';
import { Action, ActionCreator } from '@ngrx/store';
import {
  CREATE_EFFECT_METADATA_KEY,
  CreateEffectMetadata,
  DEFAULT_EFFECT_CONFIG,
  EffectConfig,
  EffectMetadata,
  FunctionalEffect,
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

export function createEffect<
  C extends EffectConfig & { functional?: false },
  DT extends DispatchType<C>,
  OT extends ObservableType<DT, OT>,
  R extends EffectResult<OT>
>(
  source: () => R & ConditionallyDisallowActionCreator<DT, R>,
  config?: C
): R & CreateEffectMetadata;
export function createEffect<Source extends () => Observable<unknown>>(
  source: Source,
  config: EffectConfig & { functional: true; dispatch: false }
): FunctionalEffect<Source>;
export function createEffect<
  Result extends Observable<Action>,
  Source extends () => Result
>(
  source: Source & ConditionallyDisallowActionCreator<true, ReturnType<Source>>,
  config: EffectConfig & { functional: true; dispatch?: true }
): FunctionalEffect<Source>;
/**
 * @description
 *
 * Creates an effect from a source and an `EffectConfig`.
 *
 * @param source A function which returns an observable or observable factory.
 * @param config A `EffectConfig` to configure the effect. By default,
 * `dispatch` is true, `functional` is false, and `useEffectsErrorHandler` is
 * true.
 * @returns If `EffectConfig`#`functional` is true, returns the source function.
 * Else, returns the source function result. When `EffectConfig`#`dispatch` is
 * true, the source function result needs to be `Observable<Action>`.
 *
 * @usageNotes
 *
 * ### Class Effects
 *
 * ```ts
 * @Injectable()
 * export class FeatureEffects {
 *   // mapping to a different action
 *   readonly effect1$ = createEffect(
 *     () => this.actions$.pipe(
 *       ofType(FeatureActions.actionOne),
 *       map(() => FeatureActions.actionTwo())
 *     )
 *   );
 *
 *   // non-dispatching effect
 *   readonly effect2$ = createEffect(
 *     () => this.actions$.pipe(
 *       ofType(FeatureActions.actionTwo),
 *       tap(() => console.log('Action Two Dispatched'))
 *     ),
 *     { dispatch: false } // FeatureActions.actionTwo is not dispatched
 *   );
 *
 *   constructor(private readonly actions$: Actions) {}
 * }
 * ```
 *
 * ### Functional Effects
 *
 * ```ts
 * // mapping to a different action
 * export const loadUsers = createEffect(
 *   (actions$ = inject(Actions), usersService = inject(UsersService)) => {
 *     return actions$.pipe(
 *       ofType(UsersPageActions.opened),
 *       exhaustMap(() => {
 *         return usersService.getAll().pipe(
 *           map((users) => UsersApiActions.usersLoadedSuccess({ users })),
 *           catchError((error) =>
 *             of(UsersApiActions.usersLoadedFailure({ error }))
 *           )
 *         );
 *       })
 *     );
 *   },
 *   { functional: true }
 * );
 *
 * // non-dispatching functional effect
 * export const logDispatchedActions = createEffect(
 *   () => inject(Actions).pipe(tap(console.log)),
 *   { functional: true, dispatch: false }
 * );
 * ```
 */
export function createEffect<
  C extends EffectConfig,
  DT extends DispatchType<C>,
  OT extends ObservableType<DT, OT>,
  R extends EffectResult<OT>,
  S extends () => R
>(source: S, config = {} as C): (S | R) & CreateEffectMetadata {
  const effect = config.functional ? source : source();
  const value: EffectConfig = {
    ...DEFAULT_EFFECT_CONFIG,
    ...config, // Overrides any defaults if values are provided
  };
  Object.defineProperty(effect, CREATE_EFFECT_METADATA_KEY, {
    value,
  });
  return effect as typeof effect & CreateEffectMetadata;
}

export function getCreateEffectMetadata<T extends Record<keyof T, Object>>(
  instance: T
): EffectMetadata<T>[] {
  const propertyNames = Object.getOwnPropertyNames(instance) as Array<keyof T>;

  const metadata: EffectMetadata<T>[] = propertyNames
    .filter((propertyName) => {
      if (
        instance[propertyName] &&
        instance[propertyName].hasOwnProperty(CREATE_EFFECT_METADATA_KEY)
      ) {
        // If the property type has overridden `hasOwnProperty` we need to ensure
        // that the metadata is valid (containing a `dispatch` property)
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
