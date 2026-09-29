import { Signal } from '@angular/core';
import { DeepSignalOf } from './deep-signal';
import { WritableStateSource } from './state-source';
import { IsKnownRecord, Prettify } from './ts-helpers';

export type StateSignals<State> =
  IsKnownRecord<Prettify<State>> extends true
    ? {
        [Key in keyof State]: DeepSignalOf<State[Key]>;
      }
    : {};

export type SignalsDictionary = Record<string | symbol, Signal<unknown>>;

export type MethodsDictionary = Record<string, Function>;

export type SignalStoreHooks = {
  onInit?: () => void;
  onDestroy?: () => void;
};

export type InnerSignalStore<
  State extends object = object,
  Props extends object = object,
  Methods extends MethodsDictionary = MethodsDictionary,
> = {
  stateSignals: StateSignals<State>;
  props: Props;
  methods: Methods;
  hooks: SignalStoreHooks;
} & WritableStateSource<State>;

export type SignalStoreFeatureResult = {
  state: object;
  props: object;
  methods: MethodsDictionary;
};

export type EmptyFeatureResult = { state: {}; props: {}; methods: {} };

export type SignalStoreFeature<
  Input extends SignalStoreFeatureResult = SignalStoreFeatureResult,
  Output extends SignalStoreFeatureResult = SignalStoreFeatureResult,
> = (
  store: InnerSignalStore<Input['state'], Input['props'], Input['methods']>
) => InnerSignalStore<Output['state'], Output['props'], Output['methods']>;

/**
 * @description
 *
 * Extracts the state and members from a feature factory, allowing
 * them to be reused as input in another `signalStoreFeature`.
 *
 * @usageNotes
 *
 * ```ts
 * function withFeatureA() {
 *   return signalStoreFeature(withState({ foo: 'bar' }));
 * }
 *
 * type FeatureA = SignalStoreFeatureType<typeof withFeatureA>;
 *
 * function withFeatureB() {
 *   return signalStoreFeature(
 *     type<FeatureA>(),
 *     withMethods(({ foo }) => ({
 *       logFoo(): void {
 *         console.log(foo());
 *       },
 *     }))
 *   );
 * }
 * ```
 */
export type SignalStoreFeatureType<
  Feature extends (...params: never[]) => unknown,
> =
  ReturnType<Feature> extends SignalStoreFeature<infer Input, infer Output>
    ? SignalStoreFeatureResult extends Input
      ? Output
      : Input & Output
    : never;
