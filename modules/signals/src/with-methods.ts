import { STATE_SOURCE, WritableStateSource } from './state-source';
import { assertUniqueStoreMembers } from './signal-store-assertions';
import {
  InnerSignalStore,
  MethodsDictionary,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

/**
 * @description
 *
 * Adds methods to a SignalStore.
 *
 * @usageNotes
 *
 * ```ts
 * import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
 *
 * export const CounterStore = signalStore(
 *   withState({ count: 0 }),
 *   withMethods((store) => ({
 *     increment(): void {
 *       patchState(store, ({ count }) => ({ count: count + 1 }));
 *     },
 *     decrement(): void {
 *       patchState(store, ({ count }) => ({ count: count - 1 }));
 *     },
 *   }))
 * );
 * ```
 */
export function withMethods<
  Input extends SignalStoreFeatureResult,
  Methods extends MethodsDictionary,
>(
  methodsFactory: (
    store: Prettify<
      StateSignals<Input['state']> &
        Input['props'] &
        Input['methods'] &
        WritableStateSource<Input['state']>
    >
  ) => Methods
): SignalStoreFeature<Input, { state: {}; props: {}; methods: Methods }> {
  return (store) => {
    const methods = methodsFactory({
      [STATE_SOURCE]: store[STATE_SOURCE],
      ...store.stateSignals,
      ...store.props,
      ...store.methods,
    });
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      assertUniqueStoreMembers(store, Reflect.ownKeys(methods));
    }

    return {
      ...store,
      methods: { ...store.methods, ...methods },
    } as InnerSignalStore<Record<string, unknown>, SignalsDictionary, Methods>;
  };
}
