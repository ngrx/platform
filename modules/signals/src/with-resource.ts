import { Resource, ResourceRef, ResourceStatus, Signal } from '@angular/core';
import { toDeepSignal } from './deep-signal';
import { assertUniqueStoreMembers } from './signal-store-assertions';
import {
  InnerSignalStore,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { isWritableSignal, STATE_SOURCE } from './state-source';

//** Types for `withResource` */

export type ResourceResult<T> = {
  state: { value: T };
  props: {
    status: Signal<ResourceStatus>;
    error: Signal<Error | undefined>;
    isLoading: Signal<boolean>;
  };
  methods: {
    hasValue(): this is Resource<Exclude<T, undefined>>;
    _reload(): boolean;
  };
};

type ResourceDictionary = Record<string, ResourceRef<unknown>>;

type NamedResourceResult<T extends ResourceDictionary> = {
  state: {
    [Prop in keyof T as `${Prop &
      string}Value`]: T[Prop]['value'] extends Signal<infer S> ? S : never;
  };
  props: {
    [Prop in keyof T as `${Prop & string}Status`]: Signal<ResourceStatus>;
  } & {
    [Prop in keyof T as `${Prop & string}Error`]: Signal<Error | undefined>;
  } & {
    [Prop in keyof T as `${Prop & string}IsLoading`]: Signal<boolean>;
  };
  methods: {
    [Prop in keyof T as `${Prop & string}HasValue`]: () => this is Resource<
      Exclude<T[Prop]['value'], undefined>
    >;
  } & {
    [Prop in keyof T as `_${Prop & string}Reload`]: () => boolean;
  };
};

//** Implementation of `withResource` */

/**
 * @experimental
 * @description
 *
 * Integrates a `Resource` into the SignalStore and makes the store instance
 * implement the `Resource` interface.
 *
 * The resource’s value is stored under the `value` key in the state
 * and is exposed as a `DeepSignal`.
 *
 * It can also be updated via `patchState`.
 *
 * @usageNotes
 *
 * ```ts
 * const UserStore = signalStore(
 *   withState({ userId: undefined as number | undefined }),
 *   withResource(({ userId }) =>
 *     httpResource<User>(() =>
 *       userId === undefined ? undefined : `/users/${userId}`
 *     )
 *   )
 * );
 *
 * const userStore = new UserStore();
 * userStore.value(); // User | undefined
 * ```
 *
 * @param resourceFactory A factory function that receives the store's state signals,
 * methods, and props. Needs to return a `ResourceRef`.
 */
export function withResource<
  Input extends SignalStoreFeatureResult,
  ResourceValue
>(
  resourceFactory: (
    store: Input['props'] & Input['methods'] & StateSignals<Input['state']>
  ) => ResourceRef<ResourceValue>
): SignalStoreFeature<Input, ResourceResult<ResourceValue>>;

/**
 * @experimental
 * @description
 *
 * Integrates multiple resources into the SignalStore. Each resource is
 * registered by name, which is used as a prefix when spreading the members
 * of `Resource` onto the store.
 *
 * Each resource’s value is part of the state, stored under the `value` key
 * with the resource name as prefix. Values are exposed as `DeepSignal`s and
 * can be updated via `patchState`.
 *
 * @usageNotes
 *
 * ```ts
 * const UserStore = signalStore(
 *   withState({ userId: undefined as number | undefined }),
 *   withResource(({ userId }) => ({
 *     list: httpResource<User[]>(() => '/users', { defaultValue: [] }),
 *     detail: httpResource<User>(() =>
 *       userId === undefined ? undefined : `/users/${userId}`
 *     ),
 *   }))
 * );
 *
 * const userStore = new UserStore();
 * userStore.listValue(); // []
 * userStore.detailValue(); // User | undefined
 * ```
 *
 * @param resourceFactory A factory function that receives the store's props,
 * methods, and state signals. It must return a `Record<string, ResourceRef>`.
 */
export function withResource<
  Input extends SignalStoreFeatureResult,
  Dictionary extends ResourceDictionary
>(
  resourceFactory: (
    store: Input['props'] & Input['methods'] & StateSignals<Input['state']>
  ) => Dictionary
): SignalStoreFeature<Input, NamedResourceResult<Dictionary>>;

export function withResource<
  Input extends SignalStoreFeatureResult,
  ResourceValue
>(
  resourceFactory: (
    store: Input['props'] & Input['methods'] & StateSignals<Input['state']>
  ) => ResourceRef<ResourceValue> | ResourceDictionary
): SignalStoreFeature<Input> {
  return (store) => {
    const resourceOrDictionary = resourceFactory({
      ...store.stateSignals,
      ...store.props,
      ...store.methods,
    });

    if (isResourceRef(resourceOrDictionary)) {
      return createUnnamedResource(store, resourceOrDictionary);
    } else {
      return createNamedResource(store, resourceOrDictionary);
    }
  };
}

function createUnnamedResource<ResourceValue>(
  store: InnerSignalStore,
  resource: ResourceRef<ResourceValue>
) {
  assertUniqueStoreMembers(store, [
    'value',
    'status',
    'error',
    'isLoading',
    '_reload',
    'hasValue',
  ]);

  function hasValue(): this is Resource<Exclude<ResourceValue, undefined>> {
    return resource.hasValue();
  }

  return {
    ...store,
    [STATE_SOURCE]: { ...store[STATE_SOURCE], value: resource.value },
    stateSignals: {
      ...store.stateSignals,
      value: toDeepSignal(resource.value),
    },
    props: {
      ...store.props,
      status: resource.status,
      error: resource.error,
      isLoading: resource.isLoading,
    },
    methods: {
      ...store.methods,
      hasValue,
      _reload: () => resource.reload(),
    },
  };
}

function createNamedResource<Dictionary extends ResourceDictionary>(
  inputStore: InnerSignalStore,
  dictionary: Dictionary
) {
  return Object.keys(dictionary).reduce((store, resourceName) => {
    const resource = dictionary[resourceName];
    assertUniqueStoreMembers(
      store,
      ['Value', 'Status', 'Error', 'IsLoading', 'HasValue', `_`].map(
        (suffix) => `${resourceName}${suffix}`
      )
    );

    function hasValue(): boolean {
      return resource.hasValue();
    }

    return {
      ...store,
      [STATE_SOURCE]: {
        ...store[STATE_SOURCE],
        [`${resourceName}Value`]: resource.value,
      },
      stateSignals: {
        ...store.stateSignals,
        [`${resourceName}Value`]: toDeepSignal(resource.value),
      },
      props: {
        ...store.props,
        [`${resourceName}Status`]: resource.status,
        [`${resourceName}Error`]: resource.error,
        [`${resourceName}IsLoading`]: resource.isLoading,
      },
      methods: {
        ...store.methods,
        [`${resourceName}HasValue`]: hasValue,
        [`_${resourceName}Reload`]: () => resource.reload(),
      },
    };
  }, inputStore);
}

function isResourceRef(value: unknown): value is ResourceRef<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    isWritableSignal(value.value) &&
    'status' in value &&
    'error' in value &&
    'isLoading' in value &&
    'hasValue' in value &&
    'reload' in value
  );
}

