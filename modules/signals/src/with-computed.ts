import { excludeKeys } from './helpers';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  SignalStoreSlices,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

export function withComputed<
  Input extends SignalStoreFeatureResult,
  Signals extends SignalsDictionary
>(
  signalsFactory: (
    store: Prettify<SignalStoreSlices<Input['state']> & Input['signals']>
  ) => Signals
): SignalStoreFeature<Input, EmptyFeatureResult & { signals: Signals }> {
  return (store) => {
    const signals = signalsFactory({ ...store.slices, ...store.signals });
    const signalsKeys = Object.keys(signals);
    const slices = excludeKeys(store.slices, signalsKeys);
    const methods = excludeKeys(store.methods, signalsKeys);

    return {
      ...store,
      slices,
      signals: { ...store.signals, ...signals },
      methods,
    } as InnerSignalStore<Record<string, unknown>, Signals>;
  };
}
