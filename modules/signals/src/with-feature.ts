import {
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';

type StoreForFactory<Input extends SignalStoreFeatureResult> = StateSignals<
  Input['state']
> &
  Input['props'] &
  Input['methods'];

/**
 * Allows passing properties, methods, or signals from a SignalStore
 * to a feature.
 *
 * **Example:**
 *
 * ```typescript
 * signalStore(
 *   withMethods((store) => ({
 *     load(id: number): Observable<Entity> {
 *       return of({ id, name: 'John' });
 *     },
 *   })),
 *   withFeature(
 *     // 👇 has full access to the store
 *     (store) => withEntityLoader((id) => firstValueFrom(store.load(id)))
 *   )
 * );
 * ```
 *
 * **Explanation:**
 *
 * Typically, a `signalStoreFeature` can have input constraints like:
 *
 * ```typescript
 * function withLoader() {
 *   return signalStoreFeature(
 *     type<{
 *       methods: { load: (id: number) => Promise<Entity> };
 *     }>()
 *     // ...
 *   );
 * }
 * ```
 *
 * It is not possible for every store to fulfill these constraints.
 * For example, a required method already might already with a different
 * signature and can't be replaced.
 *
 * `withFeature` allows replacing the hard input constraint with
 * a parameter that can be provided at the call site.
 *
 *
 * ```typescript
 * function withLoader(load: (id: number) => Promise<Entity>) {
 *   return signalStoreFeature(
 *     // ...
 *   );
 * }
 *
 * signalStore(
 *   withMethods((store) => ({
 *     // returns Observable instead Promise,
 *     // can't be changed.  👇
 *     load(id: number): Obsevable<Entity> {
 *       // some dummy implementation
 *     },
 *   })),
 *   withFeature((store) =>
 *     // provides the Promise-version without exposing
 *     // it to the Store 👇
 *     withEntityLoader((id) => firstValueFrom(store.load(id)))
 *   )
 * );
 * ```
 *
 * @param featureFactory function returning the actual feature
 */
export function withFeature<
  Input extends SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult
>(
  featureFactory: (
    store: StoreForFactory<Input>
  ) => SignalStoreFeature<Input, Output>
): SignalStoreFeature<Input, Output> {
  return (store) => {
    const storeForFactory = {
      ...store['stateSignals'],
      ...store['props'],
      ...store['methods'],
    } as StoreForFactory<Input>;

    return featureFactory(storeForFactory)(store);
  };
}
