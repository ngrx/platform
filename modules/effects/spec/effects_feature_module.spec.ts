import { TestBed } from '@angular/core/testing';
import { NgModule, Injectable } from '@angular/core';
import {
  StoreModule,
  Store,
  Action,
  createFeatureSelector,
  createSelector,
  select,
} from '@ngrx/store';
import { tap, withLatestFrom, map, mergeMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { cold } from 'jasmine-marbles';
import { EffectSources } from '../src/effect_sources';
import { FEATURE_EFFECTS } from '../src/tokens';
import { EffectsFeatureModule } from '../src/effects_feature_module';
import { EffectsRootModule } from '../src/effects_root_module';
import { EffectsModule, Effect, Actions, ofType } from '../';

describe('Effects Feature Module', () => {
  describe('when registered', () => {
    const sourceA = 'sourceA';
    const sourceB = 'sourceB';
    const sourceC = 'sourceC';
    const effectSourceGroups = [[sourceA], [sourceB], [sourceC]];
    let mockEffectSources: { addEffects: jasmine.Spy };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
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
    });

    it('should add all effects when instantiated', () => {
      TestBed.get(EffectsFeatureModule);

      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceA);
      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceB);
      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceC);
    });
  });

  describe('when registered in a different NgModule from the feature state', () => {
    let effects: FeatureEffects;
    let actions$: Observable<any>;
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

      store.pipe(select(getDataState)).subscribe(res => {
        expect(res).toBe(110);
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
}

const initialState: DataState = {
  data: 100,
};

function reducer(state: DataState = initialState, action: Action) {
  switch (action.type) {
    case 'INCREASE':
      return {
        data: state.data + 10,
      };
  }
  return state;
}

const getFeatureState = createFeatureSelector<DataState>(FEATURE_KEY);

const getDataState = createSelector(getFeatureState, state => state.data);

@Injectable()
class FeatureEffects {
  constructor(private actions: Actions, private store: Store<State>) {}

  @Effect()
  effectWithStore = this.actions
    .ofType('INCREMENT')
    .pipe(
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
