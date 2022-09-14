import {
  ModuleWithProviders,
  NgModule,
  Inject,
  Injector,
  InjectionToken,
  Optional,
  OnDestroy,
} from '@angular/core';

import {
  Action,
  combineReducers,
  MetaReducer,
  ReducerManager,
  StoreModule,
} from '@ngrx/store';

import { EntityCache } from './reducers/entity-cache';
import { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
import {
  ENTITY_CACHE_NAME,
  ENTITY_CACHE_NAME_TOKEN,
  ENTITY_CACHE_META_REDUCERS,
  INITIAL_ENTITY_CACHE_STATE,
} from './reducers/constants';

import {
  EntityDataModuleConfig,
  _provideEntityDataWithoutEffects,
} from './provide_entity_data';

/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
@NgModule({
  imports: [
    StoreModule, // rely on Store feature providers rather than Store.forFeature()
  ],
  providers: [],
})
export class EntityDataModuleWithoutEffects implements OnDestroy {
  private entityCacheFeature: any;

  static forRoot(
    config: EntityDataModuleConfig
  ): ModuleWithProviders<EntityDataModuleWithoutEffects> {
    return {
      ngModule: EntityDataModuleWithoutEffects,
      providers: [..._provideEntityDataWithoutEffects(config)],
    };
  }

  constructor(
    private reducerManager: ReducerManager,
    entityCacheReducerFactory: EntityCacheReducerFactory,
    private injector: Injector,
    // optional params
    @Optional()
    @Inject(ENTITY_CACHE_NAME_TOKEN)
    private entityCacheName: string,
    @Optional()
    @Inject(INITIAL_ENTITY_CACHE_STATE)
    private initialState: any,
    @Optional()
    @Inject(ENTITY_CACHE_META_REDUCERS)
    private metaReducers: (
      | MetaReducer<EntityCache, Action>
      | InjectionToken<MetaReducer<EntityCache, Action>>
    )[]
  ) {
    // Add the @ngrx/data feature to the Store's features
    // as Store.forFeature does for StoreFeatureModule
    const key = entityCacheName || ENTITY_CACHE_NAME;

    initialState =
      typeof initialState === 'function' ? initialState() : initialState;

    const reducers: MetaReducer<EntityCache, Action>[] = (
      metaReducers || []
    ).map((mr) => {
      return mr instanceof InjectionToken ? injector.get(mr) : mr;
    });

    this.entityCacheFeature = {
      key,
      reducers: entityCacheReducerFactory.create(),
      reducerFactory: combineReducers,
      initialState: initialState || {},
      metaReducers: reducers,
    };
    reducerManager.addFeature(this.entityCacheFeature);
  }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnDestroy() {
    this.reducerManager.removeFeature(this.entityCacheFeature);
  }
}
