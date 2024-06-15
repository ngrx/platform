import { Signal } from '@angular/core';
import { DeepSignal } from './deep-signal';
import { StateSignal } from './state-signal';
import { IsKnownRecord, Prettify } from './ts-helpers';

export type SignalStoreConfig = { providedIn: 'root' };

export type StateSignals<State> = IsKnownRecord<Prettify<State>> extends true
  ? {
      [Key in keyof State]: IsKnownRecord<State[Key]> extends true
        ? DeepSignal<State[Key]>
        : Signal<State[Key]>;
    }
  : {};

export type SignalStoreProps<FeatureResult extends SignalStoreFeatureResult> =
  Prettify<
    StateSignals<FeatureResult['state']> &
      FeatureResult['computed'] &
      FeatureResult['methods']
  >;

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
} & StateSignal<State>;

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

export type MergeFeatureResults<
  FeatureResults extends SignalStoreFeatureResult[]
> = FeatureResults extends []
  ? EmptyFeatureResult
  : FeatureResults extends [infer First extends SignalStoreFeatureResult]
  ? First
  : FeatureResults extends [
      infer First extends SignalStoreFeatureResult,
      infer Second extends SignalStoreFeatureResult
    ]
  ? MergeTwoFeatureResults<First, Second>
  : FeatureResults extends [
      infer First extends SignalStoreFeatureResult,
      infer Second extends SignalStoreFeatureResult,
      ...infer Rest extends SignalStoreFeatureResult[]
    ]
  ? MergeFeatureResults<[MergeTwoFeatureResults<First, Second>, ...Rest]>
  : never;

type FeatureResultKeys<FeatureResult extends SignalStoreFeatureResult> =
  | keyof FeatureResult['state']
  | keyof FeatureResult['computed']
  | keyof FeatureResult['methods'];

type MergeTwoFeatureResults<
  First extends SignalStoreFeatureResult,
  Second extends SignalStoreFeatureResult
> = {
  state: Omit<First['state'], FeatureResultKeys<Second>>;
  computed: Omit<First['computed'], FeatureResultKeys<Second>>;
  methods: Omit<First['methods'], FeatureResultKeys<Second>>;
} & Second;
