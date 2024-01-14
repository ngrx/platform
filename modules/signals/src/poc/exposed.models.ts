import {
  SignalStoreFeatureResult,
  SignalStoreProps,
  SignalStoreSlices,
} from '../signal-store-models';
import { Prettify } from '../ts-helpers';
import { StateSignal } from '../state-signal';

/**
 * property's type which is a method or signal. state is excluded
 */
export type StorePropertyType<
  Name extends keyof Store['methods'] | keyof Store['signals'],
  Store extends { methods: unknown; state: unknown; signals: unknown }
> = Name extends keyof Store['methods']
  ? Store['methods'][Name]
  : Name extends keyof Store['signals']
  ? Store['signals'][Name]
  : Name extends keyof Store['state']
  ? Store['state'][Name]
  : never;

/**
 * union type of all property names of the resulting store.
 * 'all' is a shortcut to expose everything.
 */
export type ExposableProperty<R extends SignalStoreFeatureResult> =
  | keyof R['signals']
  | keyof R['methods']
  | keyof R['state']
  | 'all';

/**
 * union type of all state properties
 */
export type ExposableStateProperty<R extends SignalStoreFeatureResult> =
  keyof R['state'];

/**
 * conditional type verifying the existence of a method or signal.
 */
export type ValidStorePropertyName<
  PropertyName,
  Store extends SignalStoreFeatureResult
> = PropertyName extends keyof Store['signals']
  ? PropertyName
  : PropertyName extends keyof Store['methods']
  ? PropertyName
  : PropertyName extends keyof Store['state']
  ? PropertyName
  : never;

/**
 * Store which exposes only certain properties.
 */
export type ExposedStore<
  StoreFeatures extends SignalStoreFeatureResult,
  PropertyNames extends Array<ExposableProperty<StoreFeatures>>
> = {
  [PropertyName in PropertyNames[number]]: SignalStoreProps<StoreFeatures>[PropertyName];
};

/**
 * supplementing state which exposes only certain properties.
 */
export type ExposedState<
  Features extends SignalStoreFeatureResult,
  PropertyNames extends Array<ExposableProperty<Features>>
> = {
  [PropertyName in PropertyNames[number] as PropertyName extends keyof Features['state']
    ? PropertyName
    : never]: PropertyName extends keyof Features['state']
    ? Features['state'][PropertyName]
    : never;
};

/**
 * supplementing state which exposes only certain properties.
 */
export type ExposedStateSignal<
  Features extends SignalStoreFeatureResult,
  PropertyNames extends Array<ExposableProperty<Features>>
> = StateSignal<{
  [PropertyName in PropertyNames[number] as PropertyName extends keyof Features['state']
    ? PropertyName
    : never]: PropertyName extends keyof Features['state']
    ? Features['state'][PropertyName]
    : never;
}>;

type ArrayToUnion<Store, Arrays extends Array<keyof Store>> = Arrays extends [
  infer First extends keyof Store,
  infer Second extends keyof Store
]
  ? First | Second
  : Arrays extends [
      infer First extends keyof Store,
      ...infer Rest extends Array<keyof Store>
    ]
  ? First | ArrayToUnion<Store, Rest>
  : Arrays extends [infer First extends keyof Store]
  ? First
  : never;
