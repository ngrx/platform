import { TestBed } from '@angular/core/testing';
import {
  getState,
  PartialStateUpdater,
  signalStore,
  type,
  withState,
} from '@ngrx/signals';
import { Dispatcher, event, on, withReducer } from '../src';
import { createLocalService } from '../../spec/helpers';

describe('withReducer', () => {
  it('updates the state with a partial state object', () => {
    const set = event('set', type<number>());

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 10, count2: 0 }),
      withReducer(on(set, ({ payload }) => ({ count: payload })))
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(set(20));

    expect(getState(store)).toEqual({ count: 20, count2: 0 });
  });

  it('updates the state with a partial state updater', () => {
    const increment = event('increment');

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 10, count2: 0 }),
      withReducer(
        on(increment, () => ({ count }) => ({ count: count + 1 }))
      )
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(increment());

    expect(getState(store)).toEqual({ count: 11, count2: 0 });
  });

  it('updates the state with an array of partial state objects and updaters', () => {
    const set2 = event('set2', type<{ count2: number }>());

    function incrementCount(): PartialStateUpdater<{ count: number }> {
      return ({ count }) => ({ count: count + 1 });
    }

    function setCount2(count2: number): { count2: number } {
      return { count2 };
    }

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 0, count2: 0 }),
      withReducer(
        on(set2, ({ payload: { count2 } }) => [
          { count: 1 },
          incrementCount(),
          setCount2(count2),
          (s) => ({ count2: s.count2 + 1 }),
        ])
      )
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(set2({ count2: 10 }));

    expect(getState(store)).toEqual({ count: 2, count2: 11 });
  });

  it('has access to the current state', () => {
    const incrementBy = event('incrementBy', type<number>());

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 10, count2: 0 }),
      withReducer(
        on(incrementBy, ({ payload }, state) => ({
          count: state.count + payload,
        }))
      )
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(incrementBy(20));

    expect(getState(store)).toEqual({ count: 30, count2: 0 });
  });

  it('allows listening to multiple events', () => {
    const set = event('set', type<number>());
    const set_ = event('set_', type<number>());

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 0, count2: 0 }),
      withReducer(on(set, set_, ({ payload }) => ({ count: payload })))
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(set(10));
    expect(getState(store)).toEqual({ count: 10, count2: 0 });

    dispatcher.dispatch(set(100));
    expect(getState(store)).toEqual({ count: 100, count2: 0 });
  });

  it('provides an intersection of the payload when listening to multiple events', () => {
    const e1 = event('e1', type<number>());
    const e2 = event('e2', type<{ numbers: number[] }>());

    let e1Payload = 0;
    let e2Payload: number[] = [];

    const Store = signalStore(
      { providedIn: 'root' },
      withReducer(
        on(e1, e2, (event) => {
          if (event.type === 'e1') {
            e1Payload = event.payload;
          } else {
            e2Payload = event.payload.numbers;
          }

          return {};
        })
      )
    );

    TestBed.inject(Store);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(e1(10));
    expect(e1Payload).toBe(10);

    dispatcher.dispatch(e2({ numbers: [1, 2, 3] }));
    expect(e2Payload).toEqual([1, 2, 3]);
  });

  it('allows listening to the same event in multiple case reducers', () => {
    const set2 = event('set2', type<{ count2: number }>());

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 10, count2: 10 }),
      withReducer(
        on(set2, ({ payload: { count2 } }) => ({ count2 })),
        on(set2, () => ({ count: 0 }))
      )
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(set2({ count2: 100 }));
    expect(getState(store)).toEqual({ count: 0, count2: 100 });
  });

  it('unsubscribes from events when the store is destroyed', () => {
    const trigger = event('trigger');
    let executionCount = 0;

    const Store = signalStore(
      withReducer(
        on(trigger, () => {
          executionCount++;
          return {};
        })
      )
    );

    const { destroy } = createLocalService(Store);
    const dispatcher = TestBed.inject(Dispatcher);

    expect(executionCount).toBe(0);

    dispatcher.dispatch(trigger());
    expect(executionCount).toBe(1);

    destroy();

    dispatcher.dispatch(trigger());
    expect(executionCount).toBe(1);
  });
});
