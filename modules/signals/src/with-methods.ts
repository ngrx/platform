import { excludeKeys } from './helpers';
import { STATE_SIGNAL, SignalStateMeta } from './signal-state';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  MethodsDictionary,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  SignalStoreSlices,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

export function withMethods<
  Input extends SignalStoreFeatureResult,
  Methods extends MethodsDictionary
>(
  methodsFactory: (
    store: Prettify<
      SignalStoreSlices<Input['state']> &
        Input['signals'] &
        Input['methods'] &
        SignalStateMeta<Prettify<Input['state']>>
    >
  ) => Methods
): SignalStoreFeature<Input, EmptyFeatureResult & { methods: Methods }> {
  return (store) => {
    const methods = methodsFactory({
      [STATE_SIGNAL]: store[STATE_SIGNAL],
      ...store.slices,
      ...store.signals,
      ...store.methods,
    });
    const methodsKeys = Object.keys(methods);
    const slices = excludeKeys(store.slices, methodsKeys);
    const signals = excludeKeys(store.signals, methodsKeys);

    return {
      ...store,
      slices,
      signals,
      methods: { ...store.methods, ...methods },
    } as InnerSignalStore<Record<string, unknown>, SignalsDictionary, Methods>;
  };
}
