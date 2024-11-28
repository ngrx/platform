import {
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';
import { withProps } from './with-props';

export function withComputed<
  Input extends SignalStoreFeatureResult,
  ComputedSignals extends SignalsDictionary
>(
  signalsFactory: (
    store: Prettify<StateSignals<Input['state']> & Input['props']>
  ) => ComputedSignals
): SignalStoreFeature<
  Input,
  { state: {}; props: ComputedSignals; methods: {} }
> {
  return withProps(signalsFactory);
}
