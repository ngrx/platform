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
 * Adds properties to a signal store.
 *
 * @param propsFactory - A factory function that creates properties for the store.
 * @returns A signal store feature that adds the properties.
 *
 * @public
 */
export function withProps<
  Input extends SignalStoreFeatureResult,
  Props extends object
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
    assertUniqueStoreMembers(store, Reflect.ownKeys(props));

    return {
      ...store,
      props: { ...store.props, ...props },
    } as InnerSignalStore<object, Props>;
  };
}
