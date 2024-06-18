import { excludeKeys } from './helpers';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

export function withComputed<
  Input extends SignalStoreFeatureResult,
  ComputedSignals extends SignalsDictionary
>(
  signalsFactory: (
    store: Prettify<StateSignals<Input['state']> & Input['computed']>
  ) => ComputedSignals
): SignalStoreFeature<
  Input,
  EmptyFeatureResult & { computed: ComputedSignals }
> {
  return (store) => {
    const computedSignals = signalsFactory({
      ...store.stateSignals,
      ...store.computedSignals,
    });
    const computedSignalsKeys = Object.keys(computedSignals);
    const stateSignals = excludeKeys(store.stateSignals, computedSignalsKeys);
    const methods = excludeKeys(store.methods, computedSignalsKeys);

    return {
      ...store,
      stateSignals,
      computedSignals: { ...store.computedSignals, ...computedSignals },
      methods,
    } as InnerSignalStore<Record<string, unknown>, ComputedSignals>;
  };
}
