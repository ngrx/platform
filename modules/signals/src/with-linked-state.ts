import { linkedSignal, WritableSignal } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { assertUniqueStoreMembers } from './signal-store-assertions';
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
  >,
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
 * Accepts a factory function that returns a dictionary of linked signals or
 * computation functions.
 *
 * @usageNotes
 *
 * ### Using a computation function
 *
 * ```ts
 * import { signalStore, withLinkedState, withState } from '@ngrx/signals';
 *
 * export const OptionsStore = signalStore(
 *   withState({ options: [1, 2, 3] }),
 *   withLinkedState(({ options }) => ({
 *     selectedOption: () => options()[0],
 *   }))
 * );
 * ```
 *
 * ### Using linkedSignal for advanced use cases
 *
 * ```ts
 * import { linkedSignal } from '@angular/core';
 * import { signalStore, withLinkedState, withState } from '@ngrx/signals';
 *
 * type Option = { id: number; label: string };
 *
 * export const OptionsStore = signalStore(
 *   withState({ options: [] as Option[] }),
 *   withLinkedState(({ options }) => ({
 *     selectedOption: linkedSignal<Option[], Option>({
 *       source: options,
 *       computation: (newOptions, previous) => {
 *         const option = newOptions.find((o) => o.id === previous?.value.id);
 *         return option ?? newOptions[0];
 *       },
 *     }),
 *   }))
 * )
 * ```
 */
export function withLinkedState<
  State extends Record<
    string | symbol,
    WritableSignal<unknown> | (() => unknown)
  >,
  Input extends SignalStoreFeatureResult,
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
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      assertUniqueStoreMembers(store, stateKeys);
    }
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
