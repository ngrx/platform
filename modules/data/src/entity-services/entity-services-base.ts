import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { EntityAction } from '../actions/entity-action';
import { EntityCache } from '../reducers/entity-cache';
import { EntityCollectionService } from './entity-collection-service';
import { EntityCollectionServiceFactory } from './entity-collection-service-factory';
import { EntityCollectionServiceMap, EntityServices } from './entity-services';
import { EntitySelectors$ } from '../selectors/entity-selectors$';
import { EntityServicesElements } from './entity-services-elements';

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * @usageNotes
 * ```ts
 * export class EntityServices extends EntityServicesBase {
 *   constructor(entityServicesElements: EntityServicesElements) {
 *     super(entityServicesElements);
 *   }
 *   // Extend with well-known, app entity collection services
 *   // Convenience property to return a typed custom entity collection service
 *   get companyService() {
 *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
 *   }
 *   // Convenience dispatch methods
 *   clearCompany(companyId: string) {
 *     this.dispatch(new ClearCompanyAction(companyId));
 *   }
 * }
 * ```
 */
@Injectable()
export class EntityServicesBase implements EntityServices {
  // Dear @ngrx/data developer: think hard before changing the constructor.
  // Doing so will break apps that derive from this base class,
  // and many apps will derive from this class.
  //
  // Do not give this constructor an implementation.
  // Doing so makes it hard to mock classes that derive from this class.
  // Use getter properties instead. For example, see entityCache$
  constructor(private entityServicesElements: EntityServicesElements) {}

  // #region EntityServicesElement-based properties

  /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
  get entityActionErrors$(): Observable<EntityAction> {
    return this.entityServicesElements.entityActionErrors$;
  }

  /** Observable of the entire entity cache */
  get entityCache$(): Observable<EntityCache> | Store<EntityCache> {
    return this.entityServicesElements.entityCache$;
  }

  /** Factory to create a default instance of an EntityCollectionService */
  get entityCollectionServiceFactory(): EntityCollectionServiceFactory {
    return this.entityServicesElements.entityCollectionServiceFactory;
  }

  /**
   * Actions scanned by the store after it processed them with reducers.
   * A replay observable of the most recent action reduced by the store.
   */
  get reducedActions$(): Observable<Action> {
    return this.entityServicesElements.reducedActions$;
  }

  /** The ngrx store, scoped to the EntityCache */
  protected get store(): Store<EntityCache> {
    return this.entityServicesElements.store;
  }

  // #endregion EntityServicesElement-based properties

  /** Dispatch any action to the store */
  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  /** Registry of EntityCollectionService instances */
  private readonly EntityCollectionServices: EntityCollectionServiceMap = {};

  /**
   * Create a new default instance of an EntityCollectionService.
   * Prefer getEntityCollectionService() unless you really want a new default instance.
   * This one will NOT be registered with EntityServices!
   * @param entityName {string} Name of the entity type of the service
   */
  protected createEntityCollectionService<
    T,
    S$ extends EntitySelectors$<T> = EntitySelectors$<T>
  >(entityName: string): EntityCollectionService<T> {
    return this.entityCollectionServiceFactory.create<T, S$>(entityName);
  }

  /** Get (or create) the singleton instance of an EntityCollectionService
   * @param entityName {string} Name of the entity type of the service
   */
  getEntityCollectionService<
    T,
    S$ extends EntitySelectors$<T> = EntitySelectors$<T>
  >(entityName: string): EntityCollectionService<T> {
    let service = this.EntityCollectionServices[entityName];
    if (!service) {
      service = this.createEntityCollectionService<T, S$>(entityName);
      this.EntityCollectionServices[entityName] = service;
    }
    return service;
  }

  /** Register an EntityCollectionService under its entity type name.
   * Will replace a pre-existing service for that type.
   * @param service {EntityCollectionService} The entity service
   * @param serviceName {string} optional service name to use instead of the service's entityName
   */
  registerEntityCollectionService<T>(
    service: EntityCollectionService<T>,
    serviceName?: string
  ) {
    this.EntityCollectionServices[serviceName || service.entityName] = service;
  }

  /**
   * Register entity services for several entity types at once.
   * Will replace a pre-existing service for that type.
   * @param entityCollectionServices {EntityCollectionServiceMap | EntityCollectionService<any>[]}
   * EntityCollectionServices to register, either as a map or an array
   */
  registerEntityCollectionServices(
    entityCollectionServices:
      | EntityCollectionServiceMap
      | EntityCollectionService<any>[]
  ): void {
    if (Array.isArray(entityCollectionServices)) {
      entityCollectionServices.forEach((service) =>
        this.registerEntityCollectionService(service)
      );
    } else {
      Object.keys(entityCollectionServices || {}).forEach((serviceName) => {
        this.registerEntityCollectionService(
          entityCollectionServices[serviceName],
          serviceName
        );
      });
    }
  }
}
