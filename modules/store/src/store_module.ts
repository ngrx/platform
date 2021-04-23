import {
  NgModule,
  Inject,
  ModuleWithProviders,
  OnDestroy,
  InjectionToken,
  Injector,
  Optional,
  SkipSelf,
} from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  ActionReducerFactory,
  StoreFeature,
  InitialState,
  MetaReducer,
  RuntimeChecks,
} from './models';
import { combineReducers, createReducerFactory } from './utils';
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
  _STORE_FEATURES,
  _FEATURE_CONFIGS,
  USER_PROVIDED_META_REDUCERS,
  _RESOLVED_META_REDUCERS,
  _ROOT_STORE_GUARD,
  ACTIVE_RUNTIME_CHECKS,
  _ACTION_TYPE_UNIQUENESS_CHECK,
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
import { STORE_PROVIDERS, Store } from './store';
import {
  provideRuntimeChecks,
  checkForActionTypeUniqueness,
} from './runtime_checks';

@NgModule({})
export class StoreRootModule {
  constructor(
    actions$: ActionsSubject,
    reducer$: ReducerObservable,
    scannedActions$: ScannedActionsSubject,
    store: Store<any>,
    @Optional()
    @Inject(_ROOT_STORE_GUARD)
    guard: any,
    @Optional()
    @Inject(_ACTION_TYPE_UNIQUENESS_CHECK)
    actionCheck: any
  ) {}
}

@NgModule({})
export class StoreFeatureModule implements OnDestroy {
  constructor(
    @Inject(_STORE_FEATURES) private features: StoreFeature<any, any>[],
    @Inject(FEATURE_REDUCERS) private featureReducers: ActionReducerMap<any>[],
    private reducerManager: ReducerManager,
    root: StoreRootModule,
    @Optional()
    @Inject(_ACTION_TYPE_UNIQUENESS_CHECK)
    actionCheck: any
  ) {
    const feats = features.map((feature, index) => {
      const featureReducerCollection = featureReducers.shift();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const reducers = featureReducerCollection! /*TODO(#823)*/[index];

      return {
        ...feature,
        reducers,
        initialState: _initialStateFactory(feature.initialState),
      };
    });

    reducerManager.addFeatures(feats);
  }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnDestroy() {
    this.reducerManager.removeFeatures(this.features);
  }
}

export interface StoreConfig<T, V extends Action = Action> {
  initialState?: InitialState<T>;
  reducerFactory?: ActionReducerFactory<T, V>;
  metaReducers?: MetaReducer<T, V>[];
}

export interface RootStoreConfig<T, V extends Action = Action>
  extends StoreConfig<T, V> {
  runtimeChecks?: Partial<RuntimeChecks>;
}

/**
 * An object with the name and the reducer for the feature.
 */
export interface FeatureSlice<T, V extends Action = Action> {
  name: string;
  reducer: ActionReducer<T, V>;
}

