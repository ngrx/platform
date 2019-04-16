import { Action, Store } from '@ngrx/store';
import { IdSelector, Update } from '@ngrx/entity';

import { EntityAction, EntityActionOptions } from '../actions/entity-action';
import { EntityActionGuard } from '../actions/entity-action-guard';
import { EntityCommands } from './entity-commands';
import { EntityCache } from '../reducers/entity-cache';
import { EntityOp } from '../actions/entity-op';

/**
 * Dispatches EntityCollection actions to their reducers and effects.
 * The substance of the interface is in EntityCommands.
 */
export interface EntityDispatcher<T> extends EntityCommands<T> {
  /** Name of the entity type */
  readonly entityName: string;

  /**
   * Utility class with methods to validate EntityAction payloads.
   */
  readonly guard: EntityActionGuard<T>;

  /** Returns the primary key (id) of this entity */
  readonly selectId: IdSelector<T>;

  /** Returns the store, scoped to the EntityCache */
  readonly store: Store<EntityCache>;

  /**
   * Create an {EntityAction} for this entity type.
   * @param op {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the EntityAction
   */
  createEntityAction<P = any>(
    op: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;

  /**
   * Create an {EntityAction} for this entity type and
   * dispatch it immediately to the store.
   * @param op {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the dispatched EntityAction
   */
  createAndDispatch<P = any>(
    op: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;

  /**
   * Dispatch an Action to the store.
   * @param action the Action
   * @returns the dispatched Action
   */
  dispatch(action: Action): Action;

  /**
   * Convert an entity (or partial entity) into the `Update<T>` object
   * `update...` and `upsert...` methods take `Update<T>` args
   */
  toUpdate(entity: Partial<T>): Update<T>;
}

/**
 * Persistence operation canceled
 */
export class PersistanceCanceled {
  constructor(public readonly message?: string) {
    this.message = message || 'Canceled by user';
  }
}
