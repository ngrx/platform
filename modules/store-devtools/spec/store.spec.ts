import { getTestBed, TestBed } from '@angular/core/testing';
import {
  Action,
  ActionReducer,
  ReducerManager,
  StateObservable,
  Store,
  StoreModule,
  UPDATE,
} from '@ngrx/store';

import {
  LiftedState,
  StoreDevtools,
  StoreDevtoolsModule,
  StoreDevtoolsOptions,
} from '../';
import { IS_EXTENSION_OR_MONITOR_PRESENT } from '../src/instrument';
import { RECOMPUTE } from '../src/reducer';

const counter = jasmine
  .createSpy('counter')
  .and.callFake(function (state = 0, action: Action) {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state;
    }
  });

declare let mistake: any;
function counterWithBug(state = 0, action: Action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return mistake - 1; // mistake is undefined
    case 'SET_UNDEFINED':
      return undefined;
    default:
      return state;
  }
}

function counterWithAnotherBug(state = 0, action: Action) {
  switch (action.type) {
    case 'INCREMENT':
      return mistake + 1; // eslint-disable-line no-undef
    case 'DECREMENT':
      return state - 1;
    case 'SET_UNDEFINED':
      return undefined;
    default:
      return state;
  }
}

function doubleCounter(state = 0, action: Action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 2;
    case 'DECREMENT':
      return state - 2;
    default:
      return state;
  }
}

type Fixture<T> = {
  store: Store<T>;
  state: StateObservable;
  devtools: StoreDevtools;
  cleanup: () => void;
  getState: () => T;
  getLiftedState: () => LiftedState;
  replaceReducer: (reducer: ActionReducer<any, any>) => void;
};

function createStore<T>(
  reducer: ActionReducer<T | undefined, Action>,
  options: StoreDevtoolsOptions = {}
): Fixture<T> {
  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({ state: reducer }),
      StoreDevtoolsModule.instrument(options),
    ],
    providers: [{ provide: IS_EXTENSION_OR_MONITOR_PRESENT, useValue: true }],
  });

  const testbed: TestBed = getTestBed();
  const store = testbed.inject(Store);

  const devtools = testbed.inject(StoreDevtools);
  const state = testbed.inject(StateObservable);
  const reducerManager = testbed.inject(ReducerManager);
  let liftedValue: LiftedState;
  let value: any;

  const liftedStateSub = devtools.liftedState.subscribe(
    (s) => (liftedValue = s)
  );
  const stateSub = devtools.state.subscribe((s) => (value = s));

  const getState = (): T => value.state;
  const getLiftedState = (): LiftedState => liftedValue;

  const cleanup = () => {
    liftedStateSub.unsubscribe();
    stateSub.unsubscribe();
  };

  const replaceReducer = (reducer: ActionReducer<any, any>) => {
    reducerManager.addReducer('state', reducer);
  };

  return {
    store,
    state,
    devtools,
    cleanup,
    getState,
    getLiftedState,
    replaceReducer,
  };
}

