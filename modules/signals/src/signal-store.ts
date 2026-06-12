import { DestroyRef, inject, Injectable, Type } from '@angular/core';
import { STATE_SOURCE, StateSource, WritableStateSource } from './state-source';
import {
  EmptyFeatureResult,
  InnerSignalStore,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { OmitPrivate, Prettify, TupleToIntersection } from './ts-helpers';

type ProvidedInConfig = { providedIn?: 'root' | 'platform' };

type SignalStoreConfig = ProvidedInConfig & { protectedState?: boolean };

type SignalStoreMembers<FeatureResult extends SignalStoreFeatureResult> =
  Prettify<
    OmitPrivate<
      StateSignals<FeatureResult['state']> &
        FeatureResult['props'] &
        FeatureResult['methods']
    >
  >;

/**
 * @description
 *
 * Represents a sequence of features to be applied to the store.
 * This type ensures that the features are processed in the order they are provided, which is crucial for correct store composition.
 */
type SignalStoreFeatureSequence<
  Features extends readonly SignalStoreFeature[],
> = [...Features];

/**
 * @description
 *
 * Computes the resulting store members from a sequence of features.
 * If no features are provided, returns an empty object type.
 */
type SignalStoreFeaturesResult<Features extends readonly SignalStoreFeature[]> =
  [Features[number]] extends [never]
    ? EmptyFeatureResult
    : TupleToIntersection<{
        [Index in keyof Features]: Features[Index] extends SignalStoreFeature<
          any,
          infer Result
        >
          ? Result
          : never;
      }>;

/**
 * @description
 *
 * Computes the type of the store instance based on the resulting feature composition and protected state configuration.
 */
type SignalStoreInstanceType<
  Result extends SignalStoreFeatureResult,
  ProtectedState extends boolean,
> = SignalStoreMembers<Result> &
  (ProtectedState extends true
    ? StateSource<Prettify<OmitPrivate<Result['state']>>>
    : WritableStateSource<Prettify<OmitPrivate<Result['state']>>>);

export function signalStore<
  Features extends readonly SignalStoreFeature[],
  Result extends SignalStoreFeatureResult = SignalStoreFeaturesResult<Features>,
  ProtectedState extends boolean = SignalStoreConfig['protectedState'],
>(
  config?: ProvidedInConfig & { protectedState: ProtectedState },
  ...features: SignalStoreFeatureSequence<Features>
): Type<SignalStoreInstanceType<Result, ProtectedState>>;

/**
 * @description
 *
 * Creates a store by composing features.
 * Returns an injectable service that can be provided locally or globally.
 *
 * @usageNotes
 *
 * ```ts
 * import { Component, inject } from '@angular/core';
 * import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
 *
 * export const CounterStore = signalStore(
 *   withState({ count: 0 }),
 *   withMethods((store) => ({
 *     increment(): void {
 *       patchState(store, ({ count }) => ({ count: count + 1 }));
 *     },
 *   }))
 * );
 *
 * \@Component({
 *   // ...
 *   providers: [CounterStore],
 * })
 * export class Counter {
 *   readonly store = inject(CounterStore);
 *
 *   logCount(): void {
 *     console.log(this.store.count());
 *   }
 *
 *   increment(): void {
 *     this.store.increment();
 *   }
 * }
 * ```
 */
export function signalStore(
  ...args: [SignalStoreConfig, ...SignalStoreFeature[]] | SignalStoreFeature[]
): Type<SignalStoreMembers<any>> {
  const signalStoreArgs = [...args];

  const config =
    typeof signalStoreArgs[0] === 'function'
      ? {}
      : (signalStoreArgs.shift() as SignalStoreConfig);
  const features = signalStoreArgs as SignalStoreFeature[];

  @Injectable({ providedIn: config.providedIn || null })
  class SignalStore {
    constructor() {
      const innerStore = features.reduce(
        (store, feature) => feature(store),
        getInitialInnerStore()
      );
      const { stateSignals, props, methods, hooks } = innerStore;
      const storeMembers: Record<string | symbol, unknown> = {
        ...stateSignals,
        ...props,
        ...methods,
      };

      (this as any)[STATE_SOURCE] = innerStore[STATE_SOURCE];

      for (const key of Reflect.ownKeys(storeMembers)) {
        (this as any)[key] = storeMembers[key];
      }

      const { onInit, onDestroy } = hooks;

      if (onInit) {
        onInit();
      }

      if (onDestroy) {
        inject(DestroyRef).onDestroy(onDestroy);
      }
    }
  }

  return SignalStore;
}

export function getInitialInnerStore(): InnerSignalStore {
  return {
    [STATE_SOURCE]: {},
    stateSignals: {},
    props: {},
    methods: {},
    hooks: {},
  };
}
