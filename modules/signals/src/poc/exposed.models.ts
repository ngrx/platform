import { SignalStoreFeatureResult } from '../signal-store-models';

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
 * conditional type verifying the existence of a method or signal.
 */
export type ValidStorePropertyName<
  PropertyName,
  Store extends SignalStoreFeatureResult
> = PropertyName extends keyof Store['signals']
  ? PropertyName
  : PropertyName extends keyof Store['methods']
  ? PropertyName
  : never;

/**
 * Store which exposes only certain properties.
 */
export type ExposedStore<
  Store extends SignalStoreFeatureResult,
  PropertyNames extends Array<ExposableProperty<Store>>
> = {
  [PropertyName in PropertyNames[number] as ValidStorePropertyName<
    PropertyName,
    Store
  >]: StorePropertyType<PropertyName, Store>;
};

/**
 * supplementing state which exposes only certain properties.
 */
export type ExposedState<
  Store extends SignalStoreFeatureResult,
  PropertyNames extends Array<ExposableProperty<Store>>
> = {
  [PropertyName in PropertyNames[number] as PropertyName extends keyof Store['state']
    ? PropertyName
    : never]: PropertyName extends keyof Store['state']
    ? Store['state'][PropertyName]
    : never;
};
