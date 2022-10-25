import { Injectable, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Action,
  createFeatureSelector,
  createSelector,
  select,
  Store,
  StoreModule,
} from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { Actions, EffectsModule, ofType, createEffect } from '../';
import { EffectsFeatureModule } from '../src/effects_feature_module';
import { EffectsRootModule } from '../src/effects_root_module';
import { FEATURE_EFFECTS } from '../src/tokens';

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

      mockEffectSources = TestBed.inject<unknown>(EffectsRootModule) as {
        addEffects: jasmine.Spy;
      };
    });

    it('should add all effects when instantiated', () => {
      TestBed.inject(EffectsFeatureModule);

      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceA);
      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceB);
      expect(mockEffectSources.addEffects).toHaveBeenCalledWith(sourceC);
    });
  });

  describe('when registered in a different NgModule from the feature state', () => {
    let effects: FeatureEffects;
    let store: Store<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AppModule],
      });

      effects = TestBed.inject(FeatureEffects);
      store = TestBed.inject(Store);
    });

    it('should have the feature state defined to select from the createEffect', (done: any) => {
      const action = { type: 'CREATE_INCREMENT' };
      const result = { type: 'CREATE_INCREASE' };

      effects.createEffectWithStore.subscribe((res) => {
        expect(res).toEqual(result);
      });

      store.dispatch(action);

      store.pipe(select(getCreateDataState)).subscribe((data) => {
        expect(data).toBe(220);
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
  createData: number;
}

const initialState: DataState = {
  data: 100,
  createData: 200,
};

function reducer(state: DataState = initialState, action: Action) {
  switch (action.type) {
    case 'INCREASE':
      return {
        ...state,
        data: state.data + 10,
      };
    case 'CREATE_INCREASE':
      return {
        ...state,
        createData: state.createData + 20,
      };
  }
  return state;
}

const getFeatureState = createFeatureSelector<DataState>(FEATURE_KEY);

const getDataState = createSelector(getFeatureState, (state) => state.data);
const getCreateDataState = createSelector(
  getFeatureState,
  (state) => state.createData
);

@Injectable()
class FeatureEffects {
  constructor(private actions: Actions, private store: Store<State>) {}

  createEffectWithStore = createEffect(() =>
    this.actions.pipe(
      ofType('CREATE_INCREMENT'),
      withLatestFrom(this.store.select(getDataState)),
      map(([action, state]) => ({ type: 'CREATE_INCREASE' }))
    )
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
