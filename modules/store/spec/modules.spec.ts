import 'rxjs/add/operator/take';
import { TestBed } from '@angular/core/testing';
import { NgModule, InjectionToken } from '@angular/core';
import { StoreModule, Store, ActionReducer, ActionReducerMap } from '../';


describe('Nested Store Modules', () => {
  type RootState = { fruit: string };
  type FeatureAState = number;
  type FeatureBState = { list: number[], index: number };
  type State = RootState & { a: FeatureAState } & { b: FeatureBState };

  let store: Store<State>;

  const reducersToken = new InjectionToken<ActionReducerMap<RootState>>('Root Reducers');
  const rootFruitReducer: ActionReducer<string> = () => 'apple';
  const featureAReducer: ActionReducer<FeatureAState> = () => 5;
  const featureBListReducer: ActionReducer<number[]> = () => [1, 2, 3];
  const featureBIndexReducer: ActionReducer<number> = () => 2;
  const featureBReducerMap: ActionReducerMap<FeatureBState> = {
    list: featureBListReducer,
    index: featureBIndexReducer,
  };

  @NgModule({
    imports: [
      StoreModule.forFeature('a', featureAReducer),
    ]
  })
  class FeatureAModule { }

  @NgModule({
    imports: [
      StoreModule.forFeature('b', featureBReducerMap),
    ]
  })
  class FeatureBModule { }

  @NgModule({
    imports: [
      StoreModule.forRoot<RootState>(reducersToken),
      FeatureAModule,
      FeatureBModule,
    ],
    providers: [
      {
        provide: reducersToken,
        useValue: { fruit: rootFruitReducer },
      }
    ]
  })
  class RootModule { }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RootModule,
      ]
    });

    store = TestBed.get(Store);
  });

  it('should nest the child module in the root store object', () => {
    store.take(1).subscribe((state: State) => {
      expect(state).toEqual({
        fruit: 'apple',
        a: 5,
        b: {
          list: [1, 2, 3],
          index: 2,
        }
      });
    });
  });
});

