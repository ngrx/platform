import {
  EnvironmentProviders,
  ENVIRONMENT_INITIALIZER,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';
import { Action, MetaReducer } from '@ngrx/store';
import { DefaultDataServiceFactory } from './dataservices/default-data.service';
import { EntityCacheDataService } from './dataservices/entity-cache-data.service';
import { EntityDataService } from './dataservices/entity-data.service';
import {
  DefaultHttpUrlGenerator,
  HttpUrlGenerator,
} from './dataservices/http-url-generator';
import {
  DefaultPersistenceResultHandler,
  PersistenceResultHandler,
} from './dataservices/persistence-result-handler.service';
import { EntityCacheEffects } from './effects/entity-cache-effects';
import { EntityEffects } from './effects/entity-effects';
import {
  EntityMetadataMap,
  ENTITY_METADATA_TOKEN,
} from './entity-metadata/entity-metadata';
import {
  ENTITY_CACHE_META_REDUCERS,
  ENTITY_CACHE_NAME,
  ENTITY_CACHE_NAME_TOKEN,
  ENTITY_COLLECTION_META_REDUCERS,
} from './reducers/constants';
import { DefaultPluralizer } from './utils/default-pluralizer';
import { Logger, Pluralizer, PLURAL_NAMES_TOKEN } from './utils/interfaces';
import { EntityCollectionCreator } from './reducers/entity-collection-creator';
import { EntityCollectionReducerFactory } from './reducers/entity-collection-reducer';
import { EntityCollectionReducerMethodsFactory } from './reducers/entity-collection-reducer-methods';
import { EntityCollectionReducerRegistry } from './reducers/entity-collection-reducer-registry';
import { EntityDispatcherFactory } from './dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from './entity-metadata/entity-definition.service';
import { EntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
import { EntityCollectionServiceElementsFactory } from './entity-services/entity-collection-service-elements-factory';
import { EntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
import { EntityServices } from './entity-services/entity-services';
import { CorrelationIdGenerator } from './utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
import { EntityActionFactory } from './actions/entity-action-factory';
import { DefaultLogger } from './utils/default-logger';
import { EntitySelectorsFactory } from './selectors/entity-selectors';
import { EntitySelectors$Factory } from './selectors/entity-selectors$';
import { EntityServicesBase } from './entity-services/entity-services-base';
import { EntityServicesElements } from './entity-services/entity-services-elements';
import { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
import { EntityCache } from './reducers/entity-cache';
import { EntityCollection } from './reducers/entity-collection';
import { EntityAction } from './actions/entity-action';
import {
  createEntityCacheSelector,
  ENTITY_CACHE_SELECTOR_TOKEN,
} from './selectors/entity-cache-selector';

export interface EntityDataModuleConfig {
  entityMetadata?: EntityMetadataMap;
  entityCacheMetaReducers?: (
    | MetaReducer<EntityCache, Action>
    | InjectionToken<MetaReducer<EntityCache, Action>>
  )[];
  entityCollectionMetaReducers?: MetaReducer<EntityCollection, EntityAction>[];
  // Initial EntityCache state or a function that returns that state
  initialEntityCacheState?: EntityCache | (() => EntityCache);
  pluralNames?: { [name: string]: string };
}

export function _provideEntityData(config: EntityDataModuleConfig): Provider[] {
  return [
    DefaultDataServiceFactory,
    EntityCacheDataService,
    EntityDataService,
    EntityCacheEffects,
    EntityEffects,
    EntityCacheReducerFactory,
    EntityCollectionCreator,
    EntityCollectionReducerRegistry,
    EntityCollectionReducerFactory,
    EntityCollectionReducerMethodsFactory,
    EntityDefinitionService,
    EntityCollectionServiceElementsFactory,
    EntityDispatcherFactory,
    EntityActionFactory,
    EntityDispatcherDefaultOptions,
    CorrelationIdGenerator,
    EntitySelectorsFactory,
    EntitySelectors$Factory,
    { provide: EntityServices, useClass: EntityServicesBase },
    { provide: HttpUrlGenerator, useClass: DefaultHttpUrlGenerator },
    {
      provide: PersistenceResultHandler,
      useClass: DefaultPersistenceResultHandler,
    },
    { provide: Pluralizer, useClass: DefaultPluralizer },
    {
      provide: ENTITY_METADATA_TOKEN,
      multi: true,
      useValue: config.entityMetadata ? config.entityMetadata : [],
    },
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

export function _provideEntityDataWithoutEffects(
  config: EntityDataModuleConfig
) {
  return [
    CorrelationIdGenerator,
    EntityDispatcherDefaultOptions,
    EntityActionFactory,
    EntityCacheDispatcher,
    EntityCacheReducerFactory,
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

/**
 *
 * @usageNotes
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideEntityData()],
 * });
 * ```
 */
export function provideEntityData(
  config: EntityDataModuleConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ..._provideEntityData(config),
    ENVIRONMENT_STATE_PROVIDER,
  ]);
}

/**
 *
 * @usageNotes
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideEntityDataWithoutEffects()],
 * });
 * ```
 */
export function provideEntityDataWithoutEffects(
  config: EntityDataModuleConfig
): EnvironmentProviders {
 return makeEnvironmentProviders([
    ..._provideEntityDataWithoutEffects(config),
    ENVIRONMENT_STATE_PROVIDER
  ]);
}

const ENVIRONMENT_STATE_PROVIDER: Provider[] = [
  {
    provide: ENTITY_CACHE_SELECTOR_TOKEN,
    useFactory: createEntityCacheSelector,
  },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    deps: [],
    useFactory() {
      return () => inject(ENTITY_CACHE_SELECTOR_TOKEN);
    },
  },
];
