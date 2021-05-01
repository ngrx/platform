import { EntityAction, EntityActionOptions } from '../actions/entity-action';
import { EntityCommands } from '../dispatchers/entity-commands';
import { EntityDispatcher } from '../dispatchers/entity-dispatcher';
import { EntityOp } from '../actions/entity-op';
import { EntitySelectors$ } from '../selectors/entity-selectors$';
import { EntitySelectors } from '../selectors/entity-selectors';

/* eslint-disable @typescript-eslint/member-ordering */

/**
 * A facade for managing
 * a cached collection of T entities in the ngrx store.
 */
export interface EntityCollectionService<T>
  extends EntityCommands<T>,
    EntitySelectors$<T> {
  /**
   * Create an {EntityAction} for this entity type.
   * @param op {EntityOp} the entity operation
   * @param [data] the action data
   * @param [options] additional options
   * @returns the EntityAction
   */
  createEntityAction(
    op: EntityOp,
    payload?: any,
    options?: EntityActionOptions
  ): EntityAction<T>;

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

  /** Dispatcher of EntityCommands (EntityActions) */
  readonly dispatcher: EntityDispatcher<T>;

  /** Name of the entity type for this collection service */
  readonly entityName: string;

  /** All selector functions of the entity collection */
  readonly selectors: EntitySelectors<T>;

  /** All selectors$ (observables of the selectors of entity collection properties) */
  readonly selectors$: EntitySelectors$<T>;
}
