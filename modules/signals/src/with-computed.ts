import { computed, isSignal, Signal } from '@angular/core';
import {
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';
import { withProps } from './with-props';

type ComputedResult<
  ComputedInput extends Record<
    string | symbol,
    Signal<unknown> | (() => unknown)
  >
> = {
  [P in keyof ComputedSignals]: ComputedSignals[P] extends () => infer V
    ? Signal<V>
    : ComputedSignals[P];
};

export function withComputed<
  Input extends SignalStoreFeatureResult,
  ComputedDictionary extends Record<
    string | symbol,
    Signal<unknown> | (() => unknown)
  >
>(
  computedFactory: (
    store: Prettify<StateSignals<Input['state']> & Input['props']>
  ) => ComputedSignals
): SignalStoreFeature<
  Input,
  { state: {}; props: ComputedResult<ComputedSignals>; methods: {} }
> {
  return withProps((store) => {
    const computedResult = computedFactory(store);
    const stateKeys = Reflect.ownKeys(signals);

    return computedResultKeys.reduce((prev, key) => {
      const signalOrComputation = computationResult[key];
      return {
        ...prev,
        [key]: isSignal(signalOrComputation)
          ? signalOrComputation
          : computed(signalOrComputation),
      };
    }, {} as ComputedResult<ComputedDictionary>);
  });
}
