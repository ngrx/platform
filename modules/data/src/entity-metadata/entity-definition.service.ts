import { Inject, Injectable, Optional } from '@angular/core';

import { createEntityDefinition, EntityDefinition } from './entity-definition';
import {
  EntityMetadata,
  EntityMetadataMap,
  ENTITY_METADATA_TOKEN,
} from './entity-metadata';

export interface EntityDefinitions {
  [entityName: string]: EntityDefinition<any>;
}

/** Registry of EntityDefinitions for all cached entity types */
@Injectable()
export class EntityDefinitionService {
  /** {EntityDefinition} for all cached entity types */
  private readonly definitions: EntityDefinitions = {};

  constructor(
    @Optional()
    @Inject(ENTITY_METADATA_TOKEN)
    entityMetadataMaps: EntityMetadataMap[]
  ) {
    if (entityMetadataMaps) {
      entityMetadataMaps.forEach((map) => this.registerMetadataMap(map));
    }
  }

  /**
   * Get (or create) a data service for entity type
   * @param entityName - the name of the type
   *
   * Examples:
   *   getDefinition('Hero'); // definition for Heroes, untyped
   *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
   */
  getDefinition<T>(
    entityName: string,
    shouldThrow = true
  ): EntityDefinition<T> {
    entityName = entityName.trim();
    const definition = this.definitions[entityName];
    if (!definition && shouldThrow) {
      throw new Error(`No EntityDefinition for entity type "${entityName}".`);
    }
    return definition;
  }

  //////// Registration methods //////////

  /**
   * Create and register the {EntityDefinition} for the {EntityMetadata} of an entity type
   * @param name - the name of the entity type
   * @param definition - {EntityMetadata} for a collection for that entity type
   *
   * Examples:
   *   registerMetadata(myHeroEntityDefinition);
   */
  registerMetadata(metadata: EntityMetadata) {
    if (metadata) {
      const definition = createEntityDefinition(metadata);
      this.registerDefinition(definition);
    }
  }

  /**
   * Register an EntityMetadataMap.
   * @param metadataMap - a map of entityType names to entity metadata
   *
   * Examples:
   *   registerMetadataMap({
   *     'Hero': myHeroMetadata,
   *     Villain: myVillainMetadata
   *   });
   */
  registerMetadataMap(metadataMap: EntityMetadataMap = {}) {
    // The entity type name should be the same as the map key
    Object.keys(metadataMap || {}).forEach((entityName) =>
      this.registerMetadata({ entityName, ...metadataMap[entityName] })
    );
  }

  /**
   * Register an {EntityDefinition} for an entity type
   * @param definition - EntityDefinition of a collection for that entity type
   *
   * Examples:
   *   registerDefinition('Hero', myHeroEntityDefinition);
   */
  registerDefinition<T>(definition: EntityDefinition<T>) {
    this.definitions[definition.entityName] = definition;
  }

  /**
   * Register a batch of EntityDefinitions.
   * @param definitions - map of entityType name and associated EntityDefinitions to merge.
   *
   * Examples:
   *   registerDefinitions({
   *     'Hero': myHeroEntityDefinition,
   *     Villain: myVillainEntityDefinition
   *   });
   */
  registerDefinitions(definitions: EntityDefinitions) {
    Object.assign(this.definitions, definitions);
  }
}
