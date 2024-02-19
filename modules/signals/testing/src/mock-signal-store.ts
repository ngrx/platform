import {
  Provider,
  ProviderToken,
  Signal,
  WritableSignal,
  isSignal,
  untracked,
  signal,
} from '@angular/core';
import { SinonSpy, fake } from 'sinon';
import { FakeRxMethod, newFakeRxMethod } from './fake-rx-method';
import { getState, patchState } from '../../src';
import { StateSignal } from '../../src/state-signal';
import { RxMethod } from 'modules/signals/rxjs-interop/src/rx-method';

/**
 * Constructor type.
 */
interface Constructor<ClassType> {
  new (...args: never[]): ClassType;
}

/**
 * Function type.
 */
type Method<T extends readonly any[] = any[]> = (...args: T) => unknown;

/**
 * Type for a mocked singalStore:
 * - Signals are replaced by WritableSignals.
 * - RxMethods are replaced by FakeRxMethods.
 * - Functions are replaced by Sinon fakes.
 */
export type MockSignalStore<T> = {
  [K in keyof T]: T[K] extends Signal<infer V>
    ? WritableSignal<V>
    : T[K] extends RxMethod<infer R>
    ? FakeRxMethod<R>
    : T[K] extends Method<infer U>
    ? SinonSpy<U>
    : T[K];
};

/**
 * Type for the state of the singlaStore.
 */
type InitialState<T> = T extends StateSignal<infer U> ? U : never;

/**
 * Given a type T, determines the keys of the signal properties.
 */
type SignalKeys<T> = {
  // -? makes the key required, opposite of ?
  [K in keyof T]-?: T[K] extends Signal<unknown> ? K : never;
}[keyof T];

/**
 * Type to extract the wrapped type from a Signal type.
 *
 * @template T - The original Signal type.
 * @returns The unwrapped type if T is a Signal, otherwise, 'never'.
 */
type UnwrapSignal<T> = T extends Signal<infer U> ? U : never;

/**
 * Parameters for providing a mock signal store.
 *
 * @template T The type of the original signal store.
 * @param initialStatePatch A partial initial state to override the original initial state.
 * @param initialComputedValues Initial values for computed signals.
 * @param mockComputedSignals Flag to mock computed signals (default is true).
 * @param mockMethods Flag to mock methods (default is true).
 * @param mockRxMethods Flag to mock RxMethods (default is true).
 * @param debug Flag to enable debug mode (default is false).
 */
export type ProvideMockSignalStoreParams<T> = {
  initialStatePatch?: Partial<InitialState<T>>;
  initialComputedValues?: Omit<
    {
      [K in SignalKeys<T>]?: UnwrapSignal<T[K]>;
    },
    keyof InitialState<T>
  >;
  mockComputedSignals?: boolean;
  mockMethods?: boolean;
  mockRxMethods?: boolean;
  debug?: boolean;
};

/**
 * Provides a mock version of signal store.
 *
 * @template ClassType The class type that extends StateSignal<object>.
 * @param classConstructor The constructor function for the class.
 * @param params Optional parameters for providing the mock signal store.
 * @returns The provider for the mock signal store.
 *
 * Usage:
 *
 * ```typescript
 * // component:
 *
 * export const ArticleListSignalStore = signalStore(
 *   withState<ArticleListState>(initialArticleListState),
 *   withComputed(({ articlesCount, pageSize }) => ({
 *      totalPages: computed(() => Math.ceil(articlesCount() / pageSize())),
 *   })),
 *   withComputed(({ selectedPage, totalPages }) => ({
 *     pagination: computed(() => ({ selectedPage: selectedPage(), totalPages: totalPages() })),
 *   })),
 *   // ...
 * );
 *
 * @Component(...)
 * export class ArticleListComponent_SS {
 *   readonly store = inject(ArticleListSignalStore);
 *   // ...
 * }
 *
 * // test:
 *
 * // we have to use UnwrapProvider<T> to get the real type of a SignalStore
 * let store: UnwrapProvider<typeof ArticleListSignalStore>;
 * let mockStore: MockSignalStore<typeof store>;
 *
 * await TestBed.configureTestingModule({
 *   imports: [
 *     ArticleListComponent_SS,
 *     MockComponent(UiArticleListComponent)
 *   ]
 * })
 * .overrideComponent(
 *   ArticleListComponent_SS,
 *   {
 *     set: {
 *       providers: [ // override the component level providers
 *         MockProvider(ArticlesService), // injected in ArticleListSignalStore
 *         provideMockSignalStore(ArticleListSignalStore, {
 *           // if mockComputedSignals is enabled (default),
 *           // you must provide an initial value for each computed signals
 *           initialComputedValues: {
 *             totalPages: 0,
 *             pagination: { selectedPage: 0, totalPages: 0 }
 *           }
 *         })
 *       ]
 *     }
 *   }
 * )
 * .compileComponents();
 *
 * store = component.store;
 * mockStore = asMockSignalStore(store);
 *
 * ```
 */

