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

export const BASE_ENTITY_DATA_PROVIDERS: Provider[] = [
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
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => initializeBaseEntityData(),
  },
];

function initializeBaseEntityData(): void {
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
    reducerFactory: combineReducers as ActionReducerFactory<EntityCache>,
    initialState: initialState || {},
    metaReducers: metaReducers,
  };
  reducerManager.addFeature(entityCacheFeature);
}

export const ENTITY_DATA_EFFECTS_PROVIDERS: Provider[] = [
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
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue: () => initializeEntityDataEffects(),
  },
];

function initializeEntityDataEffects(): void {
  const effectsSources = inject(EffectSources);
  const entityCacheEffects = inject(EntityCacheEffects);
  const entityEffects = inject(EntityEffects);

  effectsSources.addEffects(entityCacheEffects);
  effectsSources.addEffects(entityEffects);
}

export function provideEntityDataConfig(
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
    {
      provide: ENTITY_METADATA_TOKEN,
      multi: true,
      useValue: config.entityMetadata ? config.entityMetadata : [],
    },
  ];
}

/**
 * Sets up base entity data providers with entity config.
 * This function should to be used at the root level.
 *
 * @usageNotes
 *
 * ### Providing entity data with effects
 *
 * When used with `withEffects` feature, the `provideEntityData` function is
 * an alternative to `EntityDataModule.forRoot`
 *
 * ```ts
 * import { provideStore } from '@ngrx/store';
 * import { provideEffects } from '@ngrx/effects';
 * import {
 *   EntityMetadataMap,
 *   provideEntityData,
 *   withEffects,
 * } from '@ngrx/data';
 *
 * const entityMetadata: EntityMetadataMap = {
 *   Hero: {},
 *   Villain: {},
 * };
 * const pluralNames = { Hero: 'Heroes' };
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(),
 *     provideEffects(),
 *     provideEntityData({ entityMetadata, pluralNames }, withEffects()),
 *   ],
 * });
 * ```
 *
 * ### Providing entity data without effects
 *
 * When used without `withEffects` feature, the `provideEntityData` function is
 * an alternative to `EntityDataModuleWithoutEffects.forRoot`.
 *
 * ```ts
 * import { provideStore } from '@ngrx/store';
 * import { EntityMetadataMap, provideEntityData } from '@ngrx/data';
 *
 * const entityMetadata: EntityMetadataMap = {
 *   Musician: {},
 *   Song: {},
 * };
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStore(),
 *     provideEntityData({ entityMetadata }),
 *   ],
 * });
 * ```
 *
 */
export function provideEntityData(
  config: EntityDataModuleConfig,
  ...features: EntityDataFeature[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    BASE_ENTITY_DATA_PROVIDERS,
    provideEntityDataConfig(config),
    ...features.map((feature) => feature.ɵproviders),
  ]);
}

enum EntityDataFeatureKind {
  WithEffects,
}

interface EntityDataFeature {
  ɵkind: EntityDataFeatureKind;
  ɵproviders: Provider[];
}

/**
 * Registers entity data effects and provides HTTP data services.
 *
 * @see `provideEntityData`
 */
export function withEffects(): EntityDataFeature {
  return {
    ɵkind: EntityDataFeatureKind.WithEffects,
    ɵproviders: [ENTITY_DATA_EFFECTS_PROVIDERS],
  };
}
