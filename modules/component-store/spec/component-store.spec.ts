/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentStore } from '@ngrx/component-store';
import { fakeSchedulers, marbles } from 'rxjs-marbles/jest';
import {
  of,
  Subscription,
  ConnectableObservable,
  interval,
  timer,
  Observable,
  from,
} from 'rxjs';
import {
  delayWhen,
  publishReplay,
  take,
  map,
  tap,
  finalize,
  delay,
  concatMap,
} from 'rxjs/operators';

describe('Component Store', () => {
  describe('initialization', () => {
    it(
      'through constructor',
      marbles((m) => {
        const INIT_STATE = { init: 'state' };
        const componentStore = new ComponentStore(INIT_STATE);

        m.expect(componentStore.state$).toBeObservable(
          m.hot('i', { i: INIT_STATE })
        );
      })
    );

    it(
      'stays uninitialized if initial state is not provided',
      marbles((m) => {
        const componentStore = new ComponentStore();

        // No values emitted.
        m.expect(componentStore.state$).toBeObservable(m.hot('-'));
      })
    );

    it(
      'through setState method',
      marbles((m) => {
        const componentStore = new ComponentStore();
        const INIT_STATE = { setState: 'passed' };

        componentStore.setState(INIT_STATE);

        m.expect(componentStore.state$).toBeObservable(
          m.hot('i', { i: INIT_STATE })
        );
      })
    );

    it(
      'throws an Error when setState with a function/callback is called' +
        ' before initialization',
      marbles((m) => {
        const componentStore = new ComponentStore();

        m.expect(componentStore.state$).toBeObservable(
          m.hot(
            '#',
            {},
            new Error(
              'ComponentStore has not been initialized yet. ' +
                'Please make sure it is initialized before updating/getting.'
            )
          )
        );

        expect(() => {
          componentStore.setState(() => ({ setState: 'new state' }));
        }).toThrow(
          new Error(
            'ComponentStore has not been initialized yet. ' +
              'Please make sure it is initialized before updating/getting.'
          )
        );
      })
    );

    it('throws an Error when patchState with an object is called before initialization', () => {
      const componentStore = new ComponentStore();

      expect(() => {
        componentStore.patchState({ foo: 'bar' });
      }).toThrow(
        new Error(
          'ComponentStore has not been initialized yet. ' +
            'Please make sure it is initialized before updating/getting.'
        )
      );
    });

    it('throws an Error when patchState with Observable is called before initialization', () => {
      const componentStore = new ComponentStore();

      expect(() => {
        componentStore.patchState(of({ foo: 'bar' }));
      }).toThrow(
        new Error(
          'ComponentStore has not been initialized yet. ' +
            'Please make sure it is initialized before updating/getting.'
        )
      );
    });

    it(
      'throws an Error when patchState with a function/callback is called' +
        ' before initialization',
      () => {
        const componentStore = new ComponentStore();

        expect(() => {
          componentStore.patchState(() => ({ foo: 'bar' }));
        }).toThrow(
          new Error(
            'ComponentStore has not been initialized yet. ' +
              'Please make sure it is initialized before updating/getting.'
          )
        );
      }
    );

    it(
      'throws an Error when updater is called before initialization',
      marbles((m) => {
        const componentStore = new ComponentStore();

        m.expect(componentStore.state$).toBeObservable(
          m.hot(
            '#',
            {},
            new Error(
              'ComponentStore has not been initialized yet. ' +
                'Please make sure it is initialized before updating/getting.'
            )
          )
        );

        expect(() => {
          componentStore.updater((state, value: object) => value)({
            updater: 'new state',
          });
        }).toThrow(
          new Error(
            'ComponentStore has not been initialized yet. ' +
              'Please make sure it is initialized before updating/getting.'
          )
        );
      })
    );

    it(
      'throws an Error when updater is called with sync Observable' +
        ' before initialization',
      marbles((m) => {
        const componentStore = new ComponentStore();
        const syncronousObservable$ = of({
          updater: 'new state',
        });

        m.expect(componentStore.state$).toBeObservable(
          m.hot(
            '#',
            {},
            new Error(
              'ComponentStore has not been initialized yet. ' +
                'Please make sure it is initialized before updating/getting.'
            )
          )
        );

        expect(() => {
          componentStore.updater<object>((state, value) => value)(
            syncronousObservable$
          );
        }).toThrow(
          new Error(
            'ComponentStore has not been initialized yet. ' +
              'Please make sure it is initialized before updating/getting.'
          )
        );
      })
    );

    it(
      'does not throw an Error when updater is called with async Observable' +
        ' before initialization, however closes the subscription and does not' +
        ' update the state and sends error in state$',
      marbles((m) => {
        const componentStore = new ComponentStore();
        const asyncronousObservable$ = m.cold('-u', {
          u: { updater: 'new state' },
        });

        let subscription: Subscription | undefined;

        m.expect(componentStore.state$).toBeObservable(
          m.hot(
            '-#',
            {},
            new Error(
              'ComponentStore has not been initialized yet. ' +
                'Please make sure it is initialized before updating/getting.'
            )
          )
        );

        expect(() => {
          subscription = componentStore.updater(
            (state, value: object) => value
          )(asyncronousObservable$);
        }).not.toThrow();

        m.flush();

        expect(subscription!.closed).toBe(true);
      })
    );

    it(
      'does not throws an Error when updater is called with async Observable' +
        ' before initialization, that emits the value after initialization',
      marbles((m) => {
        const componentStore = new ComponentStore();
        const INIT_STATE = { initState: 'passed' };
        const UPDATED_STATE = { updatedState: 'proccessed' };

        // Record all the values that go through state$.
        const recordedStateValues$ = componentStore.state$.pipe(
          publishReplay()
        );
        // Need to "connect" to start getting notifications.
        (recordedStateValues$ as ConnectableObservable<object>).connect();

        const asyncronousObservable$ = of(UPDATED_STATE).pipe(
          // Delays until the state gets the init value.
          delayWhen(() => componentStore.state$)
        );

        expect(() => {
          componentStore.updater<object>((state, value) => value)(
            asyncronousObservable$
          );
        }).not.toThrow();

        // Trigger initial state.
        componentStore.setState(INIT_STATE);

        m.expect(recordedStateValues$).toBeObservable(
          m.hot('(iu)', { i: INIT_STATE, u: UPDATED_STATE })
        );
      })
    );
  });

  describe('updates the state', () => {
    interface State {
      value: string;
      updated?: boolean;
    }
    const INIT_STATE: State = { value: 'init' };
    let componentStore: ComponentStore<State>;

    beforeEach(() => {
      componentStore = new ComponentStore<State>(INIT_STATE);
    });

    it(
      'with setState to a specific value',
      marbles((m) => {
        const SET_STATE: State = { value: 'new state' };
        componentStore.setState(SET_STATE);
        m.expect(componentStore.state$).toBeObservable(
          m.hot('s', { s: SET_STATE })
        );
      })
    );

    it(
      'with setState to a value based on the previous state',
      marbles((m) => {
        const UPDATE_STATE: Partial<State> = { updated: true };
        componentStore.setState((state) => ({
          ...state,
          ...UPDATE_STATE,
        }));
        m.expect(componentStore.state$).toBeObservable(
          m.hot('u', {
            u: {
              value: 'init',
              updated: true,
            },
          })
        );
      })
    );

    it(
      'with updater to a value based on the previous state and passed values',
      marbles((m) => {
        const UPDATED: Partial<State> = { updated: true };
        const UPDATE_VALUE: Partial<State> = { value: 'updated' };
        const updater = componentStore.updater(
          (state, value: Partial<State>) => ({
            ...state,
            ...value,
          })
        );

        // Record all the values that go through state$ into an array
        const results: object[] = [];
        componentStore.state$.subscribe((state) => results.push(state));

        // Update twice with different values
        updater(UPDATED);
        m.flush(); // flushed after each update
        updater(UPDATE_VALUE);
        m.flush(); // flushed after each update

        expect(results).toEqual([
          { value: 'init' },
          {
            value: 'init',
            updated: true,
          },
          {
            value: 'updated',
            updated: true,
          },
        ]);

        // New subsriber gets the latest value only.
        m.expect(componentStore.state$).toBeObservable(
          m.hot('s', {
            s: {
              value: 'updated',
              updated: true,
            },
          })
        );
      })
    );

    it(
      'with multiple values within the same microtask',
      marbles((m) => {
        const UPDATED: Partial<State> = { updated: true };
        const UPDATE_VALUE: Partial<State> = { value: 'updated' };
        const updater = componentStore.updater(
          (state, value: Partial<State>) => ({
            ...state,
            ...value,
          })
        );

        // Record all the values that go through state$ into an array
        const results: object[] = [];
        componentStore.state$.subscribe((state) => results.push(state));

        // Update twice with different values
        updater(UPDATED);
        updater(UPDATE_VALUE);

        // 👆👆👆
        // Notice there is no "flush" until this point - all synchronous
        m.flush();

        expect(results).toEqual([
          { value: 'init' },
          { value: 'init', updated: true },
          {
            value: 'updated',
            updated: true,
          },
        ]);

        // New subsriber gets the latest value only.
        m.expect(componentStore.state$).toBeObservable(
          m.hot('s', {
            s: {
              value: 'updated',
              updated: true,
            },
          })
        );
      })
    );

    it(
      'with updater to a value based on the previous state and passed' +
        ' Observable',
      marbles((m) => {
        const updater = componentStore.updater(
          (state, value: Partial<State>) => ({
            ...state,
            ...value,
          })
        );

        // Record all the values that go through state$.
        const recordedStateValues$ = componentStore.state$.pipe(
          publishReplay()
        );
        // Need to "connect" to start getting notifications.
        (recordedStateValues$ as ConnectableObservable<object>).connect();

        // Update with Observable.
        updater(
          m.cold('--u--s|', {
            u: { updated: true },
            s: { value: 'updated' },
          })
        );

        m.expect(recordedStateValues$).toBeObservable(
          m.hot('i-u--s', {
            // First value is here due to ReplaySubject being at the heart of
            // ComponentStore.
            i: {
              value: 'init',
            },
            u: {
              value: 'init',
              updated: true,
            },
            s: {
              value: 'updated',
              updated: true,
            },
          })
        );
      })
    );
  });

  describe('cancels updater Observable', () => {
    beforeEach(() => jest.useFakeTimers());

    interface State {
      value: string;
      updated?: boolean;
    }
    const INIT_STATE: State = { value: 'init' };
    let componentStore: ComponentStore<State>;

    beforeEach(() => {
      componentStore = new ComponentStore<State>(INIT_STATE);
    });

    it(
      'by unsubscribing with returned Subscriber',
      fakeSchedulers((advance) => {
        const updater = componentStore.updater(
          (state, value: Partial<State>) => ({
            ...state,
            ...value,
          })
        );

        // Record all the values that go through state$ into an array
        const results: State[] = [];
        componentStore.state$.subscribe((state) => results.push(state));

        // Update with Observable.
        const subscription = updater(
          interval(10).pipe(
            map((v) => ({ value: String(v) })),
            take(10) // just in case
          )
        );

        // Advance for 40 fake milliseconds and unsubscribe - should capture
        // from '0' to '3'
        advance(40);
        subscription.unsubscribe();

        // Advance for 20 more fake milliseconds, to check if anything else
        // is captured
        advance(20);

        expect(results).toEqual([
          // First value is here due to ReplaySubject being at the heart of
          // ComponentStore.
          { value: 'init' },
          { value: '0' },
          { value: '1' },
          { value: '2' },
          { value: '3' },
        ]);
      })
    );

    it(
      'and cancels the correct one',
      fakeSchedulers((advance) => {
        const updater = componentStore.updater(
          (state, value: Partial<State>) => ({
            ...state,
            ...value,
          })
        );

        // Record all the values that go through state$ into an array
        const results: State[] = [];
        componentStore.state$.subscribe((state) => results.push(state));

        // Update with Observable.
        const subscription = updater(
          interval(10).pipe(
            map((v) => ({ value: 'a' + v })),
            take(10) // just in case
          )
        );

        // Create the second Observable that updates the state
        updater(
          timer(15, 10).pipe(
            map((v) => ({ value: 'b' + v })),
            take(10)
          )
        );

        // Advance for 40 fake milliseconds and unsubscribe - should capture
        // from '0' to '3'
        advance(40);
        subscription.unsubscribe();

        // Advance for 30 more fake milliseconds, to make sure that second
        // Observable still emits
        advance(30);

        expect(results).toEqual([
          // First value is here due to ReplaySubject being at the heart of
          // ComponentStore.
          { value: 'init' },
          { value: 'a0' },
          { value: 'b0' },
          { value: 'a1' },
          { value: 'b1' },
          { value: 'a2' },
          { value: 'b2' },
          { value: 'a3' },
          { value: 'b3' },
          { value: 'b4' },
          { value: 'b5' }, // second Observable continues to emit values
        ]);
      })
    );
  });

  describe('patches the state', () => {
    interface State {
      value1: string;
      value2: { foo: string };
    }
    const INIT_STATE: State = { value1: 'value1', value2: { foo: 'bar' } };
    let componentStore: ComponentStore<State>;

    beforeEach(() => {
      componentStore = new ComponentStore(INIT_STATE);
    });

    it(
      'with a specific value',
      marbles((m) => {
        componentStore.patchState({ value1: 'val1' });

        m.expect(componentStore.state$).toBeObservable(
          m.hot('s', {
            s: { ...INIT_STATE, value1: 'val1' },
          })
        );
      })
    );

    it(
      'with the values from Observable',
      marbles((m) => {
        componentStore.patchState(
          from([
            { value1: 'foo' },
            { value2: { foo: 'foo2' } },
            { value1: 'baz' },
          ]).pipe(concatMap((partialState) => of(partialState).pipe(delay(3))))
        );

        m.expect(componentStore.state$).toBeObservable(
          m.hot('a--b--c--d', {
            a: INIT_STATE,
            b: { ...INIT_STATE, value1: 'foo' },
            c: { value1: 'foo', value2: { foo: 'foo2' } },
            d: { value1: 'baz', value2: { foo: 'foo2' } },
          })
        );
      })
    );

    it(
      'with a value based on the previous state',
      marbles((m) => {
        componentStore.patchState((state) => ({
          value2: { foo: `${state.value2.foo}2` },
        }));

        m.expect(componentStore.state$).toBeObservable(
          m.hot('s', {
            s: { ...INIT_STATE, value2: { foo: 'bar2' } },
          })
        );
      })
    );
  });

  describe('selector', () => {
    interface State {
      value: string;
      updated?: boolean;
    }

    const INIT_STATE: State = { value: 'init' };
    let componentStore: ComponentStore<State>;

    beforeEach(() => {
      componentStore = new ComponentStore<State>(INIT_STATE);
    });

    it(
      'uninitialized Component Store does not emit values',
      marbles((m) => {
        const uninitializedComponentStore = new ComponentStore();
        m.expect(uninitializedComponentStore.select((s) => s)).toBeObservable(
          m.hot('-')
        );
      })
    );

    it(
      'selects component root state',
      marbles((m) => {
        m.expect(componentStore.select((s) => s)).toBeObservable(
          m.hot('i', { i: INIT_STATE })
        );
      })
    );

    it(
      'selects component property from the state',
      marbles((m) => {
        m.expect(componentStore.select((s) => s.value)).toBeObservable(
          m.hot('i', { i: INIT_STATE.value })
        );
      })
    );

    it('reads the values synchronously', () => {
      const selector = componentStore.select((s) => s.value);
      let result: string;

      // Initial value is available
      selector.subscribe((v) => (result = v)).unsubscribe();

      expect(result!).toBe('init');

      // overwritten state
      componentStore.setState({ value: 'setState update' });
      selector.subscribe((v) => (result = v)).unsubscribe();

      expect(result!).toBe('setState update');

      // with setState callback
      componentStore.setState((state) => ({
        value: state.value + ' adjusted',
      }));
      selector.subscribe((v) => (result = v)).unsubscribe();

      expect(result!).toBe('setState update adjusted');

      // with updater
      componentStore.updater((state, value: string) => ({ value }))(
        'updater value'
      );
      selector.subscribe((v) => (result = v)).unsubscribe();

      expect(result!).toBe('updater value');

      // with updater and sync Observable
      componentStore.updater((state, value: string) => ({ value }))(
        of('updater observable value')
      );
      selector.subscribe((v) => (result = v)).unsubscribe();

      expect(result!).toBe('updater observable value');
    });

    it('can be combined with other selectors', () => {
      const selector1 = componentStore.select((s) => s.value);
      const selector2 = componentStore.select((s) => s.updated);
      const selector3 = componentStore.select(
        selector1,
        selector2,
        // Returning an object to make sure that distinctUntilChanged does
        // not hold it
        (s1, s2) => ({ result: s2 ? s1 : 'empty' })
      );

      const selectorResults: Array<{ result: string }> = [];
      selector3.subscribe((s3) => {
        selectorResults.push(s3);
      });

      componentStore.setState(() => ({ value: 'new value', updated: true }));

      expect(selectorResults).toEqual([
        { result: 'empty' },
        { result: 'empty' }, // both "value" and "updated" are changed
        { result: 'new value' },
      ]);
    });

    it(
      'can combine with other Observables',
      marbles((m) => {
        const observableValues = {
          '1': 'one',
          '2': 'two',
          '3': 'three',
        };

        const observable$ = m.hot('      1----2---3', observableValues);
        const updater$ = m.cold('        a-----b--c|');
        const expectedSelector$ = m.hot('(uv)-wx--(yz)-', {
          u: 'one init', // 👈 includes initial value
          v: 'one a',
          w: 'two a',
          x: 'two b',
          y: 'three b', // 👈 no debounce
          z: 'three c',
        });

        const selectorValue$ = componentStore.select((s) => s.value);
        const selector$ = componentStore.select(
          selectorValue$,
          observable$,
          (s1, o) => o + ' ' + s1
        );

        componentStore.updater((state, newValue: string) => ({
          value: newValue,
        }))(updater$);

        m.expect(selector$).toBeObservable(expectedSelector$);
      })
    );

    it(
      'would emit a value whenever any of selectors produce values',
      marbles((m) => {
        const s1$ = componentStore.select((s) => `fromS1(${s.value})`);
        const s2$ = componentStore.select((s) => `fromS2(${s.value})`);
        const s3$ = componentStore.select((s) => `fromS3(${s.value})`);
        const s4$ = componentStore.select((s) => `fromS4(${s.value})`);

        const selector$ = componentStore.select(
          s1$,
          s2$,
          s3$,
          s4$,
          (s1, s2, s3, s4) => `${s1} & ${s2} & ${s3} & ${s4}`
        );

        const updater$ = m.cold('        -----e-|');
        const expectedSelector$ = m.hot('i----(abcd)--', {
          //                     initial👆    👆 emits multiple times
          i: 'fromS1(init) & fromS2(init) & fromS3(init) & fromS4(init)',
          a: 'fromS1(e) & fromS2(init) & fromS3(init) & fromS4(init)',
          b: 'fromS1(e) & fromS2(e) & fromS3(init) & fromS4(init)',
          c: 'fromS1(e) & fromS2(e) & fromS3(e) & fromS4(init)',
          d: 'fromS1(e) & fromS2(e) & fromS3(e) & fromS4(e)',
        });

        componentStore.updater((_, newValue: string) => ({
          value: newValue,
        }))(updater$);

        m.expect(selector$).toBeObservable(expectedSelector$);
      })
    );

    it(
      'can combine with Observables that complete',
      marbles((m) => {
        const observableValues = {
          '1': 'one',
          '2': 'two',
          '3': 'three',
        };

        const observable$ = m.hot('      1----2---3|', observableValues);
        const updater$ = m.cold('        a-----b--c|');
        const expectedSelector$ = m.hot('(uv)-wx--(yz)-', {
          u: 'one init', // 👈 includes initial value
          v: 'one a',
          w: 'two a',
          x: 'two b',
          y: 'three b', // 👈 no debounce
          z: 'three c',
        });

        const selectorValue$ = componentStore.select((s) => s.value);
        const selector$ = componentStore.select(
          selectorValue$,
          observable$,
          (s1, o) => o + ' ' + s1
        );

        componentStore.updater((state, newValue: string) => ({
          value: newValue,
        }))(updater$);

        m.expect(selector$).toBeObservable(expectedSelector$);
      })
    );

    it(
      'does not emit the same value if it did not change',
      marbles((m) => {
        const selector1 = componentStore.select((s) => s.value);
        const selector2 = componentStore.select((s) => s.updated);
        const selector3 = componentStore.select(
          selector1,
          selector2,
          // returning the same value, which should be caught by
          // distinctUntilChanged
          () => 'selector3 result'
        );

        const selectorResults: string[] = [];
        selector3.subscribe((s3) => {
          selectorResults.push(s3);
        });

        m.flush();
        componentStore.setState(() => ({ value: 'new value', updated: true }));

        m.flush();
        expect(selectorResults).toEqual(['selector3 result']);
      })
    );

    it(
      'are shared between subscribers',
      marbles((m) => {
        const projectorCallback = jest.fn((s) => s.value);
        const selector = componentStore.select(projectorCallback);

        const resultsArray: string[] = [];
        selector.subscribe((value) =>
          resultsArray.push('subscriber1: ' + value)
        );
        selector.subscribe((value) =>
          resultsArray.push('subscriber2: ' + value)
        );

        m.flush();
        componentStore.setState(() => ({ value: 'new value', updated: true }));
        m.flush();

        // Even though we have 2 subscribers for 2 values, the projector
        // function is called only twice - once for each new value.
        expect(projectorCallback.mock.calls.length).toBe(2);
      })
    );

    it('complete when componentStore is destroyed', (doneFn: jest.DoneCallback) => {
      const selector = componentStore.select(() => ({}));

      selector.subscribe({
        complete: () => {
          doneFn();
        },
      });

      componentStore.ngOnDestroy();
    });
  });

  describe('selector with debounce', () => {
    interface State {
      value: string;
      updated?: boolean;
    }

    const INIT_STATE: State = { value: 'init' };
    let componentStore: ComponentStore<State>;

    beforeEach(() => {
      componentStore = new ComponentStore<State>(INIT_STATE);
    });

    it(
      'uninitialized Component Store does not emit values',
      marbles((m) => {
        const uninitializedComponentStore = new ComponentStore();
        m.flush();
        m.expect(
          uninitializedComponentStore.select((s) => s, { debounce: true })
        ).toBeObservable(m.hot('-'));
      })
    );

    it(
      'selects component root state',
      marbles((m) => {
        m.flush();
        m.expect(
          componentStore.select((s) => s, { debounce: true })
        ).toBeObservable(m.hot('i', { i: INIT_STATE }));
      })
    );

    it(
      'selects component property from the state',
      marbles((m) => {
        m.flush();
        m.expect(
          componentStore.select((s) => s.value, { debounce: true })
        ).toBeObservable(m.hot('i', { i: INIT_STATE.value }));
      })
    );

    it(
      'reads the values asynchronously',
      marbles((m) => {
        const selector = componentStore.select((s) => s.value, {
          debounce: true,
        });
        let result: string | undefined;
        let sub: Subscription;

        // Initial value is available
        sub = selector.subscribe((v) => (result = v));
        expect(result).toBe(undefined);
        m.flush();
        sub.unsubscribe();

        expect(result!).toBe('init');
        result = undefined;

        // overwritten state
        componentStore.setState({ value: 'setState update' });
        sub = selector.subscribe((v) => (result = v));
        expect(result).toBe(undefined);
        m.flush();
        sub.unsubscribe();

        expect(result).toBe('setState update');
        result = undefined;

        // with setState callback
        componentStore.setState((state) => ({
          value: state.value + ' adjusted',
        }));
        sub = selector.subscribe((v) => (result = v));
        expect(result).toBe(undefined);
        m.flush();
        sub.unsubscribe();

        expect(result!).toBe('setState update adjusted');
        result = undefined;

        // with updater
        componentStore.updater((state, value: string) => ({ value }))(
          'updater value'
        );
        sub = selector.subscribe((v) => (result = v));
        expect(result).toBe(undefined);
        m.flush();
        sub.unsubscribe();

        expect(result!).toBe('updater value');
        result = undefined;

        // with updater and sync Observable
        componentStore.updater((state, value: string) => ({ value }))(
          of('updater observable value')
        );
        sub = selector.subscribe((v) => (result = v));
        expect(result).toBe(undefined);
        m.flush();
        sub.unsubscribe();

        expect(result!).toBe('updater observable value');
      })
    );

    it(
      'can be combined with other selectors',
      marbles((m) => {
        const selector1 = componentStore.select((s) => s.value);
        const selector2 = componentStore.select((s) => s.updated);
        const selector3 = componentStore.select(
          selector1,
          selector2,
          // Returning an object to make sure that distinctUntilChanged does
          // not hold it
          (s1, s2) => ({ result: s2 ? s1 : 'empty' }),
          { debounce: true }
        );

        const selectorResults: Array<{ result: string }> = [];
        selector3.subscribe((s3) => {
          selectorResults.push(s3);
        });

        componentStore.setState(() => ({ value: 'new value', updated: true }));
        m.flush();

        expect(selectorResults).toEqual([
          { result: 'empty' },
          { result: 'new value' },
        ]);
      })
    );

    it(
      'can combine with other Observables',
      marbles((m) => {
        const observableValues = {
          '1': 'one',
          '2': 'two',
          '3': 'three',
        };

        const observable$ = m.hot('      1-2---3', observableValues);
        const updater$ = m.cold('        a--b--c|');
        const expectedSelector$ = m.hot('w-xy--z-', {
          w: 'one a',
          x: 'two a',
          y: 'two b',
          // 'three b', // 👈 with debounce
          z: 'three c',
        });

        const selectorValue$ = componentStore.select((s) => s.value);
        const selector$ = componentStore.select(
          selectorValue$,
          observable$,
          (s1, o) => o + ' ' + s1,
          { debounce: true }
        );

        componentStore.updater((state, newValue: string) => ({
          value: newValue,
        }))(updater$);

        m.expect(selector$).toBeObservable(expectedSelector$);
      })
    );

    it(
      'would emit a single value even when all 4 selectors produce values',
      marbles((m) => {
        const s1$ = componentStore.select((s) => `fromS1(${s.value})`);
        const s2$ = componentStore.select((s) => `fromS2(${s.value})`);
        const s3$ = componentStore.select((s) => `fromS3(${s.value})`);
        const s4$ = componentStore.select((s) => `fromS4(${s.value})`);

        const selector$ = componentStore.select(
          s1$,
          s2$,
          s3$,
          s4$,
          (s1, s2, s3, s4) => `${s1} & ${s2} & ${s3} & ${s4}`,
          { debounce: true }
        );

        const updater$ = m.cold('        -----e-|');
        const expectedSelector$ = m.hot('i----c--', {
          //                     initial👆   👆 combined single value
          i: 'fromS1(init) & fromS2(init) & fromS3(init) & fromS4(init)',
          c: 'fromS1(e) & fromS2(e) & fromS3(e) & fromS4(e)',
        });

        componentStore.updater((_, newValue: string) => ({
          value: newValue,
        }))(updater$);

        m.expect(selector$).toBeObservable(expectedSelector$);
      })
    );

    it(
      'can combine with Observables that complete',
      marbles((m) => {
        const observableValues = {
          '1': 'one',
          '2': 'two',
          '3': 'three',
        };

        const observable$ = m.hot('      1-2---3', observableValues);
        const updater$ = m.cold('        a--b--c|');
        const expectedSelector$ = m.hot('w-xy--z-', {
          w: 'one a',
          x: 'two a',
          y: 'two b',
          z: 'three c',
        });

        const selectorValue$ = componentStore.select((s) => s.value);
        const selector$ = componentStore.select(
          selectorValue$,
          observable$,
          (s1, o) => o + ' ' + s1,
          { debounce: true }
        );

        componentStore.updater((state, newValue: string) => ({
          value: newValue,
        }))(updater$);

        m.expect(selector$).toBeObservable(expectedSelector$);
      })
    );

    it(
      'does not emit the same value if it did not change',
      marbles((m) => {
        const selector1 = componentStore.select((s) => s.value);
        const selector2 = componentStore.select((s) => s.updated);
        const selector3 = componentStore.select(
          selector1,
          selector2,
          // returning the same value, which should be caught by
          // distinctUntilChanged
          () => 'selector3 result',
          { debounce: true }
        );

        const selectorResults: string[] = [];
        selector3.subscribe((s3) => {
          selectorResults.push(s3);
        });

        m.flush();
        componentStore.setState(() => ({ value: 'new value', updated: true }));

        m.flush();
        expect(selectorResults).toEqual(['selector3 result']);
      })
    );

    it(
      'are shared between subscribers',
      marbles((m) => {
        const projectorCallback = jest.fn((s) => s.value);
        const selector = componentStore.select(projectorCallback, {
          debounce: true,
        });

        const resultsArray: string[] = [];
        selector.subscribe((value) =>
          resultsArray.push('subscriber1: ' + value)
        );
        selector.subscribe((value) =>
          resultsArray.push('subscriber2: ' + value)
        );

        m.flush();
        componentStore.setState(() => ({ value: 'new value', updated: true }));
        m.flush();

        // Even though we have 2 subscribers for 2 values, the projector
        // function is called only twice - once for each new value.
        expect(projectorCallback.mock.calls.length).toBe(2);
      })
    );

    it('complete when componentStore is destroyed', (doneFn: jest.DoneCallback) => {
      const selector = componentStore.select(() => ({}), { debounce: true });

      selector.subscribe({
        complete: () => {
          doneFn();
        },
      });

      componentStore.ngOnDestroy();
    });
  });

  describe('effect', () => {
    let componentStore: ComponentStore<object>;

    beforeEach(() => {
      componentStore = new ComponentStore<object>();
    });

    it(
      'is run when value is provided',
      marbles((m) => {
        const results: string[] = [];
        const mockGenerator = jest.fn((origin$: Observable<string>) =>
          origin$.pipe(tap((v) => results.push(v)))
        );
        const effect = componentStore.effect(mockGenerator);
        effect('value 1');
        effect('value 2');

        expect(results).toEqual(['value 1', 'value 2']);
      })
    );

    it(
      'is run when undefined value is provided',
      marbles((m) => {
        const results: string[] = [];
        const mockGenerator = jest.fn((origin$: Observable<undefined>) =>
          origin$.pipe(tap((v) => results.push(typeof v)))
        );
        const effect = componentStore.effect(mockGenerator);
        effect();
        effect();

        expect(results).toEqual(['undefined', 'undefined']);
      })
    );

    it(
      'is run when observable is provided',
      marbles((m) => {
        const mockGenerator = jest.fn((origin$) => origin$);
        const effect = componentStore.effect<string>(mockGenerator);

        effect(m.cold('-a-b-c|'));

        m.expect(mockGenerator.mock.calls[0][0]).toBeObservable(
          m.hot('      -a-b-c-')
        );
      })
    );
    it(
      'is run with multiple Observables',
      marbles((m) => {
        const mockGenerator = jest.fn((origin$) => origin$);
        const effect = componentStore.effect<string>(mockGenerator);

        effect(m.cold('-a-b-c|'));
        effect(m.hot(' --d--e----f-'));

        m.expect(mockGenerator.mock.calls[0][0]).toBeObservable(
          m.hot('      -adb-(ce)-f-')
        );
      })
    );

    describe('cancels effect Observable', () => {
      beforeEach(() => jest.useFakeTimers());
      it(
        'by unsubscribing with returned Subscription',
        fakeSchedulers((advance) => {
          const results: string[] = [];
          const effect = componentStore.effect((origin$: Observable<string>) =>
            origin$.pipe(tap((v) => results.push(v)))
          );

          const observable$ = interval(10).pipe(
            map((v) => String(v)),
            take(10) // just in case
          );

          // Update with Observable.
          const subscription = effect(observable$);

          // Advance for 40 fake milliseconds and unsubscribe - should capture
          // from '0' to '3'
          advance(40);
          subscription.unsubscribe();

          // Advance for 20 more fake milliseconds, to check if anything else
          // is captured
          advance(20);

          expect(results).toEqual(['0', '1', '2', '3']);
        })
      );
      it(
        'could be unsubscribed from the specific Observable when multiple' +
          ' are provided',
        fakeSchedulers((advance) => {
          // Record all the values that go through state$ into an array
          const results: Array<{ value: string }> = [];
          const effect = componentStore.effect(
            (origin$: Observable<{ value: string }>) =>
              origin$.pipe(tap((v) => results.push(v)))
          );

          // Pass the first Observable to the effect.
          const subscription = effect(
            interval(10).pipe(
              map((v) => ({ value: 'a' + v })),
              take(10) // just in case
            )
          );

          // Pass the second Observable that pushes values to effect
          effect(
            timer(15, 10).pipe(
              map((v) => ({ value: 'b' + v })),
              take(10)
            )
          );

          // Advance for 40 fake milliseconds and unsubscribe - should capture
          // from '0' to '3'
          advance(40);
          subscription.unsubscribe();

          // Advance for 30 more fake milliseconds, to make sure that second
          // Observable still emits
          advance(30);

          expect(results).toEqual([
            { value: 'a0' },
            { value: 'b0' },
            { value: 'a1' },
            { value: 'b1' },
            { value: 'a2' },
            { value: 'b2' },
            { value: 'a3' },
            { value: 'b3' },
            { value: 'b4' },
            { value: 'b5' }, // second Observable continues to emit values
          ]);
        })
      );

      it('completes when componentStore is destroyed', (doneFn: jest.DoneCallback) => {
        componentStore.effect((origin$: Observable<number>) =>
          origin$.pipe(
            finalize(() => {
              doneFn();
            })
          )
        )(interval(10));

        setTimeout(() => componentStore.ngOnDestroy(), 20);
        jest.advanceTimersByTime(20);
      });

      it('observable argument completes when componentStore is destroyed', (doneFn: jest.DoneCallback) => {
        componentStore.effect((origin$: Observable<number>) => origin$)(
          interval(10).pipe(
            finalize(() => {
              doneFn();
            })
          )
        );

        setTimeout(() => componentStore.ngOnDestroy(), 20);

        jest.advanceTimersByTime(20);
      });
    });
  });

  describe('get', () => {
    interface State {
      value: string;
    }

    class ExposedGetComponentStore extends ComponentStore<State> {
      get = super.get;
    }

    let componentStore: ExposedGetComponentStore;

    it('throws an Error if called before the state is initialized', () => {
      componentStore = new ExposedGetComponentStore();

      expect(() => {
        componentStore.get((state) => state.value);
      }).toThrow(
        new Error(
          'ExposedGetComponentStore has not been initialized yet. ' +
            'Please make sure it is initialized before updating/getting.'
        )
      );
    });

    it('does not throw an Error when initialized', () => {
      componentStore = new ExposedGetComponentStore();
      componentStore.setState({ value: 'init' });

      expect(() => {
        componentStore.get((state) => state.value);
      }).not.toThrow();
    });

    it('provides values from the state', () => {
      componentStore = new ExposedGetComponentStore();
      componentStore.setState({ value: 'init' });

      expect(componentStore.get((state) => state.value)).toBe('init');

      componentStore.updater((state, value: string) => ({ value }))('updated');

      expect(componentStore.get((state) => state.value)).toBe('updated');
    });

    it('provides the entire state when projector fn is not provided', () => {
      componentStore = new ExposedGetComponentStore();
      componentStore.setState({ value: 'init' });

      expect(componentStore.get()).toEqual({ value: 'init' });

      componentStore.updater((state, value: string) => ({ value }))('updated');

      expect(componentStore.get()).toEqual({ value: 'updated' });
    });
  });
});
