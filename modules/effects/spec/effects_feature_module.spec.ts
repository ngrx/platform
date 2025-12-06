import { vi, type MockInstance } from 'vitest';
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
import { firstValueFrom } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { Actions, EffectsModule, ofType, createEffect } from '../';
import { EffectsFeatureModule } from '../src/effects_feature_module';
import { EffectsRootModule } from '../src/effects_root_module';
import { _FEATURE_EFFECTS_INSTANCE_GROUPS } from '../src/tokens';

describe('Effects Feature Module', () => {
  describe('when registered', () => {
    const sourceA = 'sourceA';
    const sourceB = 'sourceB';
    const sourceC = 'sourceC';
    const effectSourceGroups = [[sourceA], [sourceB], [sourceC]];

    let mockEffectSources: { addEffects: MockInstance };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: EffectsRootModule,
            useValue: {
              addEffects: vi.fn(),
            },
          },
          {
            provide: _FEATURE_EFFECTS_INSTANCE_GROUPS,
            useValue: effectSourceGroups,
          },
          EffectsFeatureModule,
        ],
      });

      mockEffectSources = TestBed.inject<unknown>(EffectsRootModule) as {
        addEffects: MockInstance;
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

    it('should have the feature state defined to select from the createEffect', async () => {
      const action = { type: 'CREATE_INCREMENT' };
      const result = { type: 'CREATE_INCREASE' };

      const effectPromise = firstValueFrom(
        effects.createEffectWithStore.pipe(take(1))
      );

      store.dispatch(action);

      const res = await effectPromise;
      expect(res).toEqual(result);

      const data = await firstValueFrom(
        store.pipe(select(getCreateDataState), take(1))
      );
      expect(data).toBe(220);
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
  constructor(
    private actions: Actions,
    private store: Store<State>
  ) {}

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
