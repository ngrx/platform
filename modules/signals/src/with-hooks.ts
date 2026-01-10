import { STATE_SOURCE, WritableStateSource } from './state-source';
import {
  EmptyFeatureResult,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

type HookFn<Input extends SignalStoreFeatureResult> = (
  store: Prettify<
    StateSignals<Input['state']> &
      Input['props'] &
      Input['methods'] &
      WritableStateSource<Input['state']>
  >
) => void;

type HooksFactory<Input extends SignalStoreFeatureResult> = (
  store: Prettify<
    StateSignals<Input['state']> &
      Input['props'] &
      Input['methods'] &
      WritableStateSource<Input['state']>
  >
) => {
  onInit?: () => void;
  onDestroy?: () => void;
};

export function withHooks<Input extends SignalStoreFeatureResult>(hooks: {
  onInit?: HookFn<Input>;
  onDestroy?: HookFn<Input>;
}): SignalStoreFeature<Input, EmptyFeatureResult>;
export function withHooks<Input extends SignalStoreFeatureResult>(
  hooks: HooksFactory<Input>
): SignalStoreFeature<Input, EmptyFeatureResult>;
/**
 * @description
 *
 * Adds lifecycle hooks to a SignalStore.
 * Supports onInit and onDestroy hooks that execute when the store is
 * initialized and destroyed.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, withHooks, withState } from '@ngrx/signals';
 *
 * export const UserStore = signalStore(
 *   withState({ firstName: 'Jimi', lastName: 'Hendrix' }),
 *   withHooks({
 *     onInit({ firstName }) {
 *       console.log('first name on init', firstName());
 *     },
 *     onDestroy({ lastName }) {
 *       console.log('last name on destroy', lastName());
 *     },
 *   })
 * );
 * ```
 */
export function withHooks<Input extends SignalStoreFeatureResult>(
  hooksOrFactory:
    | {
        onInit?: HookFn<Input>;
        onDestroy?: HookFn<Input>;
      }
    | HooksFactory<Input>
): SignalStoreFeature<Input, EmptyFeatureResult> {
  return (store) => {
    const storeMembers = {
      [STATE_SOURCE]: store[STATE_SOURCE],
      ...store.stateSignals,
      ...store.props,
      ...store.methods,
    };
    const hooks =
      typeof hooksOrFactory === 'function'
        ? hooksOrFactory(storeMembers)
        : hooksOrFactory;
    const mergeHooks = (currentHook?: () => void, hook?: HookFn<Input>) => {
      return hook
        ? () => {
            if (currentHook) {
              currentHook();
            }

            hook(storeMembers);
          }
        : currentHook;
    };

    return {
      ...store,
      hooks: {
        onInit: mergeHooks(store.hooks.onInit, hooks.onInit),
        onDestroy: mergeHooks(store.hooks.onDestroy, hooks.onDestroy),
      },
    };
  };
}
