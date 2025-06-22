import { computed, isSignal, Signal } from '@angular/core';
import {
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';
import { withProps } from './with-props';

type ComputedResult<
  ComputedDictionary extends Record<
    string | symbol,
    Signal<unknown> | (() => unknown)
  >
> = {
  [P in keyof ComputedDictionary]: ComputedDictionary[P] extends Signal<unknown>
    ? ComputedDictionary[P]
    : ComputedDictionary[P] extends () => infer V
    ? Signal<V>
    : never;
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
  ) => ComputedDictionary
): SignalStoreFeature<
  Input,
  { state: {}; props: ComputedResult<ComputedDictionary>; methods: {} }
> {
  return withProps((store) => {
    const computedResult = computedFactory(store);
    const computedResultKeys = Reflect.ownKeys(computedResult);

    return computedResultKeys.reduce((prev, key) => {
      const signalOrComputation = computedResult[key];
      return {
        ...prev,
        [key]: isSignal(signalOrComputation)
          ? signalOrComputation
          : computed(signalOrComputation),
      };
    }, {} as ComputedResult<ComputedDictionary>);
  });
}
