import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { Observable, ReplaySubject } from 'rxjs';
import {
  MockStoreHints,
  ProxyComponentStore,
  SelectorKeys,
} from './proxy-store';

/**
 * Angular providers and an injection token for a mocked component store.
 *
 * For usage, see {@link provideMockComponentStores}.
 */
export interface MockComponentStoreFactory<T> {
  providers: Provider[];
  token: Type<MockComponentStore<T>>;
}

interface Constructor<ClassType> {
  new (...args: never[]): ClassType;
}

/**
 * A template interface for an object that annotates each method as an
 * {@link ObservableSpy} and each static selector as a {@link BehaviorSubject}.
 *
 * Usage:
 *   const myServiceMock: MockComponentStore<MyComponentStore> =
 *       createMockComponentStore(MyComponentStore);
 */
export type MockComponentStore<T> = {
  [K in keyof T]: T[K] extends Observable<infer V>
    ? ReplaySubject<V>
    : T[K] extends FunctionReturningObservable<infer U>
    ? SpyReturningReplaySubject<U>
    : jasmine.Spy & T[K];
};

type FunctionReturningObservable<T> = (...args: never[]) => Observable<T>;

type SpyReturningReplaySubject<T> = jasmine.Spy & (() => ReplaySubject<T>);

type UnwrapObservable<T> = T extends Observable<infer U> ? U : never;

type MockStoreInitialValues<ClassType> = {
  [K in SelectorKeys<ClassType>]?: UnwrapObservable<ClassType[K]>;
};

/**
 * Optional parameters for the mock store factory.
 *
 * For usage, see {@link provideMockComponentStores}.
 */
export interface ProvideMockStoreParams<ClassType>
  extends MockStoreHints<ClassType> {
  initialValues?: MockStoreInitialValues<ClassType>;
}

type ComponentStoresList<ClassTypes extends ReadonlyArray<unknown>> = {
  [K in keyof ClassTypes]:
    | [Constructor<ClassTypes[K]>, ProvideMockStoreParams<ClassTypes[K]>?]
    | Constructor<ClassTypes[K]>;
};

function createMockComponentStoreInternal<ClassType>(
  classConstructor: Constructor<ClassType>,
  hints?: MockStoreHints<ClassType>
): MockComponentStore<ClassType> {
  // Type hackery
  try {
    return new ProxyComponentStore(
      classConstructor,
      hints
    ) as unknown as MockComponentStore<ClassType>;
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('inject()')) {
      throw new Error(
        'ComponentStores using `inject()` must be mocked with ' +
          '`provideMockComponentStores` and `getMockComponentStore`'
      );
    }
    throw e;
  }
}

/**
 * Provides mocks for the specified ComponentStores for use in Angular's
 * injection system.
 *
 * This is to be used in conjunction with `getMockComponentStore`, as shown
 * below.
 *
 * Usage:
 *
 * ```typescript
 * setupModule({
 *   superProviders: [
 *     provideMockComponentStores([ParentComponentStore]),
 *   ],
 * });
 *
 * const mockComponentStore = getMockComponentStore(ParentComponentStore);
 * ```
 *
 * Selectors are replaced with a ReplaySubject, so that an initial value can be
 * deferred.
 *
 * ```typescript
 * // Selectors are automatically created (with no initial value).
 * mockComponentStore.someSelector$.next(SOME_VALUE);
 * ```
 *
 * Effects are replaced with a jasmine.Spy.
 *
 * ```typescript
 * mockComponentStore.someEffect(...);
 * expect(mockComponentStore.someEffect).toHaveBeenCalledWith(...);
 * ```
 *
 * Updaters are replaced with a regular Jasmine Spy.
 *
 * ```typescript
 * mockComponentStore.someUpdater(...);
 * expect(mockComponentStore.someUpdater).toHaveBeenCalledWith(...);
 * ```
 *
 * Functions returning Observables, Selectors, will also be Jasmine Spys
 * returning a ReplaySubject
 *
 * ```typescript
 * const selector$ = mockComponentStore.getSomeSelector(param);
 * selector$.next(INITIAL_VALUE);
 * ```
 *
 * All other values are not replaced (i.e. non-ComponentStore methods).
 *
 * NB: If your ComponentStore aliases a selector from a parent ComponentStore,
 * then the selectors must be explicitly specified.
 *
 * ```typescript
 * class ChildComponentStore {
 *   constructor(parent: ParentComponentStore) {}
 *
 *   readonly selector$ = this.parent.selector$;
 * }
 *
 * // In your test:
 * provideMockComponentStores([
 *   [ChildComponentStore, {selectors: ['selector$']}],
 * ]);
 * ```
 *
 * If your ComponentStore requires some initial values for your selectors, you
 * can specify them in the parameters as well.
 *
 * ```typescript
 * provideMockComponentStores([
 *   [ParentComponentStore, {initialValues: {someSelector$: INITIAL_VALUE}}],
 * ]);
 * ```
 */
export function provideMockComponentStores<T extends ReadonlyArray<unknown>>(
  stores: ComponentStoresList<[...T]>
): Provider {
  const providers: Provider[] = [];
  for (const storeInfo of stores) {
    if (Array.isArray(storeInfo)) {
      providers.push(provideMockComponentStore(storeInfo[0], storeInfo[1]));
    } else {
      providers.push(provideMockComponentStore(storeInfo));
    }
  }
  return providers;
}

/**
 * Retrieves a mocked ComponentStore instance.
 *
 * This is to be used in conjunction with {@link provideMockComponentStores}.
 */
export function getMockComponentStore<ClassType>(
  classConstructor: Constructor<ClassType>
): MockComponentStore<ClassType> {
  return TestBed.inject(classConstructor) as MockComponentStore<ClassType>;
}

function provideMockComponentStore<ClassType>(
  classConstructor: Constructor<ClassType>,
  params?: ProvideMockStoreParams<ClassType>
): Provider {
  let store: MockComponentStore<ClassType> | undefined = undefined;
  return {
    provide: classConstructor,
    useFactory: () => {
      // use the cached instance of the store to work around Angular
      // attaching created items to certain nodes.
      if (store) {
        return store;
      }
      store = createMockComponentStoreInternal(classConstructor, params);
      const initialValues = Object.entries(
        params?.initialValues ?? {}
      ) as Array<[SelectorKeys<ClassType>, unknown]>;
      for (const [selector, initialValue] of initialValues) {
        const subject = store[selector];
        if (!(subject instanceof ReplaySubject)) {
          continue;
        }
        subject.next(initialValue);
      }

      return store;
    },
  };
}
