import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, effect, inject } from '@angular/core';
import {
  SignalStoreFeature,
  getState,
  patchState,
  signalStoreFeature,
  withHooks,
  withMethods,
} from '@ngrx/signals';

type SignalStoreFeatureInput<State> = Pick<
  Parameters<SignalStoreFeature>[0],
  'signals' | 'methods'
> & {
  state: State;
};

type SyncConfig<State> = {
  /**
   * The key which is used to access the storage.
   */
  key: string;
  /**
   * Flag indicating if the store should read from storage on init and write to storage on every state change.
   *
   * `true` by default
   */
  autoSync?: boolean;
  /**
   * Function to select that portion of the state which should be stored.
   *
   * Returns the whole state object by default
   */
  select?: (state: State) => Partial<State>;
  /**
   * Function used to parse the state coming from storage.
   *
   * `JSON.parse()` by default
   */
  parse?: (stateString: string) => State;
  /**
   * Function used to tranform the state into a string representation.
   *
   * `JSON.stringify()` by default
   */
  stringify?: (state: State) => string;
  /**
   * Factory function used to select the storage.
   *
   * `localstorage` by default
   */
  storage?: () => Storage;
};

/**
 * Enables store synchronization with storage.
 *
 * Only works on browser platform.
 */
export function withStorageSync<
  State extends object,
  Input extends SignalStoreFeatureInput<State>
>(
  key: string
): SignalStoreFeature<
  Input,
  {
    state: {};
    signals: {};
    methods: {
      clearStorage(): void;
      readFromStorage(): void;
      writeToStorage(): void;
    };
  }
>;
export function withStorageSync<
  State extends object,
  Input extends SignalStoreFeatureInput<State>
>(
  config: SyncConfig<Input['state']>
): SignalStoreFeature<
  Input,
  {
    state: {};
    signals: {};
    methods: {
      clearStorage(): void;
      readFromStorage(): void;
      writeToStorage(): void;
    };
  }
>;
export function withStorageSync<
  State extends object,
  Input extends SignalStoreFeatureInput<State>
>(
  configOrKey: SyncConfig<Input['state']> | string
): SignalStoreFeature<
  Input,
  {
    state: {};
    signals: {};
    methods: {
      clearStorage(): void;
      readFromStorage(): void;
      writeToStorage(): void;
    };
  }
> {
  const {
    key,
    autoSync = true,
    select = (state: State) => state,
    parse = JSON.parse,
    stringify = JSON.stringify,
    storage: storageFactory = () => localStorage,
  } = typeof configOrKey === 'string' ? { key: configOrKey } : configOrKey;

  return signalStoreFeature(
    withMethods((store) => {
      const storage = storageFactory();

      return {
        /**
         * Removes the item stored in storage.
         */
        clearStorage(): void {
          storage.removeItem(key);
        },
        /**
         * Reads item from storage and patches the state.
         */
        readFromStorage(): void {
          const stateString = storage.getItem(key);
          if (stateString) {
            patchState(store, parse(stateString));
          }
        },
        /**
         * Writes selected portion to storage.
         */
        writeToStorage(): void {
          const slicedState = select(getState(store) as State);
          storage.setItem(key, stringify(slicedState));
        },
      };
    }),
    withHooks({
      onInit(store, platformId = inject(PLATFORM_ID)) {
        if (isPlatformServer(platformId)) {
          return;
        }

        if (autoSync) {
          store.readFromStorage();

          effect(() => {
            store.writeToStorage();
          });
        }
      },
    })
  );
}
