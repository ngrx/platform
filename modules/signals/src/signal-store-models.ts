import { Signal } from '@angular/core';
import { DeepSignal } from './deep-signal';
import { WritableStateSource } from './state-source';
import { IsKnownRecord, Prettify } from './ts-helpers';

/**
 * A type that maps state properties to their corresponding signal types.
 *
 * @public
 */
export type StateSignals<State> = IsKnownRecord<Prettify<State>> extends true
  ? {
      [Key in keyof State]: IsKnownRecord<State[Key]> extends true
        ? DeepSignal<State[Key]>
        : Signal<State[Key]>;
    }
  : {};

/**
 * A dictionary of signals with string or symbol keys.
 *
 * @public
 */
export type SignalsDictionary = Record<string | symbol, Signal<unknown>>;

/**
 * A dictionary of methods with string keys.
 *
 * @public
 */
export type MethodsDictionary = Record<string, Function>;

/**
 * Hooks that can be attached to a signal store.
 *
 * @public
 */
export type SignalStoreHooks = {
  onInit?: () => void;
  onDestroy?: () => void;
};

/**
 * The internal representation of a signal store.
 *
 * @public
 */
export type InnerSignalStore<
  State extends object = object,
  Props extends object = object,
  Methods extends MethodsDictionary = MethodsDictionary
> = {
  stateSignals: StateSignals<State>;
  props: Props;
  methods: Methods;
  hooks: SignalStoreHooks;
} & WritableStateSource<State>;

/**
 * The result type for signal store features.
 *
 * @public
 */
export type SignalStoreFeatureResult = {
  state: object;
  props: object;
  methods: MethodsDictionary;
};

/**
 * An empty feature result with no state, props, or methods.
 *
 * @public
 */
export type EmptyFeatureResult = { state: {}; props: {}; methods: {} };

/**
 * A function that transforms one signal store into another.
 *
 * @public
 */
export type SignalStoreFeature<
  Input extends SignalStoreFeatureResult = SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult = SignalStoreFeatureResult
> = (
  store: InnerSignalStore<Input['state'], Input['props'], Input['methods']>
) => InnerSignalStore<Output['state'], Output['props'], Output['methods']>;
