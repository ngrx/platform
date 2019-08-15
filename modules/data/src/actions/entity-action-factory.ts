import { Injectable } from '@angular/core';

import { EntityOp } from './entity-op';
import {
  EntityAction,
  EntityActionOptions,
  EntityActionPayload,
} from './entity-action';
@Injectable()
export class EntityActionFactory {
  /**
   * Create an EntityAction to perform an operation (op) for a particular entity type
   * (entityName) with optional data and other optional flags
   * @param entityName Name of the entity type
   * @param entityOp Operation to perform (EntityOp)
   * @param [data] data for the operation
   * @param [options] additional options
   */
  create<P = any>(
    entityName: string,
    entityOp: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;

  /**
   * Create an EntityAction to perform an operation (op) for a particular entity type
   * (entityName) with optional data and other optional flags
   * @param payload Defines the EntityAction and its options
   */
  create<P = any>(payload: EntityActionPayload<P>): EntityAction<P>;

  // polymorphic create for the two signatures
  create<P = any>(
    nameOrPayload: EntityActionPayload<P> | string,
    entityOp?: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P> {
    const payload: EntityActionPayload<P> =
      typeof nameOrPayload === 'string'
        ? ({
            ...(options || {}),
            entityName: nameOrPayload,
            entityOp,
            data,
          } as EntityActionPayload<P>)
        : nameOrPayload;
    return this.createCore(payload);
  }

  /**
   * Create an EntityAction to perform an operation (op) for a particular entity type
   * (entityName) with optional data and other optional flags
   * @param payload Defines the EntityAction and its options
   */
  protected createCore<P = any>(payload: EntityActionPayload<P>) {
    const { entityName, entityOp, tag } = payload;
    if (!entityName) {
      throw new Error('Missing entity name for new action');
    }
    if (entityOp == null) {
      throw new Error('Missing EntityOp for new action');
    }
    const type = this.formatActionType(entityOp, tag || entityName);
    return { type, payload };
  }

  /**
   * Create an EntityAction from another EntityAction, replacing properties with those from newPayload;
   * @param from Source action that is the base for the new action
   * @param newProperties New EntityAction properties that replace the source action properties
   */
  createFromAction<P = any>(
    from: EntityAction,
    newProperties: Partial<EntityActionPayload<P>>
  ): EntityAction<P> {
    return this.create({ ...from.payload, ...newProperties });
  }

  formatActionType(op: string, tag: string) {
    return `[${tag}] ${op}`;
    // return `${op} [${tag}]`.toUpperCase(); // example of an alternative
  }
}
