import { STATE_SIGNAL, StateSignal } from './state-signal';
import {
  EmptyFeatureResult,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  SignalStoreSlices,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

type HooksFactory<Input extends SignalStoreFeatureResult> = (
  store: Prettify<
    SignalStoreSlices<Input['state']> &
      Input['signals'] &
      Input['methods'] &
      StateSignal<Prettify<Input['state']>>
  >
) => void;

type HooksSupplier<Input extends SignalStoreFeatureResult> = () => {
  onInit?: HooksFactory<Input>;
  onDestroy?: HooksFactory<Input>;
};

export function withHooks<Input extends SignalStoreFeatureResult>(
  hooks:
    | {
        onInit?: HooksFactory<Input>;
        onDestroy?: HooksFactory<Input>;
      }
    | HooksSupplier<Input>
): SignalStoreFeature<Input, EmptyFeatureResult> {
  return (store) => {
    const _hooks = typeof hooks === 'function' ? hooks() : hooks;

    const createHook = (name: keyof typeof _hooks) => {
      const hook = _hooks[name];
      const currentHook = store.hooks[name];

      return hook
        ? () => {
            if (currentHook) {
              currentHook();
            }

            hook({
              [STATE_SIGNAL]: store[STATE_SIGNAL],
              ...store.slices,
              ...store.signals,
              ...store.methods,
            });
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
