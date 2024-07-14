import { STATE_SOURCE, StateSource } from './state-source';
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
      Input['computed'] &
      Input['methods'] &
      StateSource<Prettify<Input['state']>>
  >
) => void;

type HooksFactory<Input extends SignalStoreFeatureResult> = (
  store: Prettify<
    StateSignals<Input['state']> &
      Input['computed'] &
      Input['methods'] &
      StateSource<Prettify<Input['state']>>
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
      ...store.computedSignals,
      ...store.methods,
    };
    const hooks =
      typeof hooksOrFactory === 'function'
        ? hooksOrFactory(storeMembers)
        : hooksOrFactory;
    const createHook = (name: keyof typeof hooks) => {
      const hook = hooks[name];
      const currentHook = store.hooks[name];

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
        onInit: createHook('onInit'),
        onDestroy: createHook('onDestroy'),
      },
    };
  };
}
