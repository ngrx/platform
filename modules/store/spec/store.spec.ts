import 'rxjs/add/operator/take';
import { ReflectiveInjector } from '@angular/core';
import { hot } from 'jasmine-marbles';
import { createInjector } from './helpers/injector';
import { ActionsSubject, ReducerManager, Store, StoreModule } from '../';
import {
  counterReducer,
  INCREMENT,
  DECREMENT,
  RESET,
} from './fixtures/counter';
import Spy = jasmine.Spy;
import any = jasmine.any;

interface TestAppSchema {
  counter1: number;
  counter2: number;
  counter3: number;
  counter4?: number;
}

describe('ngRx Store', () => {
  let injector: ReflectiveInjector;
  let store: Store<TestAppSchema>;
  let dispatcher: ActionsSubject;

  function setup(initialState: any = { counter1: 0, counter2: 1 }) {
    const reducers = {
      counter1: counterReducer,
      counter2: counterReducer,
      counter3: counterReducer,
    };

    injector = createInjector(StoreModule.forRoot(reducers, { initialState }));
    store = injector.get(Store);
    dispatcher = injector.get(ActionsSubject);
  }

  describe('initial state', () => {
    it('should handle an initial state object', (done: any) => {
      setup();

      store.take(1).subscribe({
        next(val) {
          expect(val).toEqual({ counter1: 0, counter2: 1, counter3: 0 });
        },
        error: done,
        complete: done,
      });
    });

    it('should handle an initial state function', (done: any) => {
      setup(() => ({ counter1: 0, counter2: 5 }));

      store.take(1).subscribe({
        next(val) {
          expect(val).toEqual({ counter1: 0, counter2: 5, counter3: 0 });
        },
        error: done,
        complete: done,
      });
    });
  });

  describe('basic store actions', () => {
    beforeEach(() => setup());

    it('should provide an Observable Store', () => {
      expect(store).toBeDefined();
    });

    const actionSequence = '--a--b--c--d--e';
    const actionValues = {
      a: { type: INCREMENT },
      b: { type: INCREMENT },
      c: { type: DECREMENT },
      d: { type: RESET },
      e: { type: INCREMENT },
    };

    it('should let you select state with a key name', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe(action => store.dispatch(action));

      const counterStateWithString = store.select('counter1');

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterStateWithString).toBeObservable(
        hot(stateSequence, counter1Values)
      );
    });

    it('should let you select state with a selector function', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe(action => store.dispatch(action));

      const counterStateWithFunc = store.select(s => s.counter1);

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterStateWithFunc).toBeObservable(
        hot(stateSequence, counter1Values)
      );
    });

    it('should correctly lift itself', () => {
      const result = store.select('counter1');

      expect(result instanceof Store).toBe(true);
    });

    it('should increment and decrement counter1', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe(action => store.dispatch(action));

      const counterState = store.select('counter1');

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterState).toBeObservable(hot(stateSequence, counter1Values));
    });

    it('should increment and decrement counter1 using the dispatcher', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe(action => dispatcher.next(action));

      const counterState = store.select('counter1');

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterState).toBeObservable(hot(stateSequence, counter1Values));
    });

    it('should increment and decrement counter2 separately', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe(action => store.dispatch(action));

      const counter1State = store.select('counter1');
      const counter2State = store.select('counter2');

      const stateSequence = 'i-v--w--x--y--z';
      const counter2Values = { i: 1, v: 2, w: 3, x: 2, y: 0, z: 1 };

      expect(counter2State).toBeObservable(hot(stateSequence, counter2Values));
    });

    it('should implement the observer interface forwarding actions and errors to the dispatcher', () => {
      spyOn(dispatcher, 'next');
      spyOn(dispatcher, 'error');

      store.next(<any>1);
      store.error(2);

      expect(dispatcher.next).toHaveBeenCalledWith(1);
      expect(dispatcher.error).toHaveBeenCalledWith(2);
    });

    it('should not be completable', () => {
      const storeSubscription = store.subscribe();
      const dispatcherSubscription = dispatcher.subscribe();

      store.complete();
      dispatcher.complete();

      expect(storeSubscription.closed).toBe(false);
      expect(dispatcherSubscription.closed).toBe(false);
    });

    it('should complete if the dispatcher is destroyed', () => {
      const storeSubscription = store.subscribe();
      const dispatcherSubscription = dispatcher.subscribe();

      dispatcher.ngOnDestroy();

      expect(dispatcherSubscription.closed).toBe(true);
    });
  });

  describe(`add/remove reducers`, () => {
    let addReducerSpy: Spy;
    let removeReducerSpy: Spy;
    const key = 'counter4';

    beforeEach(() => {
      setup();
      const reducerManager = injector.get(ReducerManager);
      addReducerSpy = spyOn(reducerManager, 'addReducer').and.callThrough();
      removeReducerSpy = spyOn(
        reducerManager,
        'removeReducer'
      ).and.callThrough();
    });

    it(`should delegate add/remove to ReducerManager`, () => {
      store.addReducer(key, counterReducer);
      expect(addReducerSpy).toHaveBeenCalledWith(key, counterReducer);

      store.removeReducer(key);
      expect(removeReducerSpy).toHaveBeenCalledWith(key);
    });

    it(`should work with added / removed reducers`, () => {
      store.addReducer(key, counterReducer);
      store.take(1).subscribe(val => {
        expect(val.counter4).toBe(0);
      });

      store.removeReducer(key);
      store.dispatch({ type: INCREMENT });
      store.take(1).subscribe(val => {
        expect(val.counter4).toBeUndefined();
      });
    });
  });
});
