import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EntityAction } from '../actions/entity-action';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCollectionService } from './entity-collection-service';

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * Class-Interface for EntityCache and EntityCollection services.
 * Serves as an Angular provider token for this service class.
 * Includes a registry of EntityCollectionServices for all entity types.
 * Creates a new default EntityCollectionService for any entity type not in the registry.
 * Optionally register specialized EntityCollectionServices for individual types
 */
export abstract class EntityServices {
  /** Dispatch any action to the store */
  abstract dispatch(action: Action): void;

  /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
  abstract readonly entityActionErrors$: Observable<EntityAction>;

  /** Observable of the entire entity cache */
  abstract readonly entityCache$: Observable<EntityCache> | Store<EntityCache>;

  /** Get (or create) the singleton instance of an EntityCollectionService
   * @param entityName {string} Name of the entity type of the service
   */
  abstract getEntityCollectionService<T = any>(
    entityName: string
  ): EntityCollectionService<T>;

  /**
   * Actions scanned by the store after it processed them with reducers.
   * A replay observable of the most recent Action (not just EntityAction) reduced by the store.
   */
  abstract readonly reducedActions$: Observable<Action>;

  // #region EntityCollectionService creation and registration API

  /** Register an EntityCollectionService under its entity type name.
   * Will replace a pre-existing service for that type.
   * @param service {EntityCollectionService} The entity service
   */
  abstract registerEntityCollectionService<T>(
    service: EntityCollectionService<T>
  ): void;

  /** Register entity services for several entity types at once.
   * Will replace a pre-existing service for that type.
   * @param entityCollectionServices Array of EntityCollectionServices to register
   */
  abstract registerEntityCollectionServices(
    entityCollectionServices: EntityCollectionService<any>[]
  ): void;

  /** Register entity services for several entity types at once.
   * Will replace a pre-existing service for that type.
   * @param entityCollectionServiceMap Map of service-name to entity-collection-service
   */
  abstract registerEntityCollectionServices(
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    entityCollectionServiceMap: EntityCollectionServiceMap
  ): void;
  // #endregion EntityCollectionService creation and registration API
}

/**
 * A map of service or entity names to their corresponding EntityCollectionServices.
 */
export interface EntityCollectionServiceMap {
  [entityName: string]: EntityCollectionService<any>;
}
