import { linkedSignal, WritableSignal } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import {
  InnerSignalStore,
  SignalsDictionary,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { isWritableSignal, STATE_SOURCE } from './state-source';
import { Prettify } from './ts-helpers';

type LinkedStateResult<
  LinkedStateInput extends Record<
    string | symbol,
    WritableSignal<unknown> | (() => unknown)
  >
> = {
  [K in keyof LinkedStateInput]: LinkedStateInput[K] extends WritableSignal<
    infer V
  >
    ? V
    : LinkedStateInput[K] extends () => infer V
    ? V
    : never;
};

/**
 * @description
 *
 * Adds linked state slices to a SignalStore.
 *
 * @usageNotes
 *
 * ```typescript
 * const OptionsStore = signalStore(
 *   withState({ options: [1, 2, 3] }),
 *   withLinkedState(({ options }) => ({
 *     selectedOption: () => options()[0],
 *   }))
 * );
 * ```
 *
 * This returns a state of type `{ options: number[], selectedOption: number | undefined }`.
 * When the `options` signal changes, the `selectedOption` automatically updates.
 *
 * For advanced use cases, `linkedSignal` or any other `WritableSignal` instance can be used within `withLinkedState`:
 *
 * ```typescript
 * type Option = { id: number; label: string };
 *
 * const OptionsStore = signalStore(
 *   withState({ options: [] as Option[] }),
 *   withLinkedState(({ options }) => ({
 *     selectedOption: linkedSignal<Option[], Option>({
 *       source: options,
 *       computation: (newOptions, previous) => {
 *         const option = newOptions.find((o) => o.id === previous?.value.id);
 *         return option ?? newOptions[0];
 *       },
 *     })
 *   }))
 * )
 * ```
 *
 * @param linkedStateFactory A function that returns an object literal with properties containing an actual `linkedSignal` or the computation function.
 */
export function withLinkedState<
  State extends Record<
    string | symbol,
    WritableSignal<unknown> | (() => unknown)
  >,
  Input extends SignalStoreFeatureResult
>(
  linkedStateFactory: (
    store: Prettify<StateSignals<Input['state']> & Input['props']>
  ) => State
): SignalStoreFeature<
  Input,
  { state: LinkedStateResult<State>; props: {}; methods: {} }
> {
  return (store) => {
    const linkedState = linkedStateFactory({
      ...store.stateSignals,
      ...store.props,
    });
    const stateKeys = Reflect.ownKeys(linkedState);
    const stateSource = store[STATE_SOURCE] as SignalsDictionary;
    const stateSignals = {} as SignalsDictionary;

    for (const key of stateKeys) {
      const signalOrComputationFn = linkedState[key];
      stateSource[key] = isWritableSignal(signalOrComputationFn)
        ? signalOrComputationFn
        : linkedSignal(signalOrComputationFn);
      stateSignals[key] = toDeepSignal(stateSource[key]);
    }

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<LinkedStateResult<State>>;
  };
}
