import { linkedSignal, WritableSignal } from '@angular/core';

import { toDeepSignal } from './deep-signal';
import {
  EmptyFeatureResult,
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
 *
 * @description
 * Generates and adds the properties of a `linkedSignal`
 * to the store's state.
 *
 * @usageNotes
 * ```typescript
 * const UserStore = signalStore(
 *   withState({ options: [1, 2, 3] }),
 *   withLinkedState(({ options }) => ({ selectOption: () => options()[0] ?? undefined }))
 * );
 * ```
 *
 * The resulting state is of type `{ options: number[], selectOption: number | undefined }`.
 * Whenever the `options` signal changes, the `selectOption` will automatically update.
 *
 * For advanced use cases, `linkedSignal` can be called within `withLinkedState`:
 *
 * ```typescript
 * const UserStore = signalStore(
 *   withState({ id: 1 }),
 *   withLinkedState(({ id }) => ({
 *     user: linkedSignal({
 *       source: id,
 *       computation: () => ({ firstname: '', lastname: '' })
 *     })
 *   }))
 * )
 * ```
 *
 * @param linkedStateFactory A function that returns a an object literal with properties container an actual `linkedSignal` or the computation function.
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
  EmptyFeatureResult & {
    state: LinkedStateResult<State>;
  }
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
      const signalOrFunction = linkedState[key];
      stateSource[key] = isWritableSignal(signalOrFunction)
        ? signalOrFunction
        : linkedSignal(signalOrFunction);
      stateSignals[key] = toDeepSignal(stateSource[key]);
    }

    return {
      ...store,
      stateSignals: { ...store.stateSignals, ...stateSignals },
    } as InnerSignalStore<LinkedStateResult<State>>;
  };
}
