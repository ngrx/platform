import {
  NgModule,
  Inject,
  ModuleWithProviders,
  OnDestroy,
  InjectionToken,
  Injector,
} from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  ActionReducerFactory,
  StoreFeature,
  InitialState,
  MetaReducer,
} from './models';
import { compose, combineReducers, createReducerFactory } from './utils';
import {
  INITIAL_STATE,
  INITIAL_REDUCERS,
  _INITIAL_REDUCERS,
  REDUCER_FACTORY,
  _REDUCER_FACTORY,
  STORE_FEATURES,
  _INITIAL_STATE,
  META_REDUCERS,
  _STORE_REDUCERS,
  FEATURE_REDUCERS,
  _FEATURE_REDUCERS,
  _FEATURE_REDUCERS_TOKEN,
} from './tokens';
import { ACTIONS_SUBJECT_PROVIDERS, ActionsSubject } from './actions_subject';
import {
  REDUCER_MANAGER_PROVIDERS,
  ReducerManager,
  ReducerObservable,
} from './reducer_manager';
import {
  SCANNED_ACTIONS_SUBJECT_PROVIDERS,
  ScannedActionsSubject,
} from './scanned_actions_subject';
import { STATE_PROVIDERS } from './state';
import { STORE_PROVIDERS } from './store';

@NgModule({})
export class StoreRootModule {
  constructor(
    actions$: ActionsSubject,
    reducer$: ReducerObservable,
    scannedActions$: ScannedActionsSubject
  ) {}
}

@NgModule({})
export class StoreFeatureModule implements OnDestroy {
  constructor(
    @Inject(STORE_FEATURES) private features: StoreFeature<any, any>[],
    @Inject(FEATURE_REDUCERS) private featureReducers: ActionReducerMap<any>[],
    private reducerManager: ReducerManager
  ) {
    features
      .map((feature, index) => {
        const featureReducerCollection = featureReducers.shift();
        const reducers = featureReducerCollection[index];

        return {
          ...feature,
          reducers,
          initialState: _initialStateFactory(feature.initialState),
        };
      })
      .forEach(feature => reducerManager.addFeature(feature));
  }

  ngOnDestroy() {
    this.features.forEach(feature =>
      this.reducerManager.removeFeature(feature)
    );
  }
}

export type StoreConfig<T, V extends Action = Action> = {
  initialState?: InitialState<T>;
  reducerFactory?: ActionReducerFactory<T, V>;
  metaReducers?: MetaReducer<T, V>[];
};

@NgModule({})
export class StoreModule {
  static forRoot<T, V extends Action = Action>(
    reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
    config?: StoreConfig<T, V>
  ): ModuleWithProviders;
  static forRoot(
    reducers:
      | ActionReducerMap<any, any>
      | InjectionToken<ActionReducerMap<any, any>>,
    config: StoreConfig<any, any> = {}
  ): ModuleWithProviders {
    return {
      ngModule: StoreRootModule,
      providers: [
        { provide: _INITIAL_STATE, useValue: config.initialState },
        {
          provide: INITIAL_STATE,
          useFactory: _initialStateFactory,
          deps: [_INITIAL_STATE],
        },
        { provide: _INITIAL_REDUCERS, useValue: reducers },
        {
          provide: _STORE_REDUCERS,
          useExisting:
            reducers instanceof InjectionToken ? reducers : _INITIAL_REDUCERS,
        },
        {
          provide: INITIAL_REDUCERS,
          deps: [Injector, _INITIAL_REDUCERS, [new Inject(_STORE_REDUCERS)]],
          useFactory: _createStoreReducers,
        },
        {
          provide: META_REDUCERS,
          useValue: config.metaReducers ? config.metaReducers : [],
        },
        {
          provide: _REDUCER_FACTORY,
          useValue: config.reducerFactory
            ? config.reducerFactory
            : combineReducers,
        },
        {
          provide: REDUCER_FACTORY,
          deps: [_REDUCER_FACTORY, META_REDUCERS],
          useFactory: createReducerFactory,
        },
        ACTIONS_SUBJECT_PROVIDERS,
        REDUCER_MANAGER_PROVIDERS,
        SCANNED_ACTIONS_SUBJECT_PROVIDERS,
        STATE_PROVIDERS,
        STORE_PROVIDERS,
      ],
    };
  }

  static forFeature<T, V extends Action = Action>(
    featureName: string,
    reducers: ActionReducerMap<T, V>,
    config?: StoreConfig<T, V>
  ): ModuleWithProviders;
  static forFeature<T, V extends Action = Action>(
    featureName: string,
    reducer: ActionReducer<T, V>,
    config?: StoreConfig<T, V>
  ): ModuleWithProviders;
  static forFeature(
    featureName: string,
    reducers: ActionReducerMap<any, any> | ActionReducer<any, any>,
    config: StoreConfig<any, any> = {}
  ): ModuleWithProviders {
    return {
      ngModule: StoreFeatureModule,
      providers: [
        {
          provide: STORE_FEATURES,
          multi: true,
          useValue: <StoreFeature<any, any>>{
            key: featureName,
            reducerFactory: config.reducerFactory
              ? config.reducerFactory
              : combineReducers,
            metaReducers: config.metaReducers ? config.metaReducers : [],
            initialState: config.initialState,
          },
        },
        { provide: _FEATURE_REDUCERS, multi: true, useValue: reducers },
        {
          provide: _FEATURE_REDUCERS_TOKEN,
          multi: true,
          useExisting:
            reducers instanceof InjectionToken ? reducers : _FEATURE_REDUCERS,
        },
        {
          provide: FEATURE_REDUCERS,
          multi: true,
          deps: [
            Injector,
            _FEATURE_REDUCERS,
            [new Inject(_FEATURE_REDUCERS_TOKEN)],
          ],
          useFactory: _createFeatureReducers,
        },
      ],
    };
  }
}

export function _createStoreReducers(
  injector: Injector,
  reducers: ActionReducerMap<any, any>,
  tokenReducers: ActionReducerMap<any, any>
) {
  return reducers instanceof InjectionToken ? injector.get(reducers) : reducers;
}

export function _createFeatureReducers(
  injector: Injector,
  reducerCollection: ActionReducerMap<any, any>[],
  tokenReducerCollection: ActionReducerMap<any, any>[]
) {
  return reducerCollection.map((reducer, index) => {
    return reducer instanceof InjectionToken ? injector.get(reducer) : reducer;
  });
}

export function _initialStateFactory(initialState: any): any {
  if (typeof initialState === 'function') {
    return initialState();
  }

  return initialState;
}