//** Types for `mapToResource` */

type NamedResource<Name extends string, T> = {
  [Prop in `${Name}Value`]: Signal<T>;
} & {
  [Prop in `${Name}Status`]: Signal<ResourceStatus>;
} & {
  [Prop in `${Name}Error`]: Signal<Error | undefined>;
} & {
  [Prop in `${Name}IsLoading`]: Signal<boolean>;
} & {
  [Prop in `${Name}HasValue`]: () => boolean;
};

type IsValidResourceName<
  Name extends string,
  Store extends Record<string, unknown>
> = Store[`${Name}Value`] extends Signal<infer S>
  ? Store extends NamedResource<Name, S>
    ? true
    : false
  : false;

type ResourceNames<Store extends Record<string, unknown>> = keyof {
  [Prop in keyof Store as Prop extends `${infer Name}Value`
    ? IsValidResourceName<Name, Store> extends true
      ? Name
      : never
    : never]: Store[Prop] extends Signal<infer S> ? S : never;
};

type MappedResource<
  Store extends Record<string, unknown>,
  Name extends string
> = Resource<Store[`${Name}Value`] extends Signal<infer S> ? S : never>;

//** Implementation of `mapToResource` */

/**
 * @experimental
 * @description
 *
 * Maps a named resource to type `Resource<T>`.
 *
 * @usageNotes
 *
 * ```ts
 * const store = signalStore(
 *   withState({ userId: undefined as number | undefined }),
 *   withResource(({ userId }) => ({
 *     user: httpResource<User[]>(() => '/users', { defaultValue: [] }),
 *   }))
 * );
 * const userResource = mapToResource(store, 'user');
 * userResource satisfies Resource<User[]>;
 * ```
 *
 * @param store The store instance to map the resource to.
 * @param name The name of the resource to map.
 * @returns `ResourceRef<T>`
 */
export function mapToResource<
  Name extends ResourceNames<Store>,
  Store extends Record<string, unknown>
>(store: Store, name: Name): MappedResource<Store, Name> {
  const resourceName = String(name);

  function hasValue(): this is Resource<
    Exclude<MappedResource<Store, Name>, undefined>
  > {
    return (store[`${resourceName}HasValue`] as () => boolean)();
  }

  return {
    value: store[`${resourceName}Value`],
    status: store[`${resourceName}Status`],
    error: store[`${resourceName}Error`],
    isLoading: store[`${resourceName}IsLoading`],
    hasValue,
  } as MappedResource<Store, Name>;
}
