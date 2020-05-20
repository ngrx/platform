import { ComponentStore } from '@ngrx/component-store';
import { fakeSchedulers, marbles } from 'rxjs-marbles/jest';
import { of, Subscription, ConnectableObservable, interval, timer } from 'rxjs';
import { delayWhen, publishReplay, take, map } from 'rxjs/operators';

describe('Component Store', () => {
  describe('initialization', () => {
    it(
      'through constructor',
      marbles(m => {
        const INIT_STATE = { init: 'state' };
        const componentStore = new ComponentStore(INIT_STATE);

        m.expect(componentStore.state$).toBeObservable(
          m.hot('i', { i: INIT_STATE })
        );
      })
    );

    it(
      'stays uninitialized if initial state is not provided',
      marbles(m => {
        const componentStore = new ComponentStore();

        // No values emitted.
        m.expect(componentStore.state$).toBeObservable(m.hot('-'));
      })
    );

    it(
      'through setState method',
      marbles(m => {
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
      marbles(m => {
        const componentStore = new ComponentStore();

        m.expect(componentStore.state$).toBeObservable(
          m.hot('#', {}, new Error('ComponentStore has not been initialized'))
        );

        expect(() => {
          componentStore.setState(() => ({ setState: 'new state' }));
        }).toThrow(new Error('ComponentStore has not been initialized'));
      })
    );

    it(
      'throws an Error when updater is called before initialization',
      marbles(m => {
        const componentStore = new ComponentStore();

        m.expect(componentStore.state$).toBeObservable(
          m.hot('#', {}, new Error('ComponentStore has not been initialized'))
        );

        expect(() => {
          componentStore.updater((state, value: object) => value)({
            updater: 'new state',
          });
        }).toThrow(new Error('ComponentStore has not been initialized'));
      })
    );

    it(
      'throws an Error when updater is called with sync Observable' +
        ' before initialization',
      marbles(m => {
        const componentStore = new ComponentStore();
        const syncronousObservable$ = of({
          updater: 'new state',
        });

        m.expect(componentStore.state$).toBeObservable(
          m.hot('#', {}, new Error('ComponentStore has not been initialized'))
        );

        expect(() => {
          componentStore.updater<object>((state, value) => value)(
            syncronousObservable$
          );
        }).toThrow(new Error('ComponentStore has not been initialized'));
      })
    );

    it(
      'does not throw an Error when updater is called with async Observable' +
        ' before initialization, however closes the subscription and does not' +
        ' update the state and sends error in state$',
      marbles(m => {
        const componentStore = new ComponentStore();
        const asyncronousObservable$ = m.cold('-u', {
          u: { updater: 'new state' },
        });

        let subscription: Subscription | undefined;

        m.expect(componentStore.state$).toBeObservable(
          m.hot('-#', {}, new Error('ComponentStore has not been initialized'))
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
      () => {
        const componentStore = new ComponentStore();
        const INIT_STATE = { initState: 'passed' };
        const UPDATED_STATE = { updatedState: 'proccessed' };

        // Record all the values that go through state$ into an array
        const results: object[] = [];
        componentStore.state$.subscribe(state => results.push(state));

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

        expect(results).toEqual([INIT_STATE, UPDATED_STATE, UPDATED_STATE]);
      }
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
      marbles(m => {
        const SET_STATE: State = { value: 'new state' };
        componentStore.setState(SET_STATE);
        m.expect(componentStore.state$).toBeObservable(
          m.hot('s', { s: SET_STATE })
        );
      })
    );

    it(
      'with setState to a value based on the previous state',
      marbles(m => {
        const UPDATE_STATE: Partial<State> = { updated: true };
        componentStore.setState(state => ({
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
      marbles(m => {
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
        componentStore.state$.subscribe(state => results.push(state));

        // Update twice with different values
        updater(UPDATED);
        updater(UPDATE_VALUE);

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
      'with updater to a value based on the previous state and passed' +
        ' Observable',
      marbles(m => {
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
      fakeSchedulers(advance => {
        const updater = componentStore.updater(
          (state, value: Partial<State>) => ({
            ...state,
            ...value,
          })
        );

        // Record all the values that go through state$ into an array
        const results: State[] = [];
        componentStore.state$.subscribe(state => results.push(state));

        // Update with Observable.
        const subsription = updater(
          interval(10).pipe(
            map(v => ({ value: String(v) })),
            take(10) // just in case
          )
        );

        // Advance for 40 fake milliseconds and unsubscribe - should capture
        // from '0' to '3'
        advance(40);
        subsription.unsubscribe();

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
      fakeSchedulers(advance => {
        const updater = componentStore.updater(
          (state, value: Partial<State>) => ({
            ...state,
            ...value,
          })
        );

        // Record all the values that go through state$ into an array
        const results: State[] = [];
        componentStore.state$.subscribe(state => results.push(state));

        // Update with Observable.
        const subsription = updater(
          interval(10).pipe(
            map(v => ({ value: 'a' + v })),
            take(10) // just in case
          )
        );

        // Create the second Observable that updates the state
        updater(
          timer(15, 10).pipe(
            map(v => ({ value: 'b' + v })),
            take(10)
          )
        );

        // Advance for 40 fake milliseconds and unsubscribe - should capture
        // from '0' to '3'
        advance(40);
        subsription.unsubscribe();

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
});
