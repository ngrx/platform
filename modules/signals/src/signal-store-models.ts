import { Signal } from '@angular/core';
import { DeepSignal } from './deep-signal';
import { WritableStateSource } from './state-source';
import { IsKnownRecord, Prettify } from './ts-helpers';

export type StateSignals<State> = IsKnownRecord<Prettify<State>> extends true
  ? {
      [Key in keyof State]: IsKnownRecord<State[Key]> extends true
        ? DeepSignal<State[Key]>
        : Signal<State[Key]>;
    }
  : {};

export type SignalsDictionary = Record<string, Signal<unknown>>;

export type MethodsDictionary = Record<string, Function>;

export type SignalStoreHooks = {
  onInit?: () => void;
  onDestroy?: () => void;
};

export type InnerSignalStore<
  State extends object = object,
  ComputedSignals extends SignalsDictionary = SignalsDictionary,
  Methods extends MethodsDictionary = MethodsDictionary
> = {
  stateSignals: StateSignals<State>;
  computedSignals: ComputedSignals;
  methods: Methods;
  hooks: SignalStoreHooks;
} & WritableStateSource<State>;

export type SignalStoreFeatureResult = {
  state: object;
  computed: SignalsDictionary;
  methods: MethodsDictionary;
};

export type EmptyFeatureResult = { state: {}; computed: {}; methods: {} };

export type SignalStoreFeature<
  Input extends SignalStoreFeatureResult = SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult = SignalStoreFeatureResult
> = (
  store: InnerSignalStore<Input['state'], Input['computed'], Input['methods']>
) => InnerSignalStore<Output['state'], Output['computed'], Output['methods']>;