export function provideMockSignalStore<ClassType extends StateSignal<object>>(
  classConstructor: Constructor<ClassType>,
  params?: ProvideMockSignalStoreParams<ClassType>
): Provider {
  let cachedStore: ClassType | undefined = undefined;
  return {
    provide: classConstructor,
    useFactory: () => {
      // use the cached instance of the store to work around Angular
      // attaching created items to certain nodes.
      if (cachedStore) {
        return cachedStore as MockSignalStore<ClassType>;
      }
      const store = Reflect.construct(classConstructor, []);
      cachedStore = store;

      const keys = Object.keys(store) as Array<keyof ClassType>;

      const pluckerSignals = keys.filter(
        (k) => isSignal(store[k]) && k in getState(store)
      );
      const combinedSignals = keys.filter(
        (k) => isSignal(store[k]) && !pluckerSignals.includes(k)
      );
      const rxMethods = keys.filter(
        (k) =>
          typeof store[k] === 'function' &&
          !isSignal(store[k]) &&
          'unsubscribe' in (store[k] as object)
      );
      const methods = keys.filter(
        (k) =>
          typeof store[k] === 'function' &&
          !isSignal(store[k]) &&
          !rxMethods.includes(k)
      );

      if (params?.debug === true) {
        console.debug('pluckerSignals', pluckerSignals);
        console.debug('combinedSignals', combinedSignals);
        console.debug('rxMethods', rxMethods);
        console.debug('methods', methods);
      }

      if (params?.mockComputedSignals !== false) {
        combinedSignals.forEach((k) => {
          if (
            params?.initialComputedValues &&
            k in params.initialComputedValues
          ) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store[k] = signal(params?.initialComputedValues?.[k]);
          } else {
            throw new Error(`${String(k)} should have an initial value`);
          }
        });
      }

      if (params?.mockMethods !== false) {
        methods.forEach((k) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store[k] = fake();
        });
      }

      if (params?.mockRxMethods !== false) {
        rxMethods.forEach((k) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store[k] = newFakeRxMethod<unknown>();
        });
      }

      if (params?.initialStatePatch) {
        untracked(() => {
          patchState(store, (s) => ({ ...s, ...params.initialStatePatch }));
        });
      }

      if (params?.debug === true) {
        console.debug('Mocked store:', store);
      }

      return store as MockSignalStore<ClassType>;
    },
  };
}

/**
 * Type to extract the type of a signal store.
 *
 * The signalStore() function returns a provider for the generated signal store.
 */
export type UnwrapProvider<T> = T extends ProviderToken<infer U> ? U : never;

/**
 * Converts the type of a (mocked) SignalStore to a MockSignalStore
 */
export function asMockSignalStore<T>(s: T): MockSignalStore<T> {
  return s as MockSignalStore<T>;
}

/**
 * Converts the type of a (mocked) function to a Sinon Spy
 */
export function asSinonSpy<
  TArgs extends readonly any[] = any[],
  TReturnValue = any
>(fn: (...x: TArgs) => TReturnValue): SinonSpy<TArgs, TReturnValue> {
  return fn as unknown as SinonSpy<TArgs, TReturnValue>;
}
