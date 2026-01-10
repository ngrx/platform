import { STATE_SOURCE, WritableStateSource } from './state-source';
import { assertUniqueStoreMembers } from './signal-store-assertions';
import {
  InnerSignalStore,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

/**
 * @description
 *
 * Adds custom properties to a SignalStore.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, withProps, withState } from '@ngrx/signals';
 *
 * export const TodosStore = signalStore(
 *   withState({ todos: [] as Todo[], isLoading: false }),
 *   withProps(({ isLoading }) => ({
 *     isLoading$: toObservable(isLoading),
 *   }))
 * );
 * ```
 */
export function withProps<
  Input extends SignalStoreFeatureResult,
  Props extends object,
>(
  propsFactory: (
    store: Prettify<
      StateSignals<Input['state']> &
        Input['props'] &
        Input['methods'] &
        WritableStateSource<Input['state']>
    >
  ) => Props
): SignalStoreFeature<Input, { state: {}; props: Props; methods: {} }> {
  return (store) => {
    const props = propsFactory({
      [STATE_SOURCE]: store[STATE_SOURCE],
      ...store.stateSignals,
      ...store.props,
      ...store.methods,
    });
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      assertUniqueStoreMembers(store, Reflect.ownKeys(props));
    }

    return {
      ...store,
      props: { ...store.props, ...props },
    } as InnerSignalStore<object, Props>;
  };
}
