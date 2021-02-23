import { InjectionToken, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  Store,
  StoreModule,
} from '@ngrx/store';
import { take } from 'rxjs/operators';

describe(`Store Modules`, () => {
  type RootState = { fruit: string };
  type FeatureAState = number;
  type FeatureBState = { list: number[]; index: number };
  type State = RootState & { a: FeatureAState } & { b: FeatureBState };

  let store: Store<State>;

  const reducersToken = new InjectionToken<ActionReducerMap<RootState>>(
    'Root Reducers'
  );

  const featureToken = new InjectionToken<ActionReducerMap<RootState>>(
    'Feature Reducers'
  );

  // Trigger here is basically an action type used to trigger state update
  const createDummyReducer = <T>(def: T, trigger: string): ActionReducer<T> => (
    s = def,
    { type, payload }: any
  ) => (type === trigger ? payload : s);
  const rootFruitReducer = createDummyReducer('apple', 'fruit');
  const featureAReducer = createDummyReducer(5, 'a');
  const featureBListReducer = createDummyReducer([1, 2, 3], 'bList');
  const featureBIndexReducer = createDummyReducer(2, 'bIndex');
  const featureBReducerMap: ActionReducerMap<FeatureBState> = {
    list: featureBListReducer,
    index: featureBIndexReducer,
  };

  describe(`: Config`, () => {
    let featureAReducerFactory: any;
    let rootReducerFactory: any;

    const featureAInitial = () => ({ a: 42 });
    const rootInitial = { fruit: 'orange' };

    beforeEach(() => {
      featureAReducerFactory = jasmine
        .createSpy('featureAReducerFactory')
        .and.callFake((rm: any, initialState?: any) => {
          return (state: any, action: any) => 4;
        });
      rootReducerFactory = jasmine
        .createSpy('rootReducerFactory')
        .and.callFake(combineReducers);

      @NgModule({
        imports: [
          StoreModule.forFeature(
            'a',
            { a: featureAReducer },
            {
              initialState: featureAInitial,
              reducerFactory: featureAReducerFactory,
            }
          ),
        ],
      })
      class FeatureAModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot<RootState>(reducersToken, {
            initialState: rootInitial,
            reducerFactory: rootReducerFactory,
          }),
          FeatureAModule,
        ],
        providers: [
          {
            provide: reducersToken,
            useValue: { fruit: rootFruitReducer },
          },
        ],
      })
      class RootModule {}

      TestBed.configureTestingModule({
        imports: [RootModule],
      });

      store = TestBed.inject(Store);
    });

    it(`should accept configurations`, () => {
      expect(featureAReducerFactory).toHaveBeenCalledWith({
        a: featureAReducer,
      });

      expect(rootReducerFactory).toHaveBeenCalledWith({
        fruit: rootFruitReducer,
      });
    });

    it(`should should use config.reducerFactory`, (done) => {
      store.dispatch({ type: 'fruit', payload: 'banana' });
      store.dispatch({ type: 'a', payload: 42 });

      store.pipe(take(1)).subscribe((s: any) => {
        expect(s).toEqual({
          fruit: 'banana',
          a: 4,
        });
        done();
      });
    });
  });

  describe(`: With initial state`, () => {
    const initialState: RootState = { fruit: 'banana' };
    const reducerMap: ActionReducerMap<RootState> = { fruit: rootFruitReducer };
    const noopMetaReducer = (r: Function) => (state: any, action: any) => {
      return r(state, action);
    };

    const testWithMetaReducers = (metaReducers: any[]) => () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot(reducerMap, { initialState, metaReducers }),
          ],
        });

        store = TestBed.inject(Store);
      });

      it('should have initial state', (done) => {
        store.pipe(take(1)).subscribe((s: any) => {
          expect(s).toEqual(initialState);
          done();
        });
      });
    };

    describe(
      'should add initial state with no meta-reducers',
      testWithMetaReducers([])
    );

    describe(
      'should add initial state with registered meta-reducers',
      testWithMetaReducers([noopMetaReducer])
    );
  });

  describe(`: Nested`, () => {
    @NgModule({
      imports: [StoreModule.forFeature('a', featureAReducer)],
    })
    class FeatureAModule {}

    @NgModule({
      imports: [StoreModule.forFeature('b', featureBReducerMap)],
    })
    class FeatureBModule {}

    @NgModule({
      imports: [StoreModule.forFeature('c', featureToken)],
      providers: [
        {
          provide: featureToken,
          useValue: featureBReducerMap,
        },
      ],
    })
    class FeatureCModule {}

    @NgModule({
      imports: [
        StoreModule.forRoot<RootState>(reducersToken),
        FeatureAModule,
        FeatureBModule,
        FeatureCModule,
      ],
      providers: [
        {
          provide: reducersToken,
          useValue: { fruit: rootFruitReducer },
        },
      ],
    })
    class RootModule {}

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RootModule],
      });

      store = TestBed.inject(Store);
    });

    it('should nest the child module in the root store object', (done) => {
      store.pipe(take(1)).subscribe((state: State) => {
        expect(state).toEqual({
          fruit: 'apple',
          a: 5,
          b: {
            list: [1, 2, 3],
            index: 2,
          },
          c: {
            list: [1, 2, 3],
            index: 2,
          },
        } as State);
        done();
      });
    });
  });

  describe(`: With slice object`, () => {
    @NgModule({
      imports: [
        StoreModule.forFeature({ name: 'a', reducer: featureAReducer }),
      ],
    })
    class FeatureAModule {}

    @NgModule({
      imports: [StoreModule.forRoot({}), FeatureAModule],
    })
    class RootModule {}

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RootModule],
      });

      store = TestBed.inject(Store);
    });

    it('should set up a feature state', () => {
      store.pipe(take(1)).subscribe((state: State) => {
        expect(state).toEqual({
          a: 5,
        } as State);
      });
    });
  });
});
