import 'jasmine';

import { Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing'; // disable_only_catalyst_tests
import { ComponentStore } from '@ngrx/component-store';
import { isObservable, Observable, ReplaySubject } from 'rxjs';

/**
 * Angular providers and an injection token for a mocked component store.
 *
 * For usage, see {@link provideMockComponentStores}.
 */
export interface MockComponentStoreFactory<T> {
  providers: Provider[];
  token: Type<MockComponentStore<T>>;
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

/**
 * A ProxyComponentStore that shims out the actual implementations for the
 * ComponentStore methods (i.e. setState, select, effect, updater).
 *
 * The methods are replaced with objects that indicate what function was being
 * called. When the values returned are set to `this`, we capture them with a
 * Proxy in order to actually set the mocked selectors/updaters/effects.
 */
class ProxyComponentStore<ClassType> {
  setState() {}

  patchState() {}

  select() {
    return { [MOCK_STORE_VALUE]: ProxyComponentStoreValue.SELECT };
  }

  updater() {
    // Sometimes updater is called in the constructor with some arguments
    // already. We should at least not break that case when mocking CS.
    const updaterCallback = () => ({
      [MOCK_STORE_VALUE]: ProxyComponentStoreValue.UPDATER,
    });
    return Object.defineProperty(updaterCallback, MOCK_STORE_VALUE, {
      value: ProxyComponentStoreValue.UPDATER,
    });
  }

  effect() {
    // Sometimes effect is called in the constructor with some arguments
    // already. We should at least not break that case when mocking CS.
    const updaterCallback = () => ({
      [MOCK_STORE_VALUE]: ProxyComponentStoreValue.EFFECT,
    });
    return Object.defineProperty(updaterCallback, MOCK_STORE_VALUE, {
      value: ProxyComponentStoreValue.EFFECT,
    });
  }

  constructor(
    classConstructor: Constructor<ClassType>,
    hints?: MockStoreHints<ClassType>
  ) {
    // The approach here is to temporarily swap out the class's prototype during
    // the time that the constructor is being run (via Reflect.construct); this
    // allows us to override certain methods that are called in that constructor
    // (e.g. setting selectors, updaters, and effects).
    //
    // We intercept all property 'set's in order to mock
    // selectors/updaters/effects. We also intercept all getters so that if a
    // ComponentStore property is retrieved, we can provide it.
    //
    // Note that we store the data on `this`; we're using the
    // `ProxyComponentStore` instance as storage to avoid potential infinite
    // loops with getters/accessors.
    const proxiedPrototype = new Proxy(classConstructor.prototype, {
      // `any` to enable magic property lookups
      // tslint:disable:no-any
      set: (obj, prop, value) => {
        // All ComponentStore APIs are mocked and initially return a specific
        // token - one of the enums from MockStoreValue. When we `set`, we'll
        // replace these tokens with the corresponding Spy, or in case of
        // Selectors - ReplaySubject.

        if (
          value[MOCK_STORE_VALUE] === ProxyComponentStoreValue.SELECT ||
          hints?.selectors?.includes(String(prop) as any)
        ) {
          (this as any)[prop] = new ReplaySubject<unknown>(1);
        } else if (
          value[MOCK_STORE_VALUE] === ProxyComponentStoreValue.UPDATER
        ) {
          (this as any)[prop] = jasmine.createSpy(`updater[${String(prop)}]`);
        } else if (
          value[MOCK_STORE_VALUE] === ProxyComponentStoreValue.EFFECT
        ) {
          (this as any)[prop] = jasmine.createSpy(`effect[${String(prop)}]`);
        } else if (prop === 'destroy$') {
          (this as any)[prop] = new ReplaySubject<void>(1);
        } else {
          (this as any)[prop] = value;
        }
        return true;
      },
      get: (obj, prop, constructedObj) => {
        if ((this as any)[prop]) {
          return (this as any)[prop];
        }

        // In the case that this is a prototype property (i.e. a function
        // declared for the class), we want to try to inspect the output of the
        // function in order to provide an appropriate return value.
        if (classConstructor.prototype[prop]) {
          const spy = getAppropriateMockForFunction(
            classConstructor,
            prop,
            constructedObj
          );
          (this as any)[prop] = spy;
          return spy;
        }

        return (ComponentStore.prototype as any)[prop];
      },
    });
    // tslint:enable:no-any

    // Reflect.construct requires an actual function/class with the prototype to
    // use; we just mock this out with a blank constructor.
    //
    // tslint:disable-next-line:only-arrow-functions
    const mockedConstructor = function () {};
    mockedConstructor.prototype = proxiedPrototype;

    // We then construct the object, substituting the prototype with our newly
    // created Proxy.
    const constructedObj = Reflect.construct(
      classConstructor,
      getMagicProxyArgsForFn(classConstructor),
      mockedConstructor
    );

    // Return the proxied object so that any subsequent gets/sets are still
    // mocked properly.
    return constructedObj;
  }
}

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

/**
 * Given a class, property name, and the mock store object, runs the
 * specified function on the class prototype to determine a good default
 * value to return.
 */
function getAppropriateMockForFunction(
  classConstructor: Constructor<{}>,
  prop: string | symbol | number,
  self: {}
) {
  const value = callFnWithMagicProxy(classConstructor.prototype[prop], self);

  let mockValue = value;
  // Depending on what we get back from the function, provide a default
  // value for the mock. In particular, we care about selectors and
  // Observables.
  if (value?.[MOCK_STORE_VALUE] === ProxyComponentStoreValue.SELECT) {
    mockValue = new ReplaySubject<unknown>(1);
  } else if (isObservable(mockValue)) {
    mockValue = new ReplaySubject<unknown>(1);
  }

  const spy = jasmine.createSpy(`${String(prop)}()`);
  spy.and.returnValue(mockValue);

  return spy;
}
