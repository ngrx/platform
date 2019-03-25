import { EntityState, Dictionary } from '@ngrx/entity';

/** Types of change in a ChangeState instance */
export enum ChangeType {
  /** The entity has not changed from its last known server state. */
  Unchanged = 0,
  /** The entity was added to the collection */
  Added,
  /** The entity is scheduled for delete and was removed from the collection */
  Deleted,
  /** The entity in the collection was updated */
  Updated,
}

/**
 * Change state for an entity with unsaved changes;
 * an entry in an EntityCollection.changeState map
 */
export interface ChangeState<T> {
  changeType: ChangeType;
  originalValue?: T | undefined;
}

/**
 * Map of entity primary keys to entity ChangeStates.
 * Each entry represents an entity with unsaved changes.
 */
export type ChangeStateMap<T> = Dictionary<ChangeState<T>>;

/**
 * Data and information about a collection of entities of a single type.
 * EntityCollections are maintained in the EntityCache within the ngrx store.
 */
export interface EntityCollection<T = any> extends EntityState<T> {
  /** Name of the entity type for this collection */
  entityName: string;
  /** A map of ChangeStates, keyed by id, for entities with unsaved changes */
  changeState: ChangeStateMap<T>;
  /** The user's current collection filter pattern */
  filter?: string;
  /** true if collection was ever filled by QueryAll; forced false if cleared */
  loaded: boolean;
  /** true when a query or save operation is in progress */
  loading: boolean;
}
