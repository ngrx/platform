import { ComponentStore } from '@ngrx/component-store';
import { isObservable, Observable, ReplaySubject, Subscription } from 'rxjs';
import { Constructor } from './constructor';
import { callWithRecursiveProxies, getProxyArgsForFunction } from './proxies';

const MOCK_STORE_VALUE = Symbol('MOCK_STORE_VALUE');

enum ProxyComponentStoreValue {
  SELECT,
  UPDATER,
  EFFECT,
}

interface MockedStoreValue {
  [MOCK_STORE_VALUE]: ProxyComponentStoreValue;
}

/**
 * Given a type T, determines the possible keys that could be a selector.
 *
 * This may include false positives since general Observable properties will
 * be interpreted as selectors in this context.
 */
export type SelectorKeys<T> = {
  // We don't care about the actual type of Observable, we just need the key
  [K in keyof T]-?: T[K] extends Observable<unknown> ? K : never;
}[keyof T];

/**
 * Given a type T, determines the possible keys that could be an effect
 *
 * This may include false positives since any function will be interpreted as
 * a possible effect in this context.
 */
type EffectKeys<T> = {
  [K in keyof T]-?: T[K] extends () => unknown ? K : never;
}[keyof T];

/**
 * Given a type T, determines the possible keys that could be a updater.
 *
 * This may include false positives since any function will be interpreted as
 * a possible updater in this context.
 */
type UpdaterKeys<T> = {
  [K in keyof T]-?: T[K] extends () => unknown ? K : never;
}[keyof T];

/**
 * Optional hints for the component store constructor; useful in case some
 * selectors or effects are aliases of a parent store.
 */
export interface MockStoreHints<ClassType> {
  selectors?: Array<SelectorKeys<ClassType>>;
  effects?: Array<EffectKeys<ClassType>>;
  updaters?: Array<UpdaterKeys<ClassType>>;
}

class MockObservable<T> extends Observable<T> implements MockedStoreValue {
  readonly [MOCK_STORE_VALUE] = ProxyComponentStoreValue.SELECT;

  override lift<R>(): Observable<R> {
    return new MockObservable<R>();
  }

  override pipe(): Observable<T> {
    return new MockObservable<T>();
  }
}

/**
 * A ProxyComponentStore that shims out the actual implementations for the
 * ComponentStore methods (i.e. setState, select, effect, updater).
 *
 * The methods are replaced with objects that indicate what function was being
 * called. When the values returned are set to `this`, we capture them with a
 * Proxy in order to actually set the mocked selectors/updaters/effects.
 */
export class ProxyComponentStore<ClassType> {
  setState() {
    // Do nothing; we mock out all state.
  }

  patchState() {
    // Do nothing; we mock out all state.
  }

  select() {
    // Sometimes, the selector is immediately piped or lifted; we want to mock
    // out those methods so that we can still determine that it was originally a
    // selector (and so that we can install a Spy)
    return new MockObservable();
  }

  updater() {
    // Sometimes updater is called in the constructor with some arguments
    // already. We should at least not break that case when mocking CS.
    return Object.assign(() => new Subscription(), {
      [MOCK_STORE_VALUE]: ProxyComponentStoreValue.UPDATER,
    });
  }

  effect() {
    // Sometimes effect is called in the constructor with some arguments
    // already. We should at least not break that case when mocking CS.
    return Object.assign(() => new Subscription(), {
      [MOCK_STORE_VALUE]: ProxyComponentStoreValue.EFFECT,
    });
  }

