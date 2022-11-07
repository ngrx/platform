import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import {
  ActionReducerFactory,
  combineReducers,
  MetaReducer,
  ReducerManager,
} from '@ngrx/store';
import { EffectSources } from '@ngrx/effects';
import { EntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
import { EntityActionFactory } from './actions/entity-action-factory';
import { EntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
import { entityCacheSelectorProvider } from './selectors/entity-cache-selector';
import { EntityCollectionServiceElementsFactory } from './entity-services/entity-collection-service-elements-factory';
import { EntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
import { EntityServices } from './entity-services/entity-services';
import { EntityCollectionCreator } from './reducers/entity-collection-creator';
import { EntityCollectionReducerFactory } from './reducers/entity-collection-reducer';
import { EntityCollectionReducerMethodsFactory } from './reducers/entity-collection-reducer-methods';
import { EntityCollectionReducerRegistry } from './reducers/entity-collection-reducer-registry';
import { EntityDispatcherFactory } from './dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from './entity-metadata/entity-definition.service';
import { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
import {
  ENTITY_CACHE_META_REDUCERS,
  ENTITY_CACHE_NAME,
  ENTITY_CACHE_NAME_TOKEN,
  ENTITY_COLLECTION_META_REDUCERS,
  INITIAL_ENTITY_CACHE_STATE,
} from './reducers/constants';
import { EntityCache } from './reducers/entity-cache';
import { EntitySelectorsFactory } from './selectors/entity-selectors';
import { EntitySelectors$Factory } from './selectors/entity-selectors$';
import { EntityServicesBase } from './entity-services/entity-services-base';
import { EntityServicesElements } from './entity-services/entity-services-elements';
import { DefaultLogger } from './utils/default-logger';
import { Logger, PLURAL_NAMES_TOKEN, Pluralizer } from './utils/interfaces';
import { CorrelationIdGenerator } from './utils/correlation-id-generator';
import { ENTITY_METADATA_TOKEN } from './entity-metadata/entity-metadata';
import { DefaultDataServiceFactory } from './dataservices/default-data.service';
import {
  DefaultPersistenceResultHandler,
  PersistenceResultHandler,
} from './dataservices/persistence-result-handler.service';
import {
  DefaultHttpUrlGenerator,
  HttpUrlGenerator,
} from './dataservices/http-url-generator';
import { EntityCacheDataService } from './dataservices/entity-cache-data.service';
import { EntityDataService } from './dataservices/entity-data.service';
import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityEffects } from './effects/entity-effects';
import { DefaultPluralizer } from './utils/default-pluralizer';
import { EntityDataModuleConfig } from './entity-data-config';

export const ENTITY_DATA_WITHOUT_EFFECTS_PROVIDERS: Provider[] = [
  CorrelationIdGenerator,
  EntityDispatcherDefaultOptions,
  EntityActionFactory,
  EntityCacheDispatcher,
  EntityCacheReducerFactory,
  entityCacheSelectorProvider,
  EntityCollectionCreator,
  EntityCollectionReducerFactory,
  EntityCollectionReducerMethodsFactory,
  EntityCollectionReducerRegistry,
  EntityCollectionServiceElementsFactory,
  EntityCollectionServiceFactory,
  EntityDefinitionService,
  EntityDispatcherFactory,
  EntitySelectorsFactory,
  EntitySelectors$Factory,
  EntityServicesElements,
  { provide: ENTITY_CACHE_NAME_TOKEN, useValue: ENTITY_CACHE_NAME },
  { provide: EntityServices, useClass: EntityServicesBase },
  { provide: Logger, useClass: DefaultLogger },
];

const ENTITY_DATA_WITHOUT_EFFECTS_ENV_PROVIDER: Provider = {
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useValue: () => initializeEntityDataWithoutEffects(),
};

export function initializeEntityDataWithoutEffects(): void {
  const reducerManager = inject(ReducerManager);
  const entityCacheReducerFactory = inject(EntityCacheReducerFactory);
  const entityCacheName = inject(ENTITY_CACHE_NAME_TOKEN, {
    optional: true,
  });
  const initialStateOrFn = inject(INITIAL_ENTITY_CACHE_STATE, {
    optional: true,
  });
  const metaReducersOrTokens = inject<
    Array<MetaReducer<EntityCache> | InjectionToken<MetaReducer<EntityCache>>>
  >(ENTITY_CACHE_META_REDUCERS, {
    optional: true,
  });

  // Add the @ngrx/data feature to the Store's features
  const key = entityCacheName || ENTITY_CACHE_NAME;
  const metaReducers = (metaReducersOrTokens || []).map((mr) => {
    return mr instanceof InjectionToken ? inject(mr) : mr;
  });
  const initialState =
    typeof initialStateOrFn === 'function'
      ? initialStateOrFn()
      : initialStateOrFn;

  const entityCacheFeature = {
    key,
    reducers: entityCacheReducerFactory.create(),
    reducerFactory: combineReducers as ActionReducerFactory<unknown>,
    initialState: initialState || {},
    metaReducers: metaReducers,
  };
  reducerManager.addFeature(entityCacheFeature);
}

export function provideRootEntityDataWithoutEffects(
  config: EntityDataModuleConfig
): Provider[] {
  return [
    {
      provide: ENTITY_CACHE_META_REDUCERS,
      useValue: config.entityCacheMetaReducers
        ? config.entityCacheMetaReducers
        : [],
    },
    {
      provide: ENTITY_COLLECTION_META_REDUCERS,
      useValue: config.entityCollectionMetaReducers
        ? config.entityCollectionMetaReducers
        : [],
    },
    {
      provide: PLURAL_NAMES_TOKEN,
      multi: true,
      useValue: config.pluralNames ? config.pluralNames : {},
    },
  ];
}

export function provideEntityDataWithoutEffects(
  config: EntityDataModuleConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ENTITY_DATA_WITHOUT_EFFECTS_PROVIDERS,
    provideRootEntityDataWithoutEffects(config),
    ENTITY_DATA_WITHOUT_EFFECTS_ENV_PROVIDER,
  ]);
}

export const ENTITY_DATA_PROVIDERS: Provider[] = [
  DefaultDataServiceFactory,
  EntityCacheDataService,
  EntityDataService,
  EntityCacheEffects,
  EntityEffects,
  { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
  {
    provide: PersistenceResultHandler,
    useClass: DefaultPersistenceResultHandler,
  },
  { provide: Pluralizer, useClass: DefaultPluralizer },
];

const ENTITY_DATA_ENV_PROVIDER: Provider = {
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useValue: () => initializeEntityData(),
};

export function initializeEntityData(): void {
  const effectsSources = inject(EffectSources);
  const entityCacheEffects = inject(EntityCacheEffects);
  const entityEffects = inject(EntityEffects);

  effectsSources.addEffects(entityCacheEffects);
  effectsSources.addEffects(entityEffects);
}

export function provideRootEntityData(
  config: EntityDataModuleConfig
): Provider[] {
  return [
    {
      provide: ENTITY_METADATA_TOKEN,
      multi: true,
      useValue: config.entityMetadata ? config.entityMetadata : [],
    },
  ];
}

export function provideEntityData(
  config: EntityDataModuleConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    // add EntityDataWithoutEffects providers
    ENTITY_DATA_WITHOUT_EFFECTS_PROVIDERS,
    provideRootEntityDataWithoutEffects(config),
    ENTITY_DATA_WITHOUT_EFFECTS_ENV_PROVIDER,
    // add EntityData providers
    ENTITY_DATA_PROVIDERS,
    provideRootEntityData(config),
    ENTITY_DATA_ENV_PROVIDER,
  ]);
}
