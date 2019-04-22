// AOT v5 bug:
// NO BARRELS or else `ng build --aot` of any app using ngrx-data produces strange errors
// actions
export * from './actions/entity-action-factory';
export * from './actions/entity-action-guard';
export * from './actions/entity-action-operators';
export * from './actions/entity-action';
export * from './actions/entity-cache-action';
export * from './actions/entity-cache-change-set';
export * from './actions/entity-op';
export * from './actions/merge-strategy';
export * from './actions/update-response-data';

// dataservices
export * from './dataservices/data-service-error';
export * from './dataservices/default-data-service-config';
export * from './dataservices/default-data.service';
export * from './dataservices/entity-cache-data.service';
export * from './dataservices/entity-data.service';
export * from './dataservices/http-url-generator';
export * from './dataservices/interfaces';
export * from './dataservices/persistence-result-handler.service';

// dispatchers
export * from './dispatchers/entity-cache-dispatcher';
export * from './dispatchers/entity-commands';
export * from './dispatchers/entity-dispatcher-base';
export * from './dispatchers/entity-dispatcher-default-options';
export * from './dispatchers/entity-dispatcher-factory';
export * from './dispatchers/entity-dispatcher';

// effects
export * from './effects/entity-cache-effects';
export * from './effects/entity-effects';

// entity-metadata
export * from './entity-metadata/entity-definition.service';
export * from './entity-metadata/entity-definition';
export * from './entity-metadata/entity-filters';
export * from './entity-metadata/entity-metadata';

// entity-services
export * from './entity-services/entity-collection-service-base';
export * from './entity-services/entity-collection-service-elements-factory';
export * from './entity-services/entity-collection-service-factory';
export * from './entity-services/entity-collection-service';
export * from './entity-services/entity-services-base';
export * from './entity-services/entity-services-elements';
export * from './entity-services/entity-services';

// reducers
export * from './reducers/constants';
export * from './reducers/entity-cache-reducer';
export * from './reducers/entity-cache';
export * from './reducers/entity-change-tracker-base';
export * from './reducers/entity-change-tracker';
export * from './reducers/entity-collection-creator';
export * from './reducers/entity-collection-reducer-methods';
export * from './reducers/entity-collection-reducer-registry';
export * from './reducers/entity-collection-reducer';
export * from './reducers/entity-collection';

// selectors
export * from './selectors/entity-cache-selector';
export * from './selectors/entity-selectors';
export * from './selectors/entity-selectors$';

// Utils
export * from './utils/correlation-id-generator';
export * from './utils/default-logger';
export * from './utils/default-pluralizer';
export * from './utils/guid-fns';
export * from './utils/interfaces';
export * from './utils/utilities';

// EntityDataModule
export { EntityDataModule } from './entity-data.module';
export {
  EntityDataModuleWithoutEffects,
  EntityDataModuleConfig,
} from './entity-data-without-effects.module';
