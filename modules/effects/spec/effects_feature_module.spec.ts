import { Injectable, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { combineLatest } from 'rxjs';
import {
  Action,
  createFeatureSelector,
  createSelector,
  select,
  Store,
  StoreModule,
} from '@ngrx/store';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import { Actions, Effect, EffectsModule, ofType } from '../';
import {
  EffectsFeatureModule,
  UPDATE_EFFECTS,
  UpdateEffects,
} from '../src/effects_feature_module';
import { EffectsRootModule } from '../src/effects_root_module';
import { FEATURE_EFFECTS } from '../src/tokens';

describe('Effects Feature Module', () => {
  describe('when registered', () => {
    class SourceA {}
    class SourceB {}
    class SourceC {}

    const sourceA = new SourceA();
    const sourceB = new SourceB();
    const sourceC = new SourceC();

    const effectSourceGroups = [[sourceA], [sourceB, sourceC]];
    let mockEffectSources: { addEffects: jasmine.Spy };
    let mockStore: { dispatch: jasmine.Spy };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: Store,
            useValue: {
              dispatch: jasmine.createSpy('dispatch'),
            },
          },
          {
            provide: EffectsRootModule,
            useValue: {
              addEffects: jasmine.createSpy('addEffects'),
            },
          },
          {
            provide: FEATURE_EFFECTS,
            useValue: effectSourceGroups,
          },
          EffectsFeatureModule,
        ],
      });

      mockEffectSources = TestBed.get(EffectsRootModule);
      mockStore = TestBed.get(Store);
    });

    it('should add all effects when instantiated', () => {
      TestBed.get(EffectsFeatureModule);

      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceA);
      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceB);
      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceC);
    });

    it('should dispatch update-effects actions when instantiated', () => {
      TestBed.get(EffectsFeatureModule);

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: UPDATE_EFFECTS,
        effects: ['SourceA'],
      });

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: UPDATE_EFFECTS,
        effects: ['SourceB', 'SourceC'],
      });
    });
  });

  describe('when registered in a different NgModule from the feature state', () => {
    let effects: FeatureEffects;
    let store: Store<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AppModule],
      });

      effects = TestBed.get(FeatureEffects);
      store = TestBed.get(Store);
    });

    it('should have the feature state defined to select from the effect', (done: any) => {
      const action = { type: 'INCREMENT' };
      const result = { type: 'INCREASE' };

      effects.effectWithStore.subscribe(res => {
        expect(res).toEqual(result);
      });

      store.dispatch(action);

      combineLatest(
        store.pipe(select(getDataState)),
        store.pipe(select(getInitialized))
      ).subscribe(([data, initialized]) => {
        expect(data).toBe(110);
        expect(initialized).toBe(true);
        done();
      });
    });
  });
});

const FEATURE_KEY = 'feature';

interface State {
  FEATURE_KEY: DataState;
}

interface DataState {
  data: number;
  initialized: boolean;
}

const initialState: DataState = {
  data: 100,
  initialized: false,
};

function reducer(state: DataState = initialState, action: Action) {
  switch (action.type) {
    case 'INITIALIZE_FEATURE': {
      return {
        ...state,
        initialized: true,
      };
    }
    case 'INCREASE':
      return {
        ...state,
        data: state.data + 10,
      };
  }
  return state;
}

const getFeatureState = createFeatureSelector<DataState>(FEATURE_KEY);

const getDataState = createSelector(getFeatureState, state => state.data);
const getInitialized = createSelector(
  getFeatureState,
  state => state.initialized
);

@Injectable()
class FeatureEffects {
  constructor(private actions: Actions, private store: Store<State>) {}

  @Effect()
  init = this.actions.pipe(
    ofType<UpdateEffects>(UPDATE_EFFECTS),
    filter(action => action.effects.includes('FeatureEffects')),
    map(action => ({ type: 'INITIALIZE_FEATURE' }))
  );

  @Effect()
  effectWithStore = this.actions.ofType('INCREMENT').pipe(
    withLatestFrom(this.store.select(getDataState)),
    map(([action, state]) => ({ type: 'INCREASE' }))
  );
}

@NgModule({
  imports: [EffectsModule.forFeature([FeatureEffects])],
})
class FeatureEffectsModule {}

@NgModule({
  imports: [FeatureEffectsModule, StoreModule.forFeature(FEATURE_KEY, reducer)],
})
class FeatureModule {}

@NgModule({
  imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), FeatureModule],
})
class AppModule {}
