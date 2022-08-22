import {
  Inject,
  InjectionToken,
  Injector,
  Optional,
  SkipSelf,
  ENVIRONMENT_INITIALIZER,
  inject,
  InjectFlags,
  Provider,
} from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  StoreFeature,
  EnvironmentProviders,
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
  _ACTION_TYPE_UNIQUENESS_CHECK,
  ROOT_STORE_PROVIDER,
  FEATURE_STATE_PROVIDER,
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
import {
  FeatureSlice,
  RootStoreConfig,
  StoreConfig,
  _concatMetaReducers,
  _createFeatureReducers,
  _createFeatureStore,
  _createStoreReducers,
  _initialStateFactory,
  _provideForRootGuard,
} from './store_config';

/**
 * Provides additional slices of state in the Store.
 * These providers cannot be used at the component level.
 *
 * @usageNotes
 *
 * ### Providing Store Features
 *
 * ```ts
 * const booksRoutes: Route[] = [
 *   {
 *     path: '',
 *     providers: [provideState('books', booksReducer)],
 *     children: [
 *       { path: '', component: BookListComponent },
 *       { path: ':id', component: BookDetailsComponent },
 *     ],
 *   },
 * ];
 * ```
 */
export function provideState<T, V extends Action = Action>(
  featureName: string,
  reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
  config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
): EnvironmentProviders;
export function provideState<T, V extends Action = Action>(
  featureName: string,
  reducer: ActionReducer<T, V> | InjectionToken<ActionReducer<T, V>>,
  config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
): EnvironmentProviders;
export function provideState<T, V extends Action = Action>(
  slice: FeatureSlice<T, V>
): EnvironmentProviders;
export function provideState(
  featureNameOrSlice: string | FeatureSlice<any, any>,
  reducers?:
    | ActionReducerMap<any, any>
    | InjectionToken<ActionReducerMap<any, any>>
    | ActionReducer<any, any>
    | InjectionToken<ActionReducer<any, any>>,
  config: StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>> = {}
): EnvironmentProviders {
  return {
    ɵproviders: [
      ..._provideState(featureNameOrSlice, reducers, config),
      ENVIRONMENT_STATE_PROVIDER,
    ],
  };
}

export function _provideStore(
  reducers:
    | ActionReducerMap<any, any>
    | InjectionToken<ActionReducerMap<any, any>>,
  config: RootStoreConfig<any, any>
) {
  return [
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
      useValue: config.reducerFactory ? config.reducerFactory : combineReducers,
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
  ];
}

function rootStoreProviderFactory(): void {
  inject(ActionsSubject);
  inject(ReducerObservable);
  inject(ScannedActionsSubject);
  inject(Store);
  inject(_ROOT_STORE_GUARD, InjectFlags.Optional);
  inject(_ACTION_TYPE_UNIQUENESS_CHECK, InjectFlags.Optional);
}

/**
 * Environment Initializer used in the root
 * providers to initialize the Store
 */
const ENVIRONMENT_STORE_PROVIDER: Provider[] = [
  { provide: ROOT_STORE_PROVIDER, useFactory: rootStoreProviderFactory },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => inject(ROOT_STORE_PROVIDER);
    },
  },
];

/**
 * Provides the global Store providers and initializes
 * the Store.
 * These providers cannot be used at the component level.
 *
 * @usageNotes
 *
 * ### Providing the Global Store
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideStore()],
 * });
 * ```
 */
export function provideStore<T, V extends Action = Action>(
  reducers?: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
  config?: RootStoreConfig<T, V>
): EnvironmentProviders;
export function provideStore(
  reducers:
    | ActionReducerMap<any, any>
    | InjectionToken<ActionReducerMap<any, any>> = {},
  config: RootStoreConfig<any, any> = {}
): EnvironmentProviders {
  return {
    ɵproviders: [
      ..._provideStore(reducers, config),
      ENVIRONMENT_STORE_PROVIDER,
    ],
  };
}

function featureStateProviderFactory() {
  inject(ROOT_STORE_PROVIDER);
  const features = inject<StoreFeature<any, any>[]>(_STORE_FEATURES);
  const featureReducers = inject<ActionReducerMap<any>[]>(FEATURE_REDUCERS);
  const reducerManager = inject(ReducerManager);
  inject(_ACTION_TYPE_UNIQUENESS_CHECK, InjectFlags.Optional);

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

/**
 * Environment Initializer used in the feature
 * providers to register state features
 */
const ENVIRONMENT_STATE_PROVIDER: Provider[] = [
  {
    provide: FEATURE_STATE_PROVIDER,
    useFactory: featureStateProviderFactory,
  },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    deps: [],
    useFactory() {
      return () => inject(FEATURE_STATE_PROVIDER);
    },
  },
];

export function _provideState(
  featureNameOrSlice: string | FeatureSlice<any, any>,
  reducers?:
    | ActionReducerMap<any, any>
    | InjectionToken<ActionReducerMap<any, any>>
    | ActionReducer<any, any>
    | InjectionToken<ActionReducer<any, any>>,
  config: StoreConfig<any, any> | InjectionToken<StoreConfig<any, any>> = {}
) {
  return [
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
          : reducers,
    },
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
    checkForActionTypeUniqueness(),
  ];
}
