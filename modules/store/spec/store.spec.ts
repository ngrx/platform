import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { ReflectiveInjector } from '@angular/core';
import { hot } from 'jasmine-marbles';
import { createInjector } from './helpers/injector';
import {Store, Action, combineReducers, StoreModule} from '../';
import { ActionsSubject } from '../src/private_export';
import {counterReducer, INCREMENT, DECREMENT, RESET} from './fixtures/counter';


interface TestAppSchema {
  counter1: number;
  counter2: number;
  counter3: number;
}

interface Todo { }

interface TodoAppSchema {
  visibilityFilter: string;
  todos: Todo[];
}



describe('ngRx Store', () => {

  describe('basic store actions', function() {

    let injector: ReflectiveInjector;
    let store: Store<TestAppSchema>;
    let dispatcher: ActionsSubject;
    let initialState: any;

    beforeEach(() => {
      const reducers = {
        counter1: counterReducer,
        counter2: counterReducer,
        counter3: counterReducer
      };

      initialState = { counter1: 0, counter2: 1 };

      injector = createInjector(StoreModule.forRoot(reducers, { initialState }));

      store = injector.get(Store);
      dispatcher = injector.get(ActionsSubject);
    });

    it('should provide an Observable Store', () => {
      expect(store).toBeDefined();
    });

    const actionSequence = '--a--b--c--d--e';
    const actionValues = {
      a: { type: INCREMENT },
      b: { type: INCREMENT },
      c: { type: DECREMENT },
      d: { type: RESET },
      e: { type: INCREMENT }
    };

    it('should let you select state with a key name', function() {

      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => store.dispatch(action));

      const counterStateWithString = store.select('counter1');

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterStateWithString).toBeObservable(hot(stateSequence, counter1Values));

    });

    it('should let you select state with a selector function', function() {

      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => store.dispatch(action));

      const counterStateWithFunc = store.select(s => s.counter1);

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterStateWithFunc).toBeObservable(hot(stateSequence, counter1Values));

    });

    it('should correctly lift itself', function() {

      const result = store.select('counter1');

      expect(result instanceof Store).toBe(true);

    });

    it('should appropriately handle initial state', (done) => {

      store.take(1).subscribe({
        next(val) {
          expect(val).toEqual({ counter1: 0, counter2: 1, counter3: 0 });
        },
        error: done,
        complete: done
      });

    });

    it('should increment and decrement counter1', function() {

      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => store.dispatch(action));

      const counterState = store.select('counter1');

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterState).toBeObservable(hot(stateSequence, counter1Values));

    });

    it('should increment and decrement counter1 using the dispatcher', function() {

      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => dispatcher.next(action));

      const counterState = store.select('counter1');

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterState).toBeObservable(hot(stateSequence, counter1Values));
    });


    it('should increment and decrement counter2 separately', function() {

      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => store.dispatch(action));

      const counter1State = store.select('counter1');
      const counter2State = store.select('counter2');

      const stateSequence = 'i-v--w--x--y--z';
      const counter2Values = { i: 1, v: 2, w: 3, x: 2, y: 0, z: 1 };

      expect(counter2State).toBeObservable(hot(stateSequence, counter2Values));

    });

    it('should implement the observer interface forwarding actions and errors to the dispatcher', function() {

      spyOn(dispatcher, 'next');
      spyOn(dispatcher, 'error');

      store.next(<any>1);
      store.error(2);

      expect(dispatcher.next).toHaveBeenCalledWith(1);
      expect(dispatcher.error).toHaveBeenCalledWith(2);

    });

    it('should not be completable', function() {

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

      expect(storeSubscription.closed).toBe(true);
      expect(dispatcherSubscription.closed).toBe(true);
    });
  });
});
