import { TestBed } from '@angular/core/testing';
import {
  getState,
  PartialStateUpdater,
  signalStore,
  withState,
} from '@ngrx/signals';
import { Dispatcher, eventCreator, on, props, withReducer } from '../src';
import { createLocalService } from '../../spec/helpers';

describe('withReducer', () => {
  it('updates the state with a partial state object', () => {
    const incrementBy = eventCreator('incrementBy', props<{ by: number }>());

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 10, count2: 0 }),
      withReducer(
        on(incrementBy, ({ by }, state) => ({ count: state.count + by }))
      )
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(incrementBy({ by: 10 }));

    expect(getState(store)).toEqual({ count: 20, count2: 0 });
  });

  it('updates the state with a partial state updater', () => {
    const increment = eventCreator('increment');

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
    const set2 = eventCreator('set2', props<{ count2: number }>());

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
        on(set2, ({ count2 }, state) => [
          { count: state.count + 1 },
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

  it('allows listening to multiple events', () => {
    const set = eventCreator('set', props<{ count: number }>());
    const set_ = eventCreator('set_', props<{ count: number }>());

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 0, count2: 0 }),
      withReducer(on(set, set_, ({ count }) => ({ count })))
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(set({ count: 10 }));
    expect(getState(store)).toEqual({ count: 10, count2: 0 });

    dispatcher.dispatch(set({ count: 100 }));
    expect(getState(store)).toEqual({ count: 100, count2: 0 });
  });

  it('allows listening to the same event in multiple case reducers', () => {
    const set2 = eventCreator('set2', props<{ count2: number }>());

    const CounterStore = signalStore(
      { providedIn: 'root' },
      withState({ count: 10, count2: 10 }),
      withReducer(
        on(set2, ({ count2 }) => ({ count2 })),
        on(set2, () => ({ count: 0 }))
      )
    );

    const store = TestBed.inject(CounterStore);
    const dispatcher = TestBed.inject(Dispatcher);

    dispatcher.dispatch(set2({ count2: 100 }));
    expect(getState(store)).toEqual({ count: 0, count2: 100 });
  });

  it('unsubscribes from events when the store is destroyed', () => {
    const trigger = eventCreator('trigger');
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
