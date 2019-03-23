import { Injectable } from '@angular/core';
import { EntityCollectionService } from './entity-collection-service';
import { EntityCollectionServiceBase } from './entity-collection-service-base';
import { EntityCollectionServiceElementsFactory } from './entity-collection-service-elements-factory';
import { EntitySelectors$ } from '../selectors/entity-selectors$';

/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
@Injectable()
export class EntityCollectionServiceFactory {
  constructor(
    /** Creates the core elements of the EntityCollectionService for an entity type. */
    public entityCollectionServiceElementsFactory: EntityCollectionServiceElementsFactory
  ) {}

  /**
   * Create an EntityCollectionService for an entity type
   * @param entityName - name of the entity type
   */
  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string
  ): EntityCollectionService<T> {
    return new EntityCollectionServiceBase<T, S$>(
      entityName,
      this.entityCollectionServiceElementsFactory
    );
  }
}
