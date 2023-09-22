import { Signal } from '@angular/core';
import { DeepSignal } from './deep-signal';
import { SignalStateMeta } from './signal-state';

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type SignalStoreConfig = { providedIn: 'root' };

export type SignalStoreSlices<State> = {
  [Key in keyof State]: DeepSignal<State[Key]>;
};

export type SignalStore<FeatureResult extends SignalStoreFeatureResult> =
  Prettify<
    SignalStoreSlices<FeatureResult['state']> &
      FeatureResult['signals'] &
      FeatureResult['methods'] &
      SignalStateMeta<Prettify<FeatureResult['state']>>
  >;

export type SignalsDictionary = Record<string, Signal<unknown>>;

export type MethodsDictionary = Record<string, (...args: any[]) => unknown>;

export type SignalStoreHooks = {
  onInit?: () => void;
  onDestroy?: () => void;
};

export type InnerSignalStore<
  State extends Record<string, unknown> = Record<string, unknown>,
  Signals extends SignalsDictionary = SignalsDictionary,
  Methods extends MethodsDictionary = MethodsDictionary
> = {
  slices: SignalStoreSlices<State>;
  signals: Signals;
  methods: Methods;
  hooks: SignalStoreHooks;
} & SignalStateMeta<State>;

export type SignalStoreFeatureResult = {
  state: Record<string, unknown>;
  signals: SignalsDictionary;
  methods: MethodsDictionary;
};

export type EmptyFeatureResult = { state: {}; signals: {}; methods: {} };

export type SignalStoreFeature<
  Input extends SignalStoreFeatureResult = SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult = SignalStoreFeatureResult
> = (
  store: InnerSignalStore<Input['state'], Input['signals'], Input['methods']>
) => InnerSignalStore<Output['state'], Output['signals'], Output['methods']>;

export type MergeFeatureResults<
  FeatureResults extends SignalStoreFeatureResult[]
> = FeatureResults extends []
  ? {}
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
  | keyof FeatureResult['signals']
  | keyof FeatureResult['methods'];

type MergeTwoFeatureResults<
  First extends SignalStoreFeatureResult,
  Second extends SignalStoreFeatureResult
> = {
  state: Omit<First['state'], FeatureResultKeys<Second>>;
  signals: Omit<First['signals'], FeatureResultKeys<Second>>;
  methods: Omit<First['methods'], FeatureResultKeys<Second>>;
} & Second;
