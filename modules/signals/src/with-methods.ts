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

export function withMethods<
  Input extends SignalStoreFeatureResult,
  Methods extends MethodsDictionary
>(
  methodsFactory: (
    store: Prettify<
      StateSignals<Input['state']> &
        Input['computed'] &
        Input['methods'] &
        WritableStateSource<Prettify<Input['state']>>
    >
  ) => Methods
): SignalStoreFeature<Input, { state: {}; computed: {}; methods: Methods }> {
  return (store) => {
    const methods = methodsFactory({
      [STATE_SOURCE]: store[STATE_SOURCE],
      ...store.stateSignals,
      ...store.computedSignals,
      ...store.methods,
    });
    assertUniqueStoreMembers(store, Object.keys(methods));

    return {
      ...store,
      methods: { ...store.methods, ...methods },
    } as InnerSignalStore<Record<string, unknown>, SignalsDictionary, Methods>;
  };
}