describe('Store Devtools', () => {
  describe('reducer', () => {
    it('should call @ngrx/store-devtools/recompute action', () => {
      const fixture = createStore(doubleCounter);
      counter.calls.reset();
      fixture.replaceReducer(counter);

      const allArgs = counter.calls.allArgs();
      expect(allArgs.length).toEqual(3);
      expect(allArgs[0][1].type).toEqual(UPDATE);
      expect(allArgs[1][1].type).toEqual(RECOMPUTE);
      expect(allArgs[2][1].type).toEqual(RECOMPUTE);
    });
  });

  describe('Instrumentation', () => {
    let fixture: Fixture<number>;
    let store: Store<number>;
    let devtools: StoreDevtools;
    let getState: () => number;
    let getLiftedState: () => LiftedState;

    beforeEach(() => {
      fixture = createStore(counter);
      store = fixture.store;
      devtools = fixture.devtools;
      getState = fixture.getState;
      getLiftedState = fixture.getLiftedState;
    });

    afterEach(() => {
      fixture.cleanup();
    });

    it(`should alias devtools unlifted state to Store's state`, () => {
      expect(devtools.state).toBe(fixture.state as any);
    });

    it('should perform actions', () => {
      expect(getState()).toBe(0);
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(1);
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(2);
    });

    it('should rollback state to the last committed state', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(2);

      devtools.commit();
      expect(getState()).toBe(2);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(4);

      devtools.rollback();
      expect(getState()).toBe(2);

      store.dispatch({ type: 'DECREMENT' });
      expect(getState()).toBe(1);

      devtools.rollback();
      expect(getState()).toBe(2);
    });

    it('should refresh to show current state as is', () => {
      // actionId 0 = @@INIT
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(getState()).toBe(4);
      expect(getLiftedState().stagedActionIds).toEqual([0, 1, 2, 3, 4]);
      expect(getLiftedState().skippedActionIds).toEqual([]);

      devtools.refresh();

      expect(getState()).toBe(4);
      expect(getLiftedState().stagedActionIds).toEqual([0, 1, 2, 3, 4]);
      expect(getLiftedState().skippedActionIds).toEqual([]);
    });

    it('should reset to initial state', () => {
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(1);

      devtools.commit();
      expect(getState()).toBe(1);

      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(2);

      devtools.rollback();
      expect(getState()).toBe(1);

      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(2);

      devtools.reset();
      expect(getState()).toBe(0);
    });

    it('should toggle an action', () => {
      // actionId 0 = @@INIT
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(1);

      devtools.toggleAction(2);
      expect(getState()).toBe(2);

      devtools.toggleAction(2);
      expect(getState()).toBe(1);
    });

    it('should sweep disabled actions', () => {
      // actionId 0 = @@INIT
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(getState()).toBe(2);
      expect(getLiftedState().stagedActionIds).toEqual([0, 1, 2, 3, 4]);
      expect(getLiftedState().skippedActionIds).toEqual([]);

      devtools.toggleAction(2);

      expect(getState()).toBe(3);
      expect(getLiftedState().stagedActionIds).toEqual([0, 1, 2, 3, 4]);
      expect(getLiftedState().skippedActionIds).toEqual([2]);

      devtools.sweep();
      expect(getState()).toBe(3);
      expect(getLiftedState().stagedActionIds).toEqual([0, 1, 3, 4]);
      expect(getLiftedState().skippedActionIds).toEqual([]);
    });

    it('should jump to state', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(1);

      devtools.jumpToState(0);
      expect(getState()).toBe(0);

      devtools.jumpToState(1);
      expect(getState()).toBe(1);

      devtools.jumpToState(2);
      expect(getState()).toBe(0);

      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(0);

      devtools.jumpToState(4);
      expect(getState()).toBe(2);
    });

    it('should jump to action', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(getState()).toBe(1);

      devtools.jumpToAction(2);
      expect(getState()).toBe(0);
    });

    it('should replace the reducer and preserve previous states', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(getState()).toBe(1);

      fixture.replaceReducer(doubleCounter);

      expect(getState()).toBe(1);
    });

    it('should replace the reducer and compute new state with latest reducer', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(getState()).toBe(1);

      fixture.replaceReducer(doubleCounter);

      store.dispatch({ type: 'INCREMENT' });

      expect(getState()).toBe(3);
    });

    it('should catch and record errors', () => {
      spyOn(console, 'error');
      fixture.replaceReducer(counterWithBug);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'DECREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      const { computedStates } = fixture.getLiftedState();
      expect(computedStates[3].error).toMatch(/ReferenceError/);
      expect(computedStates[4].error).toMatch(
        /Interrupted by an error up the chain/
      );

      expect(console.error).toHaveBeenCalled();
    });

    it('should catch invalid action type', () => {
      expect(() => {
        store.dispatch({ type: undefined } as any);
      }).toThrowError('Actions must have a type property');
    });

    it('should not recompute old states when toggling an action', () => {
      counter.calls.reset();

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(counter).toHaveBeenCalledTimes(3);

      devtools.toggleAction(3);
      expect(counter).toHaveBeenCalledTimes(3);

      devtools.toggleAction(3);
      expect(counter).toHaveBeenCalledTimes(4);

      devtools.toggleAction(2);
      expect(counter).toHaveBeenCalledTimes(5);

      devtools.toggleAction(2);
      expect(counter).toHaveBeenCalledTimes(7);

      devtools.toggleAction(1);
      expect(counter).toHaveBeenCalledTimes(9);

      devtools.toggleAction(2);
      expect(counter).toHaveBeenCalledTimes(10);

      devtools.toggleAction(3);
      expect(counter).toHaveBeenCalledTimes(10);

      devtools.toggleAction(1);
      expect(counter).toHaveBeenCalledTimes(11);

      devtools.toggleAction(3);
      expect(counter).toHaveBeenCalledTimes(12);

      devtools.toggleAction(2);
      expect(counter).toHaveBeenCalledTimes(14);
    });

    it('should not recompute states when jumping to state', () => {
      counter.calls.reset();

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(counter).toHaveBeenCalledTimes(3);

      const savedComputedStates = getLiftedState().computedStates;

      devtools.jumpToState(0);

      expect(counter).toHaveBeenCalledTimes(3);

      devtools.jumpToState(1);

      expect(counter).toHaveBeenCalledTimes(3);

      devtools.jumpToState(3);

      expect(counter).toHaveBeenCalledTimes(3);

      expect(getLiftedState().computedStates).toBe(savedComputedStates);
    });

    it('should not recompute states on monitor actions', () => {
      counter.calls.reset();

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });

      expect(counter).toHaveBeenCalledTimes(3);

      const savedComputedStates = getLiftedState().computedStates;

      devtools.dispatch({ type: 'lol' });

      expect(counter).toHaveBeenCalledTimes(3);

      devtools.dispatch({ type: 'wat' });

      expect(counter).toHaveBeenCalledTimes(3);

      expect(getLiftedState().computedStates).toBe(savedComputedStates);
    });
  });

  describe('Filtered actions', () => {
    it('should respect the predicate option', () => {
      const fixture = createStore(counter, {
        predicate: (s, a) => a.type !== 'INCREMENT',
      });

      expect(fixture.getState()).toBe(0);
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      expect(fixture.getState()).toBe(5);

      // init, decrement, decrement
      const {
        stagedActionIds,
        actionsById,
        computedStates,
        currentStateIndex,
      } = fixture.getLiftedState();
      expect(stagedActionIds.length).toBe(3);
      expect(Object.keys(actionsById).length).toBe(3);
      expect(computedStates.length).toBe(3);
      expect(currentStateIndex).toBe(2);

      fixture.devtools.jumpToAction(0);
      expect(fixture.getState()).toBe(1);

      fixture.devtools.jumpToAction(1);
      expect(fixture.getState()).toBe(6);

      fixture.devtools.jumpToAction(2);
      expect(fixture.getState()).toBe(5);
    });

    it('should respect the blocked option', () => {
      const fixture = createStore(counter, {
        actionsBlocklist: ['INCREMENT'],
      });

      expect(fixture.getState()).toBe(0);
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      expect(fixture.getState()).toBe(5);

      // init, decrement, decrement
      const {
        stagedActionIds,
        actionsById,
        computedStates,
        currentStateIndex,
      } = fixture.getLiftedState();
      expect(stagedActionIds.length).toBe(3);
      expect(Object.keys(actionsById).length).toBe(3);
      expect(computedStates.length).toBe(3);
      expect(currentStateIndex).toBe(2);

      fixture.devtools.jumpToAction(0);
      expect(fixture.getState()).toBe(1);

      fixture.devtools.jumpToAction(1);
      expect(fixture.getState()).toBe(6);

      fixture.devtools.jumpToAction(2);
      expect(fixture.getState()).toBe(5);
    });

    it('should respect the safe option', () => {
      const fixture = createStore(counter, {
        actionsSafelist: ['DECREMENT'],
      });

      expect(fixture.getState()).toBe(0);
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      expect(fixture.getState()).toBe(5);

      // init, decrement, decrement
      const {
        stagedActionIds,
        actionsById,
        computedStates,
        currentStateIndex,
      } = fixture.getLiftedState();
      expect(stagedActionIds.length).toBe(3);
      expect(Object.keys(actionsById).length).toBe(3);
      expect(computedStates.length).toBe(3);
      expect(currentStateIndex).toBe(2);

      fixture.devtools.jumpToAction(0);
      expect(fixture.getState()).toBe(1);

      fixture.devtools.jumpToAction(1);
      expect(fixture.getState()).toBe(6);

      fixture.devtools.jumpToAction(2);
      expect(fixture.getState()).toBe(5);
    });
  });

  describe('maxAge option', () => {
    it('should auto-commit earliest non-@@INIT action when maxAge is reached', () => {
      const fixture = createStore(counter, { maxAge: 3 });

      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      let liftedStoreState = fixture.getLiftedState();

      expect(fixture.getState()).toBe(2);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.committedState).toBe(undefined);
      expect(liftedStoreState.stagedActionIds).toContain(1);

      // Trigger auto-commit.
      fixture.store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = fixture.getLiftedState();

      expect(fixture.getState()).toBe(3);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.stagedActionIds).not.toContain(1);
      expect(liftedStoreState.computedStates[0].state).toEqual({ state: 1 });
      expect(liftedStoreState.committedState).toEqual({ state: 1 });
      expect(liftedStoreState.currentStateIndex).toBe(2);

      fixture.cleanup();
    });

    it('should remove skipped actions once committed', () => {
      const fixture = createStore(counter, { maxAge: 3 });

      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.devtools.toggleAction(1);
      fixture.store.dispatch({ type: 'INCREMENT' });
      expect(fixture.getLiftedState().skippedActionIds.indexOf(1)).not.toBe(-1);
      fixture.store.dispatch({ type: 'INCREMENT' });
      expect(fixture.getLiftedState().skippedActionIds.indexOf(1)).toBe(-1);

      fixture.cleanup();
    });

    it('should not auto-commit errors', () => {
      spyOn(console, 'error');
      const fixture = createStore(counterWithBug, { maxAge: 3 });

      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      expect(fixture.getLiftedState().stagedActionIds.length).toBe(3);

      fixture.store.dispatch({ type: 'INCREMENT' });
      expect(fixture.getLiftedState().stagedActionIds.length).toBe(4);

      fixture.cleanup();
    });

    it('should auto-commit actions after hot reload fixes error', () => {
      spyOn(console, 'error');
      const fixture = createStore(counterWithBug, { maxAge: 3 });

      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      expect(fixture.getLiftedState().stagedActionIds.length).toBe(7);

      // Auto-commit 2 actions by "fixing" reducer bug, but introducing another.
      fixture.replaceReducer(counterWithAnotherBug);
      expect(fixture.getLiftedState().stagedActionIds.length).toBe(5);

      // Auto-commit 2 more actions by "fixing" other reducer bug.
      fixture.replaceReducer(counter);
      expect(fixture.getLiftedState().stagedActionIds.length).toBe(3);

      fixture.cleanup();
    });

    it('should update currentStateIndex when auto-committing', () => {
      const fixture = createStore(counter, { maxAge: 3 });

      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });

      expect(fixture.getLiftedState().currentStateIndex).toBe(2);

      // currentStateIndex should stay at 2 as actions are committed.
      fixture.store.dispatch({ type: 'INCREMENT' });
      const liftedStoreState = fixture.getLiftedState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];

      expect(liftedStoreState.currentStateIndex).toBe(2);
      expect(currentComputedState.state).toEqual({ state: 3 });

      fixture.cleanup();
    });

    it('should continue to increment currentStateIndex while error blocks commit', () => {
      spyOn(console, 'error');
      const fixture = createStore(counterWithBug, { maxAge: 3 });

      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });

      const liftedStoreState = fixture.getLiftedState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(4);
      expect(currentComputedState.state).toEqual({ state: 0 });
      expect(currentComputedState.error).toBeDefined();

      fixture.cleanup();
    });

    it('should adjust currentStateIndex correctly when multiple actions are committed', () => {
      spyOn(console, 'error');
      const fixture = createStore(counterWithBug, { maxAge: 3 });

      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });

      // Auto-commit 2 actions by "fixing" reducer bug.
      fixture.replaceReducer(counter);
      const liftedStoreState = fixture.getLiftedState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(2);
      expect(currentComputedState.state).toEqual({ state: -4 });

      fixture.cleanup();
    });

    it('should not allow currentStateIndex to drop below 0', () => {
      spyOn(console, 'error');
      const fixture = createStore(counterWithBug, { maxAge: 3 });

      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.devtools.jumpToState(1);

      // Auto-commit 2 actions by "fixing" reducer bug.
      fixture.replaceReducer(counter);
      const liftedStoreState = fixture.getLiftedState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(0);
      expect(currentComputedState.state).toEqual({ state: -2 });

      fixture.cleanup();
    });

    it('should throw error when maxAge < 2', () => {
      expect(() => {
        createStore(counter, { maxAge: 1 });
      }).toThrowError(/cannot be less than/);
    });

    it('should support a function to return devtools options', () => {
      expect(() => {
        createStore(counter, function () {
          return { maxAge: 1 };
        });
      }).toThrowError(/cannot be less than/);
    });
  });

  describe('Import State', () => {
    let fixture: Fixture<number>;
    let exportedState: LiftedState;

    beforeEach(() => {
      fixture = createStore(counter);

      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });

      exportedState = fixture.getLiftedState();
    });

    afterEach(() => {
      fixture.cleanup();
    });

    it('should replay all the steps when a state is imported', () => {
      fixture.devtools.importState(exportedState);
      expect(fixture.getLiftedState()).toEqual(exportedState);
    });

    it('should replace the existing action log with the one imported', () => {
      fixture.store.dispatch({ type: 'DECREMENT' });
      fixture.store.dispatch({ type: 'DECREMENT' });

      fixture.devtools.importState(exportedState);
      expect(fixture.getLiftedState()).toEqual(exportedState);
    });
  });

  describe('Lock Changes', () => {
    let fixture: Fixture<number>;
    beforeEach(() => {
      fixture = createStore(counter);
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.devtools.lockChanges(true);
    });

    afterEach(() => {
      fixture.cleanup();
    });

    it('should update state correctly', () => {
      expect(fixture.getLiftedState().isLocked).toBe(true);
      expect(fixture.getLiftedState().nextActionId).toBe(3);
      expect(fixture.getState()).toBe(2);
    });

    it('should not accept changes during lock', () => {
      fixture.store.dispatch({ type: 'INCREMENT' });
      expect(fixture.getLiftedState().nextActionId).toBe(3);
      expect(fixture.getState()).toBe(2);
    });

    it('should be able to skip / time travel during lock', () => {
      fixture.devtools.toggleAction(1);
      expect(fixture.getState()).toBe(1);
      fixture.devtools.toggleAction(1);
      expect(fixture.getState()).toBe(2);
      fixture.devtools.jumpToAction(1);
      expect(fixture.getState()).toBe(1);
      fixture.devtools.jumpToAction(2);
      expect(fixture.getState()).toBe(2);
    });

    it('should work correctly after unlock', () => {
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.devtools.jumpToAction(1);
      fixture.devtools.jumpToAction(2);
      fixture.devtools.lockChanges(false);
      expect(fixture.getLiftedState().isLocked).toBe(false);
      expect(fixture.getLiftedState().nextActionId).toBe(3);
      expect(fixture.getState()).toBe(2);

      fixture.store.dispatch({ type: 'INCREMENT' });
      expect(fixture.getLiftedState().nextActionId).toBe(4);
      expect(fixture.getState()).toBe(3);
    });
  });

  describe('pause recording', () => {
    let fixture: Fixture<number>;
    beforeEach(() => {
      fixture = createStore(counter);
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.store.dispatch({ type: 'INCREMENT' });
      fixture.devtools.pauseRecording(true);
    });

    afterEach(() => {
      fixture.cleanup();
    });

    it('should update pause correctly', () => {
      expect(fixture.getLiftedState().isPaused).toBe(true);
      fixture.devtools.pauseRecording(false);
      expect(fixture.getLiftedState().isPaused).toBe(false);
    });

    it('should create a copy of the last state before pausing', () => {
      const computedStates = fixture.getLiftedState().computedStates;
      expect(computedStates.length).toBe(4);
      expect(computedStates[3]).toEqual(computedStates[2]);
      expect(fixture.getLiftedState().currentStateIndex).toBe(3);
      expect(fixture.getState()).toBe(2);
    });

    it('should add pause action', () => {
      const liftedState = fixture.getLiftedState();
      expect(liftedState.nextActionId).toBe(4);
      expect(liftedState.actionsById[3].action.type).toEqual(
        '@ngrx/devtools/pause'
      );
    });

    it('should overwrite last state during pause but keep action', () => {
      fixture.store.dispatch({ type: 'DECREMENT' });
      const liftedState = fixture.getLiftedState();
      expect(liftedState.currentStateIndex).toBe(3);
      expect(liftedState.computedStates.length).toBe(4);
      expect(fixture.getState()).toEqual(1);
      expect(liftedState.nextActionId).toBe(4);
      expect(liftedState.actionsById[3].action.type).toEqual(
        '@ngrx/devtools/pause'
      );
    });

    it('recomputation of states should preserve last state', () => {
      fixture.devtools.jumpToState(1);
      expect(fixture.getState()).toBe(1);
      fixture.devtools.jumpToState(3);
      expect(fixture.getState()).toBe(2);
      fixture.devtools.toggleAction(1);
      expect(fixture.getState()).toBe(2);
      fixture.devtools.jumpToState(2);
      expect(fixture.getState()).toBe(1);
    });

    it('reducer update should not be recorded but should still be applied', () => {
      const oldComputedStates = fixture.getLiftedState().computedStates;
      fixture.store.dispatch({ type: UPDATE });
      expect(fixture.getState()).toBe(2);
      const liftedState = fixture.getLiftedState();
      expect(liftedState.nextActionId).toBe(4);
      expect(liftedState.actionsById[3].action.type).toEqual(
        '@ngrx/devtools/pause'
      );
      expect(oldComputedStates).not.toBe(liftedState.computedStates);
    });
  });
});
