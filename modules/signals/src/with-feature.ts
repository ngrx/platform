import {
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { STATE_SOURCE, WritableStateSource } from './state-source';
import { Prettify } from './ts-helpers';

/**
 * @description
 *
 * Allows passing state signals, properties, and methods from a SignalStore
 * instance to a custom feature.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, withFeature, withMethods } from '@ngrx/signals';
 *
 * export const UserStore = signalStore(
 *   withMethods((store) => ({
 *     loadById(id: number): Promise<User> {
 *       return Promise.resolve({ id, name: 'John' });
 *     },
 *   })),
 *   withFeature(
 *     // 👇 Has full access to store members.
 *     (store) => withEntityLoader((id) => store.loadById(id))
 *   )
 * );
 * ```
 */
export function withFeature<
  Input extends SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult,
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
      ...store.stateSignals,
      ...store.props,
      ...store.methods,
    };

    return featureFactory(storeForFactory)(store);
  };
}
