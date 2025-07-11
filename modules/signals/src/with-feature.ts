import {
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { STATE_SOURCE, WritableStateSource } from './state-source';
import { Prettify } from './ts-helpers';

/**
 * @description
 * Allows passing properties, methods, or signals from a SignalStore
 * to a feature.
 *
 * @usageNotes
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
 * @param featureFactory function returning the actual feature
 */
export function withFeature<
  Input extends SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult
>(
  featureFactory: (
    store: Prettify<
      StateSignals<Input['state']> &
        Input['props'] &
        Input['methods'] &
        WritableStateSource<Input['state']>
    >
  ) => SignalStoreFeature<Input, Output>
): SignalStoreFeature<Input, Output> {
  return (store) => {
    const storeForFactory = {
      [STATE_SOURCE]: store[STATE_SOURCE],
      ...store['stateSignals'],
      ...store['props'],
      ...store['methods'],
    };

    return featureFactory(storeForFactory)(store);
  };
}
