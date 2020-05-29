// actions
export { EntityActionFactory } from './actions/entity-action-factory';
export { EntityActionGuard } from './actions/entity-action-guard';
export { ofEntityOp, ofEntityType } from './actions/entity-action-operators';
export {
  EntityAction,
  EntityActionOptions,
  EntityActionPayload,
} from './actions/entity-action';
export {
  EntityCacheAction,
  EntityCacheQuerySet,
  ClearCollections,
  LoadCollections,
  MergeQuerySet,
  SetEntityCache,
  SaveEntities,
  SaveEntitiesCancel,
  SaveEntitiesCanceled,
  SaveEntitiesError,
  SaveEntitiesSuccess,
} from './actions/entity-cache-action';
export {
  ChangeSetOperation,
  ChangeSetAdd,
  ChangeSetDelete,
  ChangeSetUpdate,
  ChangeSetUpsert,
  ChangeSetItem,
  ChangeSet,
  ChangeSetItemFactory,
  changeSetItemFactory,
  excludeEmptyChangeSetItems,
} from './actions/entity-cache-change-set';

export {
  EntityOp,
  OP_SUCCESS,
  OP_ERROR,
  makeErrorOp,
  makeSuccessOp,
} from './actions/entity-op';
export { MergeStrategy } from './actions/merge-strategy';
export { UpdateResponseData } from './actions/update-response-data';

// // dataservices
export { DataServiceError } from './dataservices/data-service-error';
export { EntityActionDataServiceError } from './dataservices/data-service-error';
export { DefaultDataServiceConfig } from './dataservices/default-data-service-config';
export { DefaultDataService } from './dataservices/default-data.service';
export { DefaultDataServiceFactory } from './dataservices/default-data.service';
export { EntityCacheDataService } from './dataservices/entity-cache-data.service';
export { EntityDataService } from './dataservices/entity-data.service';
export { EntityHttpResourceUrls } from './dataservices/http-url-generator';
export { HttpResourceUrls } from './dataservices/http-url-generator';
export { HttpUrlGenerator } from './dataservices/http-url-generator';
export { DefaultHttpUrlGenerator } from './dataservices/http-url-generator';
export { normalizeRoot } from './dataservices/http-url-generator';
export {
  EntityCollectionDataService,
  HttpMethods,
  RequestData,
  QueryParams,
} from './dataservices/interfaces';
export {
  PersistenceResultHandler,
  DefaultPersistenceResultHandler,
} from './dataservices/persistence-result-handler.service';

// // dispatchers
export { EntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
export {
  EntityServerCommands,
  EntityCacheCommands,
  EntityCommands,
} from './dispatchers/entity-commands';
export { EntityDispatcherBase } from './dispatchers/entity-dispatcher-base';
export { EntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
export { EntityDispatcherFactory } from './dispatchers/entity-dispatcher-factory';
export {
  EntityDispatcher,
  PersistanceCanceled,
} from './dispatchers/entity-dispatcher';

// // effects
export { EntityCacheEffects } from './effects/entity-cache-effects';
export { persistOps, EntityEffects } from './effects/entity-effects';

// // entity-metadata
export {
  EntityDefinitions,
  EntityDefinitionService,
} from './entity-metadata/entity-definition.service';
export {
  EntityDefinition,
  createEntityDefinition,
} from './entity-metadata/entity-definition';
export {
  EntityFilterFn,
  PropsFilterFnFactory,
} from './entity-metadata/entity-filters';
export {
  ENTITY_METADATA_TOKEN,
  EntityMetadata,
  EntityMetadataMap,
} from './entity-metadata/entity-metadata';

// // entity-services
export { EntityCollectionServiceBase } from './entity-services/entity-collection-service-base';
export {
  EntityCollectionServiceElements,
  EntityCollectionServiceElementsFactory,
} from './entity-services/entity-collection-service-elements-factory';
export { EntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
export { EntityCollectionService } from './entity-services/entity-collection-service';
export { EntityServicesBase } from './entity-services/entity-services-base';
export { EntityServicesElements } from './entity-services/entity-services-elements';
export {
  EntityServices,
  EntityCollectionServiceMap,
} from './entity-services/entity-services';

// // reducers
export {
  ENTITY_CACHE_NAME,
  ENTITY_CACHE_NAME_TOKEN,
  ENTITY_CACHE_META_REDUCERS,
  ENTITY_COLLECTION_META_REDUCERS,
  INITIAL_ENTITY_CACHE_STATE,
} from './reducers/constants';
export { EntityCacheReducerFactory } from './reducers/entity-cache-reducer';
export { EntityCache } from './reducers/entity-cache';
export { EntityChangeTrackerBase } from './reducers/entity-change-tracker-base';
export { EntityChangeTracker } from './reducers/entity-change-tracker';
export {
  EntityCollectionCreator,
  createEmptyEntityCollection,
} from './reducers/entity-collection-creator';
export {
  EntityCollectionReducerMethodMap,
  EntityCollectionReducerMethods,
  EntityCollectionReducerMethodsFactory,
} from './reducers/entity-collection-reducer-methods';
export {
  EntityCollectionReducers,
  EntityCollectionReducerRegistry,
} from './reducers/entity-collection-reducer-registry';
export {
  EntityCollectionReducer,
  EntityCollectionReducerFactory,
} from './reducers/entity-collection-reducer';
export {
  ChangeType,
  ChangeState,
  ChangeStateMap,
  EntityCollection,
} from './reducers/entity-collection';

// // selectors
export {
  ENTITY_CACHE_SELECTOR_TOKEN,
  entityCacheSelectorProvider,
  EntityCacheSelector,
  createEntityCacheSelector,
} from './selectors/entity-cache-selector';
export {
  CollectionSelectors,
  EntitySelectors,
  EntitySelectorsFactory,
} from './selectors/entity-selectors';
export {
  EntitySelectors$,
  EntitySelectors$Factory,
} from './selectors/entity-selectors$';

// // Utils
export { CorrelationIdGenerator } from './utils/correlation-id-generator';
export { DefaultLogger } from './utils/default-logger';
export { DefaultPluralizer } from './utils/default-pluralizer';
export { getGuid, getGuidComb, guidComparer } from './utils/guid-fns';
export {
  Logger,
  EntityPluralNames,
  PLURAL_NAMES_TOKEN,
  Pluralizer,
} from './utils/interfaces';
export {
  defaultSelectId,
  flattenArgs,
  toUpdateFactory,
} from './utils/utilities';

// // EntityDataModule
export {
  EntityDataModuleConfig,
  EntityDataModuleWithoutEffects,
} from './entity-data-without-effects.module';
export { EntityDataModule } from './entity-data.module';
