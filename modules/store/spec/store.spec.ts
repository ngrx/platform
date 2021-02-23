import { InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { hot } from 'jasmine-marbles';
import {
  ActionsSubject,
  ReducerManager,
  Store,
  StoreModule,
  select,
  ReducerManagerDispatcher,
  UPDATE,
  ActionReducer,
  Action,
} from '../';
import { StoreConfig } from '../src/store_module';
import { combineReducers } from '../src/utils';
import {
  counterReducer,
  INCREMENT,
  DECREMENT,
  RESET,
  counterReducer2,
} from './fixtures/counter';
import Spy = jasmine.Spy;
import { take } from 'rxjs/operators';

interface TestAppSchema {
  counter1: number;
  counter2: number;
  counter3: number;
  counter4?: number;
}

describe('ngRx Store', () => {
  let store: Store<TestAppSchema>;
  let dispatcher: ActionsSubject;

  function setup(
    initialState: any = { counter1: 0, counter2: 1 },
    metaReducers: any = []
  ) {
    const reducers = {
      counter1: counterReducer,
      counter2: counterReducer,
      counter3: counterReducer,
    };

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers, { initialState, metaReducers })],
    });

    store = TestBed.inject(Store);
    dispatcher = TestBed.inject(ActionsSubject);
  }

  describe('initial state', () => {
    it('should handle an initial state object', (done: any) => {
      setup();
      testStoreValue({ counter1: 0, counter2: 1, counter3: 0 }, done);
    });

    it('should handle an initial state function', (done: any) => {
      setup(() => ({ counter1: 0, counter2: 5 }));
      testStoreValue({ counter1: 0, counter2: 5, counter3: 0 }, done);
    });

    it('should keep initial state values when state is partially initialized', (done: any) => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({} as any, {
            initialState: {
              feature1: {
                counter1: 1,
              },
              feature3: {
                counter3: 3,
              },
            },
          }),
          StoreModule.forFeature('feature1', { counter1: counterReducer }),
          StoreModule.forFeature('feature2', { counter2: counterReducer }),
          StoreModule.forFeature('feature3', { counter3: counterReducer }),
        ],
      });

      testStoreValue(
        {
          feature1: { counter1: 1 },
          feature2: { counter2: 0 },
          feature3: { counter3: 3 },
        },
        done
      );
    });

    it('should reset to initial state when undefined (root ActionReducerMap)', () => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot(
            { counter1: counterReducer },
            { initialState: { counter1: 1 } }
          ),
        ],
      });

      testInitialState();
    });

    it('should reset to initial state when undefined (feature ActionReducer)', () => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature('counter1', counterReducer, {
            initialState: 1,
          }),
        ],
      });

      testInitialState();
    });

    it('should reset to initial state when undefined (feature ActionReducerMap)', () => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature(
            'feature1',
            { counter1: counterReducer },
            { initialState: { counter1: 1 } }
          ),
        ],
      });

      testInitialState('feature1');
    });

    function testInitialState(feature?: string) {
      store = TestBed.inject(Store);
      dispatcher = TestBed.inject(ActionsSubject);

      const actionSequence = '--a--b--c--d--e--f--g';
      const stateSequence = 'i-w-----x-----y--z---';
      const actionValues = {
        a: { type: INCREMENT },
        b: { type: 'OTHER' },
        c: { type: RESET },
        d: { type: 'OTHER' }, // reproduces https://github.com/ngrx/platform/issues/880 because state is falsey
        e: { type: INCREMENT },
        f: { type: INCREMENT },
        g: { type: 'OTHER' },
      };
      const counterSteps = hot(actionSequence, actionValues);
      counterSteps.subscribe((action) => store.dispatch(action));

      const counterStateWithString = feature
        ? (store as any).select(feature, 'counter1')
        : store.select('counter1');

      const counter1Values = { i: 1, w: 2, x: 0, y: 1, z: 2 };

      expect(counterStateWithString).toBeObservable(
        hot(stateSequence, counter1Values)
      );
    }

    function testStoreValue(expected: any, done: any) {
      store = TestBed.inject(Store);

      store.pipe(take(1)).subscribe({
        next(val) {
          expect(val).toEqual(expected);
        },
        error: done,
        complete: done,
      });
    }
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

      counterSteps.subscribe((action) => store.dispatch(action));

      const counterStateWithString = store.pipe(select('counter1'));

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterStateWithString).toBeObservable(
        hot(stateSequence, counter1Values)
      );
    });

    it('should let you select state with a selector function', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => store.dispatch(action));

      const counterStateWithFunc = store.pipe(select((s) => s.counter1));

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterStateWithFunc).toBeObservable(
        hot(stateSequence, counter1Values)
      );
    });

    it('should correctly lift itself', () => {
      const result = store.pipe(select('counter1'));

      expect(result instanceof Store).toBe(true);
    });

    it('should increment and decrement counter1', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => store.dispatch(action));

      const counterState = store.pipe(select('counter1'));

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterState).toBeObservable(hot(stateSequence, counter1Values));
    });

    it('should increment and decrement counter1 using the dispatcher', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => dispatcher.next(action));

      const counterState = store.pipe(select('counter1'));

      const stateSequence = 'i-v--w--x--y--z';
      const counter1Values = { i: 0, v: 1, w: 2, x: 1, y: 0, z: 1 };

      expect(counterState).toBeObservable(hot(stateSequence, counter1Values));
    });

    it('should increment and decrement counter2 separately', () => {
      const counterSteps = hot(actionSequence, actionValues);

      counterSteps.subscribe((action) => store.dispatch(action));

      const counter1State = store.pipe(select('counter1'));
      const counter2State = store.pipe(select('counter2'));

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
    let reducerManagerDispatcherSpy: Spy;
    const key = 'counter4';

    beforeEach(() => {
      setup();
      const reducerManager = TestBed.inject(ReducerManager);
      const dispatcher = TestBed.inject(ReducerManagerDispatcher);
      addReducerSpy = spyOn(reducerManager, 'addReducer').and.callThrough();
      removeReducerSpy = spyOn(
        reducerManager,
        'removeReducer'
      ).and.callThrough();
      reducerManagerDispatcherSpy = spyOn(dispatcher, 'next').and.callThrough();
    });

    it(`should delegate add/remove to ReducerManager`, () => {
      store.addReducer(key, counterReducer);
      expect(addReducerSpy).toHaveBeenCalledWith(key, counterReducer);

      store.removeReducer(key);
      expect(removeReducerSpy).toHaveBeenCalledWith(key);
    });

    it(`should work with added / removed reducers`, (done) => {
      store.addReducer(key, counterReducer);
      store.pipe(take(1)).subscribe((val) => {
        expect(val.counter4).toBe(0);
      });

      store.removeReducer(key);
      store.dispatch({ type: INCREMENT });
      store.pipe(take(1)).subscribe((val) => {
        expect(val.counter4).toBeUndefined();
        done();
      });
    });

    it('should dispatch an update reducers action when a reducer is added', () => {
      store.addReducer(key, counterReducer);
      expect(reducerManagerDispatcherSpy).toHaveBeenCalledWith({
        type: UPDATE,
        features: [key],
      });
    });

    it('should dispatch an update reducers action when a reducer is removed', () => {
      store.removeReducer(key);
      expect(reducerManagerDispatcherSpy).toHaveBeenCalledWith({
        type: UPDATE,
        features: [key],
      });
    });
  });

  describe('add/remove features', () => {
    let reducerManager: ReducerManager;
    let reducerManagerDispatcherSpy: Spy;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({})],
      });

      reducerManager = TestBed.inject(ReducerManager);
      const dispatcher = TestBed.inject(ReducerManagerDispatcher);
      reducerManagerDispatcherSpy = spyOn(dispatcher, 'next').and.callThrough();
    });

    it('should dispatch an update reducers action when a feature is added', () => {
      reducerManager.addFeature({
        key: 'feature1',
        reducers: {},
        reducerFactory: <any>combineReducers,
      });

      expect(reducerManagerDispatcherSpy).toHaveBeenCalledWith({
        type: UPDATE,
        features: ['feature1'],
      });
    });

    it('should dispatch an update reducers action when multiple features are added', () => {
      reducerManager.addFeatures([
        {
          key: 'feature1',
          reducers: {},
          reducerFactory: <any>combineReducers,
        },
        {
          key: 'feature2',
          reducers: {},
          reducerFactory: <any>combineReducers,
        },
      ]);

      expect(reducerManagerDispatcherSpy).toHaveBeenCalledTimes(1);
      expect(reducerManagerDispatcherSpy).toHaveBeenCalledWith({
        type: UPDATE,
        features: ['feature1', 'feature2'],
      });
    });

    it('should dispatch an update reducers action when a feature is removed', () => {
      reducerManager.removeFeature(
        createFeature({
          key: 'feature1',
        })
      );

      expect(reducerManagerDispatcherSpy).toHaveBeenCalledWith({
        type: UPDATE,
        features: ['feature1'],
      });
    });

    it('should dispatch an update reducers action when multiple features are removed', () => {
      reducerManager.removeFeatures([
        createFeature({
          key: 'feature1',
        }),
        createFeature({
          key: 'feature2',
        }),
      ]);

      expect(reducerManagerDispatcherSpy).toHaveBeenCalledTimes(1);
      expect(reducerManagerDispatcherSpy).toHaveBeenCalledWith({
        type: UPDATE,
        features: ['feature1', 'feature2'],
      });
    });

    function createFeature({ key }: { key: string }) {
      return {
        key,
        reducers: {},
        reducerFactory: jasmine.createSpy(`reducerFactory_${key}`),
      };
    }
  });

  describe('Meta Reducers', () => {
    let metaReducerContainer: any;
    let metaReducerSpy1: Spy;
    let metaReducerSpy2: Spy;

    beforeEach(() => {
      metaReducerContainer = (function () {
        function metaReducer1(reducer: ActionReducer<any, any>) {
          return function (state: any, action: Action) {
            return reducer(state, action);
          };
        }

        function metaReducer2(reducer: ActionReducer<any, any>) {
          return function (state: any, action: Action) {
            return reducer(state, action);
          };
        }

        return {
          metaReducer1: metaReducer1,
          metaReducer2: metaReducer2,
        };
      })();

      metaReducerSpy1 = spyOn(
        metaReducerContainer,
        'metaReducer1'
      ).and.callThrough();

      metaReducerSpy2 = spyOn(
        metaReducerContainer,
        'metaReducer2'
      ).and.callThrough();
    });

    it('should create a meta reducer for root and call it through', () => {
      setup({}, [metaReducerContainer.metaReducer1]);
      const action = { type: INCREMENT };
      store.dispatch(action);
      expect(metaReducerSpy1).toHaveBeenCalled();
    });

    it('should call two meta reducers', () => {
      setup({}, [
        metaReducerContainer.metaReducer1,
        metaReducerContainer.metaReducer2,
      ]);
      const action = { type: INCREMENT };
      store.dispatch(action);

      expect(metaReducerSpy1).toHaveBeenCalled();
      expect(metaReducerSpy2).toHaveBeenCalled();
    });

    it('should create a meta reducer for feature and call it with the expected reducer', () => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature('counter1', counterReducer, {
            metaReducers: [metaReducerContainer.metaReducer1],
          }),
          StoreModule.forFeature('counter2', counterReducer2, {
            metaReducers: [metaReducerContainer.metaReducer2],
          }),
        ],
      });

      const mockStore = TestBed.inject(Store);
      const action = { type: INCREMENT };

      mockStore.dispatch(action);

      expect(metaReducerSpy1).toHaveBeenCalledWith(counterReducer);
      expect(metaReducerSpy2).toHaveBeenCalledWith(counterReducer2);
    });

    it('should initial state with value', (done: any) => {
      const counterInitialState = 2;
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature(
            'counterState',
            { counter: counterReducer },
            {
              initialState: { counter: counterInitialState },
              metaReducers: [metaReducerContainer.metaReducer1],
            }
          ),
        ],
      });

      const mockStore = TestBed.inject(Store);

      mockStore.pipe(take(1)).subscribe({
        next(val: any) {
          expect(val['counterState'].counter).toEqual(counterInitialState);
        },
        error: done,
        complete: done,
      });
    });
  });

  describe('Feature config token', () => {
    let FEATURE_CONFIG_TOKEN: InjectionToken<StoreConfig<any, any>>;
    let FEATURE_CONFIG2_TOKEN: InjectionToken<StoreConfig<any, any>>;

    beforeEach(() => {
      FEATURE_CONFIG_TOKEN = new InjectionToken('Feature Config');
      FEATURE_CONFIG2_TOKEN = new InjectionToken('Feature Config2');
    });

    it('should initial state with value', (done: any) => {
      const initialState = { counter1: 1 };
      const featureKey = 'counter';

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature(
            featureKey,
            counterReducer,
            FEATURE_CONFIG_TOKEN
          ),
        ],
        providers: [
          {
            provide: FEATURE_CONFIG_TOKEN,
            useValue: { initialState: initialState },
          },
        ],
      });

      const mockStore = TestBed.inject(Store);

      mockStore.pipe(take(1)).subscribe({
        next(val: any) {
          expect(val[featureKey]).toEqual(initialState);
        },
        error: done,
        complete: done,
      });
    });

    it('should initial state with value for multi features', (done: any) => {
      const initialState = 1;
      const initialState2 = 2;
      const initialState3 = 3;
      const featureKey = 'counter';
      const featureKey2 = 'counter2';
      const featureKey3 = 'counter3';

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature(
            featureKey,
            counterReducer,
            FEATURE_CONFIG_TOKEN
          ),
          StoreModule.forFeature(
            featureKey2,
            counterReducer,
            FEATURE_CONFIG2_TOKEN
          ),
          StoreModule.forFeature(featureKey3, counterReducer, {
            initialState: initialState3,
          }),
        ],
        providers: [
          {
            provide: FEATURE_CONFIG_TOKEN,
            useValue: { initialState: initialState },
          },
          {
            provide: FEATURE_CONFIG2_TOKEN,
            useValue: { initialState: initialState2 },
          },
        ],
      });

      const mockStore = TestBed.inject(Store);

      mockStore.pipe(take(1)).subscribe({
        next(val: any) {
          expect(val[featureKey]).toEqual(initialState);
          expect(val[featureKey2]).toEqual(initialState2);
          expect(val[featureKey3]).toEqual(initialState3);
        },
        error: done,
        complete: done,
      });
    });

    it('should create a meta reducer with config injection token and call it with the expected reducer', () => {
      const metaReducerContainer = (function () {
        function metaReducer1(reducer: ActionReducer<any, any>) {
          return function (state: any, action: Action) {
            return reducer(state, action);
          };
        }

        function metaReducer2(reducer: ActionReducer<any, any>) {
          return function (state: any, action: Action) {
            return reducer(state, action);
          };
        }

        return {
          metaReducer1: metaReducer1,
          metaReducer2: metaReducer2,
        };
      })();

      const metaReducerSpy1 = spyOn(
        metaReducerContainer,
        'metaReducer1'
      ).and.callThrough();

      const metaReducerSpy2 = spyOn(
        metaReducerContainer,
        'metaReducer2'
      ).and.callThrough();

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          StoreModule.forFeature(
            'counter1',
            counterReducer,
            FEATURE_CONFIG_TOKEN
          ),
          StoreModule.forFeature(
            'counter2',
            counterReducer2,
            FEATURE_CONFIG2_TOKEN
          ),
        ],
        providers: [
          {
            provide: FEATURE_CONFIG_TOKEN,
            useValue: { metaReducers: [metaReducerContainer.metaReducer1] },
          },
          {
            provide: FEATURE_CONFIG2_TOKEN,
            useValue: { metaReducers: [metaReducerContainer.metaReducer2] },
          },
        ],
      });
      const mockStore = TestBed.inject(Store);
      const action = { type: INCREMENT };
      mockStore.dispatch(action);

      expect(metaReducerSpy1).toHaveBeenCalledWith(counterReducer);
      expect(metaReducerSpy2).toHaveBeenCalledWith(counterReducer2);
    });
  });
});