@NgModule({})
export class StoreModule {
  static forRoot<T, V extends Action = Action>(
    reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
    config?: RootStoreConfig<T, V>
  ): ModuleWithProviders<StoreRootModule>;
  static forRoot(
    reducers:
      | ActionReducerMap<any, any>
      | InjectionToken<ActionReducerMap<any, any>>,
    config: RootStoreConfig<any, any> = {}
  ): ModuleWithProviders<StoreRootModule> {
    return {
      ngModule: StoreRootModule,
      providers: [
        {
          provide: _ROOT_STORE_GUARD,
          useFactory: _provideForRootGuard,
          deps: [[Store, new Optional(), new SkipSelf()]],
        },
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
          provide: USER_PROVIDED_META_REDUCERS,
          useValue: config.metaReducers ? config.metaReducers : [],
        },
        {
          provide: _RESOLVED_META_REDUCERS,
          deps: [META_REDUCERS, USER_PROVIDED_META_REDUCERS],
          useFactory: _concatMetaReducers,
        },
        {
          provide: _REDUCER_FACTORY,
          useValue: config.reducerFactory
            ? config.reducerFactory
            : combineReducers,
        },
        {
          provide: REDUCER_FACTORY,
          deps: [_REDUCER_FACTORY, _RESOLVED_META_REDUCERS],
          useFactory: createReducerFactory,
        },
        ACTIONS_SUBJECT_PROVIDERS,
        REDUCER_MANAGER_PROVIDERS,
        SCANNED_ACTIONS_SUBJECT_PROVIDERS,
        STATE_PROVIDERS,
        STORE_PROVIDERS,
        provideRuntimeChecks(config.runtimeChecks),
        checkForActionTypeUniqueness(),
      ],
    };
  }

  static forFeature<T, V extends Action = Action>(
    featureName: string,
    reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
    config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
  ): ModuleWithProviders<StoreFeatureModule>;
  static forFeature<T, V extends Action = Action>(
    featureName: string,
    reducer: ActionReducer<T, V> | InjectionToken<ActionReducer<T, V>>,
    config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
  ): ModuleWithProviders<StoreFeatureModule>;
  static forFeature<T, V extends Action = Action>(
    slice: FeatureSlice<T, V>,
    config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
  ): ModuleWithProviders<StoreFeatureModule>;
  static forFeature(
    featureNameOrSlice: string | FeatureSlice<any, any>,
    reducersOrConfig?:
      | ActionReducerMap<any, any>
      | InjectionToken<ActionReducerMap<any, any>>
      | ActionReducer<any, any>
      | InjectionToken<ActionReducer<any, any>>
      | StoreConfig<any, any>
      | InjectionToken<StoreConfig<any, any>>,
    config: StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>> = {}
  ): ModuleWithProviders<StoreFeatureModule> {
    return {
      ngModule: StoreFeatureModule,
      providers: [
        {
          provide: _FEATURE_CONFIGS,
          multi: true,
          useValue: featureNameOrSlice instanceof Object ? {} : config,
        },
        {
          provide: STORE_FEATURES,
          multi: true,
          useValue: {
            key:
              featureNameOrSlice instanceof Object
                ? featureNameOrSlice.name
                : featureNameOrSlice,
            reducerFactory:
              !(config instanceof InjectionToken) && config.reducerFactory
                ? config.reducerFactory
                : combineReducers,
            metaReducers:
              !(config instanceof InjectionToken) && config.metaReducers
                ? config.metaReducers
                : [],
            initialState:
              !(config instanceof InjectionToken) && config.initialState
                ? config.initialState
                : undefined,
          },
        },
        {
          provide: _STORE_FEATURES,
          deps: [Injector, _FEATURE_CONFIGS, STORE_FEATURES],
          useFactory: _createFeatureStore,
        },
        {
          provide: _FEATURE_REDUCERS,
          multi: true,
          useValue:
            featureNameOrSlice instanceof Object
              ? featureNameOrSlice.reducer
              : reducersOrConfig,
        },
        {
          provide: _FEATURE_REDUCERS_TOKEN,
          multi: true,
          useExisting:
            reducersOrConfig instanceof InjectionToken
              ? reducersOrConfig
              : _FEATURE_REDUCERS,
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
        checkForActionTypeUniqueness(),
      ],
    };
  }
}

export function _createStoreReducers(
  injector: Injector,
  reducers: ActionReducerMap<any, any>
) {
  return reducers instanceof InjectionToken ? injector.get(reducers) : reducers;
}

export function _createFeatureStore(
  injector: Injector,
  configs: StoreConfig<any, any>[] | InjectionToken<StoreConfig<any, any>>[],
  featureStores: StoreFeature<any, any>[]
) {
  return featureStores.map((feat, index) => {
    if (configs[index] instanceof InjectionToken) {
      const conf = injector.get(configs[index]);
      return {
        key: feat.key,
        reducerFactory: conf.reducerFactory
          ? conf.reducerFactory
          : combineReducers,
        metaReducers: conf.metaReducers ? conf.metaReducers : [],
        initialState: conf.initialState,
      };
    }
    return feat;
  });
}

export function _createFeatureReducers(
  injector: Injector,
  reducerCollection: ActionReducerMap<any, any>[]
) {
  const reducers = reducerCollection.map((reducer) => {
    return reducer instanceof InjectionToken ? injector.get(reducer) : reducer;
  });

  return reducers;
}

export function _initialStateFactory(initialState: any): any {
  if (typeof initialState === 'function') {
    return initialState();
  }

  return initialState;
}

export function _concatMetaReducers(
  metaReducers: MetaReducer[],
  userProvidedMetaReducers: MetaReducer[]
): MetaReducer[] {
  return metaReducers.concat(userProvidedMetaReducers);
}

export function _provideForRootGuard(store: Store<any>): any {
  if (store) {
    throw new TypeError(
      `StoreModule.forRoot() called twice. Feature modules should use StoreModule.forFeature() instead.`
    );
  }
  return 'guarded';
}
