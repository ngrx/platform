import { IdSelector, Update } from '@ngrx/entity';

/**
 * Default function that returns the entity's primary key (pkey).
 * Assumes that the entity has an `id` pkey property.
 * Returns `undefined` if no entity or `id`.
 * Every selectId fn must return `undefined` when it cannot produce a full pkey.
 */
export function defaultSelectId(entity: any) {
  return entity == null ? undefined : entity.id;
}

/**
 * Flatten first arg if it is an array
 * Allows fn with ...rest signature to be called with an array instead of spread
 * Example:
 * ```
 * // See entity-action-operators.ts
 * const persistOps = [EntityOp.QUERY_ALL, EntityOp.ADD, ...];
 * actions.pipe(ofEntityOp(...persistOps)) // works
 * actions.pipe(ofEntityOp(persistOps)) // also works
 * ```
 * */
export function flattenArgs<T>(args?: any[]): T[] {
  if (args == null) {
    return [];
  }
  if (Array.isArray(args[0])) {
    const [head, ...tail] = args;
    args = [...head, ...tail];
  }
  return args;
}

/**
 * Return a function that converts an entity (or partial entity) into the `Update<T>`
 * whose `id` is the primary key and
 * `changes` is the entity (or partial entity of changes).
 */
export function toUpdateFactory<T>(selectId?: IdSelector<T>) {
  selectId = selectId || (defaultSelectId as IdSelector<T>);
  /**
   * Convert an entity (or partial entity) into the `Update<T>`
   * whose `id` is the primary key and
   * `changes` is the entity (or partial entity of changes).
   * @param selectId function that returns the entity's primary key (id)
   */
  return function toUpdate(entity: Partial<T>): Update<T> {
    const id: any = selectId!(entity as T);
    if (id == null) {
      throw new Error('Primary key may not be null/undefined.');
    }
    return entity && { id, changes: entity };
  };
}
