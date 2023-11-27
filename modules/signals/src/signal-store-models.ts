import { Signal } from '@angular/core';
import { DeepSignal } from './deep-signal';
import { StateSignal } from './state-signal';
import { IsKnownRecord, Prettify } from './ts-helpers';

export type SignalStoreConfig = { providedIn: 'root' };

export type SignalStoreSlices<State> = IsKnownRecord<
  Prettify<State>
> extends true
  ? {
      [Key in keyof State]: IsKnownRecord<State[Key]> extends true
        ? DeepSignal<State[Key]>
        : Signal<State[Key]>;
    }
  : {};

export type SignalStoreProps<FeatureResult extends SignalStoreFeatureResult> =
  Prettify<
    SignalStoreSlices<FeatureResult['state']> &
      FeatureResult['signals'] &
      FeatureResult['methods']
  >;

export type SignalsDictionary = Record<string, Signal<unknown>>;

export type MethodsDictionary = Record<string, (...args: any[]) => unknown>;

export type SignalStoreHooks = {
  onInit?: () => void;
  onDestroy?: () => void;
};

export type InnerSignalStore<
  State extends object = object,
  Signals extends SignalsDictionary = SignalsDictionary,
  Methods extends MethodsDictionary = MethodsDictionary
> = {
  slices: SignalStoreSlices<State>;
  signals: Signals;
  methods: Methods;
  hooks: SignalStoreHooks;
} & StateSignal<State>;

export type SignalStoreFeatureResult = {
  state: object;
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
