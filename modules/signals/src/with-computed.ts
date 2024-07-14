import { assertUniqueStoreMembers } from './signal-store-assertions';
import {
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
  { state: {}; computed: ComputedSignals; methods: {} }
> {
  return (store) => {
    const computedSignals = signalsFactory({
      ...store.stateSignals,
      ...store.computedSignals,
    });
    assertUniqueStoreMembers(store, Object.keys(computedSignals));

    return {
      ...store,
      computedSignals: { ...store.computedSignals, ...computedSignals },
    } as InnerSignalStore<Record<string, unknown>, ComputedSignals>;
  };
}
