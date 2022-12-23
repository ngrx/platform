import {
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  OnDestroy,
  Optional,
} from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  StoreFeature,
} from './models';
import {
  _ACTION_TYPE_UNIQUENESS_CHECK,
  _ROOT_STORE_GUARD,
  _STORE_FEATURES,
  FEATURE_REDUCERS,
} from './tokens';
import { ActionsSubject } from './actions_subject';
import { ReducerManager, ReducerObservable } from './reducer_manager';
import { ScannedActionsSubject } from './scanned_actions_subject';
import { Store } from './store';
import {
  _initialStateFactory,
  FeatureSlice,
  RootStoreConfig,
  StoreConfig,
} from './store_config';
import { _provideState, _provideStore } from './provide_store';

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

@NgModule({})
export class StoreModule {
  static forRoot<T, V extends Action = Action>(
    reducers?: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
    config?: RootStoreConfig<T, V>
  ): ModuleWithProviders<StoreRootModule> {
    return {
      ngModule: StoreRootModule,
      providers: [..._provideStore(reducers, config)],
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
    slice: FeatureSlice<T, V>
  ): ModuleWithProviders<StoreFeatureModule>;
  static forFeature<T, V extends Action = Action>(
    featureNameOrSlice: string | FeatureSlice<T, V>,
    reducers?:
      | ActionReducerMap<T, V>
      | InjectionToken<ActionReducerMap<T, V>>
      | ActionReducer<T, V>
      | InjectionToken<ActionReducer<T, V>>,
    config: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>> = {}
  ): ModuleWithProviders<StoreFeatureModule> {
    return {
      ngModule: StoreFeatureModule,
      providers: [..._provideState(featureNameOrSlice, reducers, config)],
    };
  }
}
