import { Update } from '@ngrx/entity';

export enum ChangeSetOperation {
  Add = 'Add',
  Delete = 'Delete',
  Update = 'Update',
  Upsert = 'Upsert',
}
export interface ChangeSetAdd<T = any> {
  op: ChangeSetOperation.Add;
  entityName: string;
  entities: T[];
}

export interface ChangeSetDelete {
  op: ChangeSetOperation.Delete;
  entityName: string;
  entities: string[] | number[];
}

export interface ChangeSetUpdate<T = any> {
  op: ChangeSetOperation.Update;
  entityName: string;
  entities: Update<T>[];
}

export interface ChangeSetUpsert<T = any> {
  op: ChangeSetOperation.Upsert;
  entityName: string;
  entities: T[];
}

/**
 * A entities of a single entity type, which are changed in the same way by a ChangeSetOperation
 */
export type ChangeSetItem =
  | ChangeSetAdd
  | ChangeSetDelete
  | ChangeSetUpdate
  | ChangeSetUpsert;

/*
 * A set of entity Changes, typically to be saved.
 */
export interface ChangeSet<T = any> {
  /** An array of ChangeSetItems to be processed in the array order */
  changes: ChangeSetItem[];

  /**
   * An arbitrary, serializable object that should travel with the ChangeSet.
   * Meaningful to the ChangeSet producer and consumer. Ignored by @ngrx/data.
   */
  extras?: T;

  /** An arbitrary string, identifying the ChangeSet and perhaps its purpose */
  tag?: string;
}

/**
 * Factory to create a ChangeSetItem for a ChangeSetOperation
 */
export class ChangeSetItemFactory {
  /** Create the ChangeSetAdd for new entities of the given entity type */
  add<T>(entityName: string, entities: T | T[]): ChangeSetAdd<T> {
    entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
    return { entityName, op: ChangeSetOperation.Add, entities };
  }

  /** Create the ChangeSetDelete for primary keys of the given entity type */
  delete(
    entityName: string,
    keys: number | number[] | string | string[]
  ): ChangeSetDelete {
    const ids = Array.isArray(keys)
      ? keys
      : keys
      ? ([keys] as string[] | number[])
      : [];
    return { entityName, op: ChangeSetOperation.Delete, entities: ids };
  }

  /** Create the ChangeSetUpdate for Updates of entities of the given entity type */
  update<T extends { id: string | number }>(
    entityName: string,
    updates: Update<T> | Update<T>[]
  ): ChangeSetUpdate<T> {
    updates = Array.isArray(updates) ? updates : updates ? [updates] : [];
    return { entityName, op: ChangeSetOperation.Update, entities: updates };
  }

  /** Create the ChangeSetUpsert for new or existing entities of the given entity type */
  upsert<T>(entityName: string, entities: T | T[]): ChangeSetUpsert<T> {
    entities = Array.isArray(entities) ? entities : entities ? [entities] : [];
    return { entityName, op: ChangeSetOperation.Upsert, entities };
  }
}

/**
 * Instance of a factory to create a ChangeSetItem for a ChangeSetOperation
 */
export const changeSetItemFactory = new ChangeSetItemFactory();

/**
 * Return ChangeSet after filtering out null and empty ChangeSetItems.
 * @param changeSet ChangeSet with changes to filter
 */
export function excludeEmptyChangeSetItems(changeSet: ChangeSet): ChangeSet {
  changeSet = changeSet && changeSet.changes ? changeSet : { changes: [] };
  const changes = changeSet.changes.filter(
    (c) => c != null && c.entities && c.entities.length > 0
  );
  return { ...changeSet, changes };
}
