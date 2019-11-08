import { Injectable } from '@angular/core';
import { EntityDispatcher } from '../dispatchers/entity-dispatcher';
import { EntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import {
  EntitySelectors,
  EntitySelectorsFactory,
} from '../selectors/entity-selectors';
import {
  EntitySelectors$,
  EntitySelectors$Factory,
} from '../selectors/entity-selectors$';

/** Core ingredients of an EntityCollectionService */
export interface EntityCollectionServiceElements<
  T,
  S$ extends EntitySelectors$<T> = EntitySelectors$<T>
> {
  readonly dispatcher: EntityDispatcher<T>;
  readonly entityName: string;
  readonly selectors: EntitySelectors<T>;
  readonly selectors$: S$;
}

/** Creates the core elements of the EntityCollectionService for an entity type. */
@Injectable()
export class EntityCollectionServiceElementsFactory {
  constructor(
    private entityDispatcherFactory: EntityDispatcherFactory,
    private entityDefinitionService: EntityDefinitionService,
    private entitySelectorsFactory: EntitySelectorsFactory,
    private entitySelectors$Factory: EntitySelectors$Factory
  ) {}

  /**
   * Get the ingredients for making an EntityCollectionService for this entity type
   * @param entityName - name of the entity type
   */
  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string
  ): EntityCollectionServiceElements<T, S$> {
    entityName = entityName.trim();
    const definition = this.entityDefinitionService.getDefinition<T>(
      entityName
    );
    const dispatcher = this.entityDispatcherFactory.create<T>(
      entityName,
      definition.selectId,
      definition.entityDispatcherOptions
    );
    const selectors = this.entitySelectorsFactory.create<T>(
      definition.metadata
    );
    const selectors$ = this.entitySelectors$Factory.create<T, S$>(
      entityName,
      selectors
    );
    return {
      dispatcher,
      entityName,
      selectors,
      selectors$,
    };
  }
}