  constructor(
    classConstructor: Constructor<ClassType>,
    hints?: MockStoreHints<ClassType>
  ) {
    const proxyInstance = this as any;

    // The approach here is to temporarily swap out the class's prototype during
    // the time that the constructor is being run (via Reflect.construct); this
    // allows us to override certain methods that are called in that constructor
    // (e.g. setting selectors, updaters, and effects).
    //
    // We intercept all property 'set's in order to mock
    // selectors/updaters/effects. We also intercept all getters so that if a
    // ComponentStore property is retrieved, we can provide it.
    //
    // Note that we store the data on `this` (aliased to `proxyInstance`); we're
    // using the `ProxyComponentStore` instance as a storage object to avoid
    // potential infinite loops with getters/accessors.
    const proxiedPrototype = new Proxy(classConstructor.prototype, {
      set: (_obj, prop, value) => {
        // All ComponentStore APIs are mocked and initially return a specific
        // token - one of the enums from MockStoreValue. When we `set`, we'll
        // replace these tokens with the corresponding Spy, or in case of
        // Selectors - ReplaySubject.

        const mockStoreValue = value[MOCK_STORE_VALUE];
        if (
          mockStoreValue === ProxyComponentStoreValue.SELECT ||
          hints?.selectors?.includes(prop as SelectorKeys<ClassType>)
        ) {
          proxyInstance[prop] = new ReplaySubject<unknown>(1);
        } else if (
          mockStoreValue === ProxyComponentStoreValue.UPDATER ||
          hints?.updaters?.includes(prop as UpdaterKeys<ClassType>)
        ) {
          proxyInstance[prop] = jasmine.createSpy(`updater[${String(prop)}]`);
        } else if (
          mockStoreValue === ProxyComponentStoreValue.EFFECT ||
          hints?.effects?.includes(prop as EffectKeys<ClassType>)
        ) {
          proxyInstance[prop] = jasmine.createSpy(`effect[${String(prop)}]`);
        } else if (prop === 'destroy$') {
          // Special case for always mocking the `destroy$` Observable.
          proxyInstance[prop] = new ReplaySubject<void>(1);
        } else {
          proxyInstance[prop] = value;
        }
        return true;
      },
      get: (_obj, prop, constructedObj) => {
        if (proxyInstance[prop]) {
          return proxyInstance[prop];
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
          proxyInstance[prop] = spy;
          return spy;
        }

        return (ComponentStore.prototype as any)[prop];
      },
    });

    // Reflect.construct requires an actual function/class with the prototype to
    // use; we just mock this out with a blank constructor.
    function mockedConstructor() {
      // Does nothing
    }
    mockedConstructor.prototype = proxiedPrototype;

    // We then construct the object, substituting the prototype with our newly
    // created Proxy.
    const constructedObj = Reflect.construct(
      classConstructor,
      getProxyArgsForFunction(classConstructor),
      mockedConstructor
    );

    // Return the proxied object so that any subsequent gets/sets are still
    // mocked properly.
    return constructedObj;
  }
}

function isMockedStoreValue(val: unknown): val is MockedStoreValue {
  return typeof val === 'object' && val !== null && MOCK_STORE_VALUE in val;
}

/**
 * Given a class, property name, and the mock store object, runs the
 * specified function on the class prototype to determine a good default
 * value to return.
 *
 * This may be a ReplaySubject, for Observables or selectors, or a simple spy
 * for other functions.
 */
function getAppropriateMockForFunction(
  classConstructor: Constructor<unknown>,
  prop: string | symbol | number,
  self: unknown
) {
  const value = callWithRecursiveProxies(
    classConstructor.prototype[prop],
    self
  );

  let mockValue = value;
  // Depending on what we get back from the function, provide a default
  // value for the mock. In particular, we care about selectors and
  // Observables.
  if (
    isMockedStoreValue(value) &&
    value[MOCK_STORE_VALUE] === ProxyComponentStoreValue.SELECT
  ) {
    mockValue = new ReplaySubject<unknown>(1);
  } else if (isObservable(mockValue)) {
    mockValue = new ReplaySubject<unknown>(1);
  }

  const spy = jasmine.createSpy(`${String(prop)}()`);
  spy.and.returnValue(mockValue);

  return spy;
}
