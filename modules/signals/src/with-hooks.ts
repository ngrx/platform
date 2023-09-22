import { STATE_SIGNAL, SignalStateMeta } from './signal-state';
import {
  EmptyFeatureResult,
  Prettify,
  SignalStoreFeature,
  SignalStoreSlices,
  SignalStoreFeatureResult,
} from './signal-store-models';

type HooksFactory<Input extends SignalStoreFeatureResult> = (
  store: Prettify<
    SignalStoreSlices<Input['state']> &
      Input['signals'] &
      Input['methods'] &
      SignalStateMeta<Prettify<Input['state']>>
  >
) => void;

export function withHooks<Input extends SignalStoreFeatureResult>(hooks: {
  onInit?: HooksFactory<Input>;
  onDestroy?: HooksFactory<Input>;
}): SignalStoreFeature<Input, EmptyFeatureResult> {
  return (store) => {
    const createHook = (name: keyof typeof hooks) => {
      const hook = hooks[name];
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
