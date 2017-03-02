import { NgModule, Inject, ModuleWithProviders, OnDestroy } from '@angular/core';
import { Action, ActionReducerMap, ActionReducerFactory, StoreFeature } from './models';
import { combineReducers } from './utils';
import { INITIAL_STATE, INITIAL_REDUCERS, REDUCER_FACTORY, STORE_FEATURES } from './tokens';
import { ACTIONS_SUBJECT_PROVIDERS } from './actions_subject';
import { REDUCER_MANAGER_PROVIDERS, ReducerManager } from './reducer_manager';
import { SCANNED_ACTIONS_SUBJECT_PROVIDERS } from './scanned_actions_subject';
import { STATE_PROVIDERS } from './state';
import { STORE_PROVIDERS } from './store';



@NgModule({ })
export class StoreRootModule {

}

@NgModule({ })
export class StoreFeatureModule implements OnDestroy {
  constructor(
    @Inject(STORE_FEATURES) private features: StoreFeature<any, any>[],
    private reducerManager: ReducerManager
  ) {
    features.forEach(feature => reducerManager.addFeature(feature));
  }

  ngOnDestroy() {
    this.features.forEach(feature => this.reducerManager.removeFeature(feature));
  }
}

export type StoreConfig<T, V extends Action> = { initialState?: T, reducerFactory?: ActionReducerFactory<T, V> };

@NgModule({ })
export class StoreModule {
  static forRoot<T, V extends Action>(reducers: ActionReducerMap<T, V>, config?: StoreConfig<T, V>): ModuleWithProviders;
  static forRoot<T>(reducers: ActionReducerMap<T, Action>, config?: StoreConfig<T, Action>): ModuleWithProviders;
  static forRoot(reducers: ActionReducerMap<any, any>, config: StoreConfig<any, any> = { }): ModuleWithProviders {
    return {
      ngModule: StoreRootModule,
      providers: [
        { provide: INITIAL_STATE, useValue: config.initialState },
        { provide: INITIAL_REDUCERS, useValue: reducers },
        { provide: REDUCER_FACTORY, useValue: config.reducerFactory ? config.reducerFactory : combineReducers },
        ACTIONS_SUBJECT_PROVIDERS,
        REDUCER_MANAGER_PROVIDERS,
        SCANNED_ACTIONS_SUBJECT_PROVIDERS,
        STATE_PROVIDERS,
        STORE_PROVIDERS,
      ]
    };
  }

  static forFeature<T, V extends Action>(featureName: string, reducers: ActionReducerMap<T, V>, config?: StoreConfig<T, V>): ModuleWithProviders;
  static forFeature<T>(featureName: string, reducers: ActionReducerMap<T, Action>, config?: StoreConfig<T, Action>): ModuleWithProviders;
  static forFeature(featureName: string, reducers: ActionReducerMap<any, any>, config: StoreConfig<any, any> = {}): ModuleWithProviders {
    return {
      ngModule: StoreFeatureModule,
      providers: [
        {
          provide: STORE_FEATURES,
          multi: true,
          useValue: <StoreFeature<any, any>>{
            key: featureName,
            reducers: reducers,
            reducerFactory: config.reducerFactory ? config.reducerFactory : combineReducers,
            initialState: config.initialState
          }
        }
      ]
    };
  }
}
