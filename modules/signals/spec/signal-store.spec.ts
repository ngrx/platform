import {
  computed,
  inject,
  InjectionToken,
  isSignal,
  linkedSignal,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withLinkedState,
  withMethods,
  withProps,
  withState,
} from '../src';
import { STATE_SOURCE } from '../src/state-source';
import { assertStateSource, createLocalService } from './helpers';

describe('signalStore', () => {
  describe('creation', () => {
    it('creates a store via new operator', () => {
      const Store = signalStore(withState({ foo: 'bar' }));
      const store = new Store();

      expect(store.foo()).toBe('bar');
    });

    it('creates a store as injectable service', () => {
      const Store = signalStore(withState({ foo: 'bar' }));
      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.foo()).toBe('bar');
    });

    it('creates a store that is provided in root when providedIn option is root', () => {
      const Store = signalStore(
        { providedIn: 'root' },
        withState({ foo: 'bar' })
      );
      const store1 = TestBed.inject(Store);
      const store2 = TestBed.inject(Store);

      expect(store1).toBe(store2);
      expect(store1.foo()).toBe('bar');
    });

    it('creates a store with state source as Record holding slices as signals by default', () => {
      const Store = signalStore(withState({ foo: 'bar' }));
      const store = new Store();
      const stateSource = store[STATE_SOURCE];

      expect(isSignal(stateSource)).toBe(false);
      expect(Object.keys(stateSource)).toEqual(['foo']);
      expect(isSignal(stateSource.foo)).toBe(true);
      assertStateSource(stateSource, {
        foo: signal('bar'),
      });
    });

    it('creates a store with state source as Record holding slices as signals when protectedState option is true', () => {
      const Store = signalStore(
        { protectedState: true },
        withState({ foo: 'bar' })
      );
      const store = new Store();
      const stateSource = store[STATE_SOURCE];

      expect(isSignal(stateSource)).toBe(false);
      expect(Object.keys(stateSource)).toEqual(['foo']);
      expect(isSignal(stateSource.foo)).toBe(true);
      assertStateSource(stateSource, {
        foo: signal('bar'),
      });
    });

    it('creates a store with state source as Record holding slices as writeable signals when protectedState option is false', () => {
      const Store = signalStore(
        { protectedState: false },
        withState({ foo: 'bar' })
      );
      const store = new Store();
      const stateSource = store[STATE_SOURCE];

      expect(isSignal(stateSource)).toBe(false);
      expect(Object.keys(stateSource)).toEqual(['foo']);
      expect(isSignal(stateSource.foo)).toBe(true);
      assertStateSource(stateSource, {
        foo: signal('bar'),
      });
      expect(typeof stateSource.foo.update === 'function').toBe(true);

      patchState(store, { foo: 'baz' });

      assertStateSource(stateSource, {
        foo: signal('baz'),
      });
    });
  });

  describe('withState', () => {
    it('adds deep signals to the store for each state slice', () => {
      const Store = signalStore(
        withState({
          foo: 'foo',
          x: { y: { z: 10 } },
        })
      );

      const store = new Store();

      assertStateSource(store[STATE_SOURCE], {
        foo: signal('foo'),
        x: signal({ y: { z: 10 } }),
      });

      expect(store.foo()).toBe('foo');
      expect(store.x()).toEqual({ y: { z: 10 } });
      expect(store.x.y()).toEqual({ z: 10 });
      expect(store.x.y.z()).toBe(10);
    });

    it('overrides Function properties if nested state keys have the same name', () => {
      const Store = signalStore(
        withState({ name: { length: { name: false } } })
      );
      const store = new Store();

      expect(store.name()).toEqual({ length: { name: false } });
      expect(isSignal(store.name)).toBe(true);

      expect(store.name.length()).toEqual({ name: false });
      expect(isSignal(store.name.length)).toBe(true);

      expect(store.name.length.name()).toBe(false);
      expect(isSignal(store.name.length.name)).toBe(true);
    });

    it('does not create signals for optional state slices without initial value', () => {
      type State = { x?: number; y?: { z: number } };

      const Store = signalStore(
        { protectedState: false },
        withState<State>({ x: 10 })
      );
      const store = new Store();

      expect(store.x!()).toBe(10);
      expect(store.y).toBe(undefined);

      patchState(store, { y: { z: 100 } });
      expect(store.y).toBe(undefined);
    });

    it('executes withState factory in injection context', () => {
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => ({ foo: 'foo' }),
      });
      const Store = signalStore(withState(() => inject(TOKEN)));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.foo()).toBe('foo');
    });

    it('allows symbols as state keys', () => {
      const SECRET = Symbol('SECRET');
      const Store = signalStore(withState({ [SECRET]: 'bar' }));
      const store = new Store();

      expect(store[SECRET]()).toBe('bar');
    });
  });

  describe('withLinkedState', () => {
    describe('updates automatically if the source changes', () =>
      [
        {
          name: 'with computed function',
          linkedStateFeature: signalStoreFeature(
            withState({ userId: 1 }),
            withLinkedState(({ userId }) => ({
              books: () => {
                userId();
                return [] as string[];
              },
            }))
          ),
        },
        {
          name: 'with explicit linkedSignal',
          linkedStateFeature: signalStoreFeature(
            withState({ userId: 1 }),
            withLinkedState(({ userId }) => ({
              books: linkedSignal({
                source: userId,
                computation: () => [] as string[],
              }),
            }))
          ),
        },
      ].forEach(({ name, linkedStateFeature }) => {
        it(name, () => {
          const BookStore = signalStore(
            { providedIn: 'root', protectedState: false },
            linkedStateFeature,
            withState({ version: 1 }),
            withMethods((store) => ({
              updateUser() {
                patchState(store, (value) => value);
                patchState(store, ({ userId }) => ({ userId: userId + 1 }));
              },
              addBook(title: string) {
                patchState(store, ({ books }) => ({
                  books: [...books, title],
                }));
              },
              increaseVersion() {
                patchState(store, ({ version }) => ({ version: version + 1 }));
              },
            }))
          );

          const bookStore = TestBed.inject(BookStore);
          bookStore.addBook('The Neverending Story');
          bookStore.increaseVersion();
          expect(bookStore.books()).toEqual(['The Neverending Story']);
          expect(bookStore.version()).toEqual(2);

          patchState(bookStore, { userId: 2 });
          expect(bookStore.books()).toEqual([]);
          expect(bookStore.version()).toEqual(2);
        });
      }));

    describe('can depend on a Signal from another SignalStore', () => {
      const UserStore = signalStore(
        { providedIn: 'root', protectedState: false },
        withState({ userId: 1 })
      );

      [
        {
          name: 'with computation function',
          linkedStateFeature: signalStoreFeature(
            withLinkedState((_, userStore = inject(UserStore)) => ({
              books: () => {
                userStore.userId();
                return [] as string[];
              },
            }))
          ),
        },
        {
          name: 'with explicit linkedSignal',
          linkedStateFeature: signalStoreFeature(
            withLinkedState(() => {
              const userStore = inject(UserStore);
              return {
                books: linkedSignal({
                  source: userStore.userId,
                  computation: () => [] as string[],
                }),
              };
            })
          ),
        },
      ].forEach(({ name, linkedStateFeature }) => {
        it(name, () => {
          const BookStore = signalStore(
            { providedIn: 'root' },
            linkedStateFeature,
            withMethods((store) => ({
              addBook(title: string) {
                patchState(store, ({ books }) => ({
                  books: [...books, title],
                }));
              },
            }))
          );

          const userStore = TestBed.inject(UserStore);
          const bookStore = TestBed.inject(BookStore);

          bookStore.addBook('The Neverending Story');
          expect(bookStore.books()).toEqual(['The Neverending Story']);

          patchState(userStore, { userId: 2 });

          expect(bookStore.books()).toEqual([]);
        });
      });
    });

    it('links user-defined writable signals', () => {
      const user = signal({ name: 'Mark' });
      const UserStore = signalStore(
        { providedIn: 'root' },
        withLinkedState(() => ({ user })),
        withMethods((store) => ({
          setUserName(name: string): void {
            patchState(store, { user: { name } });
          },
        }))
      );

      const userStore = TestBed.inject(UserStore);
      expect(userStore.user()).toEqual({ name: 'Mark' });

      userStore.setUserName('John');
      expect(userStore.user()).toEqual({ name: 'John' });
      expect(user()).toEqual({ name: 'John' });

      user.set({ name: 'Tom' });
      expect(userStore.user()).toEqual({ name: 'Tom' });
      expect(user()).toEqual({ name: 'Tom' });
    });

    it('has access to state signals', () => {
      const UserStore = signalStore(
        { providedIn: 'root' },
        withState({ userId: 1 }),
        withLinkedState(({ userId }) => ({ value: userId }))
      );

      const userStore = TestBed.inject(UserStore);

      expect(userStore.value()).toBe(1);
    });

    it('has access to props', () => {
      const UserStore = signalStore(
        { providedIn: 'root' },
        withProps(() => ({ userId: 1 })),
        withLinkedState(({ userId }) => ({ value: () => userId }))
      );

      const userStore = TestBed.inject(UserStore);

      expect(userStore.value()).toBe(1);
    });
  });

  describe('withProps', () => {
    it('provides previously defined state slices and properties as input argument', () => {
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withComputed(() => ({ bar: signal('bar').asReadonly() })),
        withProps(() => ({ num: 10 })),
        withProps(({ foo, bar, num }) => {
          expect(foo()).toBe('foo');
          expect(bar()).toBe('bar');
          expect(num).toBe(10);

          return { baz: num + 1 };
        })
      );

      const store = new Store();

      assertStateSource(store[STATE_SOURCE], {
        foo: signal('foo'),
      });
      expect(store.foo()).toBe('foo');
      expect(store.bar()).toBe('bar');
      expect(store.num).toBe(10);
      expect(store.baz).toBe(11);
    });

    it('executes withProps factory in injection context', () => {
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => ({ foo: 'bar' }),
      });
      const Store = signalStore(withProps(() => inject(TOKEN)));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.foo).toBe('bar');
    });

    it('allows symbols as property keys', () => {
      const SECRET = Symbol('SECRET');

      const Store = signalStore(withProps(() => ({ [SECRET]: 'secret' })));
      const store = TestBed.configureTestingModule({
        providers: [Store],
      }).inject(Store);

      expect(store[SECRET]).toBe('secret');
    });

    it('allows numbers as property keys', () => {
      const Store = signalStore(withProps(() => ({ 1: 'Number One' })));
      const store = TestBed.configureTestingModule({
        providers: [Store],
      }).inject(Store);

      expect(store[1]).toBe('Number One');
    });
  });

  describe('withComputed', () => {
    it('provides previously defined state slices and properties as input argument', () => {
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withComputed(() => ({ bar: signal('bar').asReadonly() })),
        withProps(() => ({ num: 10 })),
        withComputed(({ foo, bar, num }) => {
          expect(foo()).toBe('foo');
          expect(bar()).toBe('bar');
          expect(num).toBe(10);

          return { baz: signal('baz').asReadonly() };
        })
      );

      const store = new Store();

      assertStateSource(store[STATE_SOURCE], {
        foo: signal('foo'),
      });
      expect(store.foo()).toBe('foo');
      expect(store.bar()).toBe('bar');
      expect(store.num).toBe(10);
      expect(store.baz()).toBe('baz');
    });

    it('executes withComputed factory in injection context', () => {
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => ({ bar: signal('bar').asReadonly() }),
      });
      const Store = signalStore(withComputed(() => inject(TOKEN)));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.bar()).toBe('bar');
    });

    it('allows symbols as computed keys', () => {
      const SECRET = Symbol('SECRET');
      const SecretStore = signalStore(
        { providedIn: 'root' },
        withComputed(() => ({
          [SECRET]: computed(() => 'secret'),
        }))
      );

      const secretStore = TestBed.inject(SecretStore);

      expect(secretStore[SECRET]()).toBe('secret');
    });
  });

  describe('withMethods', () => {
    it('provides previously defined store properties as an input argument', () => {
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withComputed(() => ({ bar: signal('bar').asReadonly() })),
        withMethods(() => ({ baz: () => 'baz' })),
        withProps(() => ({ num: 100 })),
        withMethods((store) => {
          assertStateSource(store[STATE_SOURCE], {
            foo: signal('foo'),
          });
          expect(store.foo()).toBe('foo');
          expect(store.bar()).toBe('bar');
          expect(store.baz()).toBe('baz');
          expect(store.num).toBe(100);

          return { m: () => 'm' };
        })
      );

      const store = new Store();

      assertStateSource(store[STATE_SOURCE], {
        foo: signal('foo'),
      });
      expect(store.foo()).toBe('foo');
      expect(store.bar()).toBe('bar');
      expect(store.baz()).toBe('baz');
      expect(store.num).toBe(100);
      expect(store.m()).toBe('m');
    });

    it('executes withMethods factory in injection context', () => {
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => ({ baz: () => 'baz' }),
      });
      const Store = signalStore(withMethods(() => inject(TOKEN)));

      TestBed.configureTestingModule({ providers: [Store] });
      const store = TestBed.inject(Store);

      expect(store.baz()).toBe('baz');
    });

    it('allows symbols as method keys', () => {
      const SECRET = Symbol('SECRET');
      const SecretStore = signalStore(
        { providedIn: 'root' },
        withMethods(() => ({
          [SECRET]: () => 'my secret',
        }))
      );
      const secretStore = TestBed.inject(SecretStore);

      expect(secretStore[SECRET]()).toBe('my secret');
    });
  });

  describe('withHooks', () => {
    it('calls onInit hook on store init', () => {
      let message = '';
      const Store = signalStore(
        withHooks({
          onInit() {
            message = 'onInit';
          },
        })
      );

      new Store();

      expect(message).toBe('onInit');

      message = '';
      TestBed.configureTestingModule({ providers: [Store] });
      TestBed.inject(Store);

      expect(message).toBe('onInit');
    });

    it('calls onDestroy hook on store destroy', () => {
      let message = '';
      const Store = signalStore(
        withHooks({
          onDestroy() {
            message = 'onDestroy';
          },
        })
      );

      createLocalService(Store).destroy();

      expect(message).toBe('onDestroy');
    });

    it('provides previously defined store properties as onInit input argument', () => {
      let message = '';
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withComputed(() => ({ bar: signal('bar').asReadonly() })),
        withMethods(() => ({ baz: () => 'baz' })),
        withProps(() => ({ num: 10 })),
        withHooks({
          onInit(store) {
            assertStateSource(store[STATE_SOURCE], {
              foo: signal('foo'),
            });
            expect(store.foo()).toBe('foo');
            expect(store.bar()).toBe('bar');
            expect(store.baz()).toBe('baz');
            expect(store.num).toBe(10);
            message = 'onInit';
          },
        })
      );

      new Store();

      expect(message).toBe('onInit');
    });

    it('provides previously defined store properties as onDestroy input argument', () => {
      let message = '';
      const Store = signalStore(
        withState(() => ({ foo: 'foo' })),
        withComputed(() => ({ bar: signal('bar').asReadonly() })),
        withMethods(() => ({ baz: () => 'baz' })),
        withProps(() => ({ num: 100 })),
        withHooks({
          onDestroy(store) {
            expect(store.foo()).toBe('foo');
            expect(store.bar()).toBe('bar');
            expect(store.baz()).toBe('baz');
            expect(store.num).toBe(100);
            message = 'onDestroy';
          },
        })
      );

      createLocalService(Store).destroy();

      expect(message).toBe('onDestroy');
    });

    it('executes hooks factory in injection context', () => {
      const messages: string[] = [];
      const TOKEN_INIT = new InjectionToken('TOKEN_INIT', {
        providedIn: 'root',
        factory: () => 'init',
      });
      const TOKEN_DESTROY = new InjectionToken('TOKEN_DESTROY', {
        providedIn: 'root',
        factory: () => 'destroy',
      });
      const Store = signalStore(
        withState({ name: 'NgRx Store' }),
        withHooks((store) => {
          const tokenInit = inject(TOKEN_INIT);
          const tokenDestroy = inject(TOKEN_DESTROY);
          return {
            onInit() {
              messages.push(`${tokenInit} ${store.name()}`);
            },
            onDestroy() {
              messages.push(`${tokenDestroy} ${store.name()}`);
            },
          };
        })
      );
      const { destroy } = createLocalService(Store);

      expect(messages).toEqual(['init NgRx Store']);

      destroy();
      expect(messages).toEqual(['init NgRx Store', 'destroy NgRx Store']);
    });

    it('executes onInit hook in injection context', () => {
      const messages: string[] = [];
      const TOKEN = new InjectionToken('TOKEN', {
        providedIn: 'root',
        factory: () => 'init',
      });
      const Store = signalStore(
        withState({ name: 'NgRx Store' }),
        withHooks({
          onInit(store, token = inject(TOKEN)) {
            messages.push(`${token} ${store.name()}`);
          },
        })
      );

      TestBed.configureTestingModule({ providers: [Store] });
      TestBed.inject(Store);

      expect(messages).toEqual(['init NgRx Store']);
    });

    it('succeeds with onDestroy and providedIn: root', () => {
      const messages: string[] = [];
      const Store = signalStore(
        { providedIn: 'root' },
        withHooks({
          onDestroy() {
            messages.push('ending...');
          },
        })
      );
      TestBed.inject(Store);
      TestBed.resetTestingModule();

      expect(messages).toEqual(['ending...']);
    });
  });

  describe('composition', () => {
    it('logs warning if previously defined signal store members have the same name', () => {
      const Store = signalStore(
        withState({ i: 1, j: 2, k: 3, l: 4 }),
        withComputed(() => ({
          l: signal('l').asReadonly(),
          m: signal('m').asReadonly(),
        })),
        withMethods(() => ({
          j: () => 'j',
          m: () => true,
          n: (value: number) => value,
        }))
      );
      const warnings: string[][] = [];
      vi.spyOn(console, 'warn').mockImplementation((...args: string[]) =>
        warnings.push(args)
      );

      new Store();

      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(warnings).toEqual([
        [
          '@ngrx/signals: SignalStore members cannot be overridden.',
          'Trying to override:',
          'l',
        ],
        [
          '@ngrx/signals: SignalStore members cannot be overridden.',
          'Trying to override:',
          'j, m',
        ],
      ]);
    });

    it('passes on a symbol key to the features', () => {
      const SECRET = Symbol('SECRET');
      const SecretStore = signalStore(
        withProps(() => ({
          [SECRET]: 'not your business',
        })),
        withComputed((store) => ({
          secret: computed(() => store[SECRET]),
        })),
        withMethods((store) => ({
          reveil() {
            return store[SECRET];
          },
        }))
      );

      const secretStore = new SecretStore();

      expect(secretStore.reveil()).toBe('not your business');
      expect(secretStore.secret()).toBe('not your business');
      expect(secretStore[SECRET]).toBe('not your business');
    });
  });
});
