import { IdSelector, Update } from '@ngrx/entity';

import { EntityAction } from './entity-action';
import { UpdateResponseData } from '../actions/update-response-data';

/**
 * Guard methods that ensure EntityAction payload is as expected.
 * Each method returns that payload if it passes the guard or
 * throws an error.
 */
export class EntityActionGuard<T> {
  constructor(private entityName: string, private selectId: IdSelector<T>) {}

  /** Throw if the action payload is not an entity with a valid key */
  mustBeEntity(action: EntityAction<T>): T {
    const data = this.extractData(action);
    if (!data) {
      return this.throwError(action, `should have a single entity.`);
    }
    const id = this.selectId(data);
    if (this.isNotKeyType(id)) {
      this.throwError(action, `has a missing or invalid entity key (id)`);
    }
    return data as T;
  }

  /** Throw if the action payload is not an array of entities with valid keys */
  mustBeEntities(action: EntityAction<T[]>): T[] {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entities`);
    }
    data.forEach((entity, i) => {
      const id = this.selectId(entity);
      if (this.isNotKeyType(id)) {
        const msg = `, item ${i + 1}, does not have a valid entity key (id)`;
        this.throwError(action, msg);
      }
    });
    return data;
  }

  /** Throw if the action payload is not a single, valid key */
  mustBeKey(action: EntityAction<string | number>): string | number | never {
    const data = this.extractData(action);
    if (!data) {
      throw new Error(`should be a single entity key`);
    }
    if (this.isNotKeyType(data)) {
      throw new Error(`is not a valid key (id)`);
    }
    return data;
  }

  /** Throw if the action payload is not an array of valid keys */
  mustBeKeys(action: EntityAction<(string | number)[]>): (string | number)[] {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entity keys (id)`);
    }
    data.forEach((id, i) => {
      if (this.isNotKeyType(id)) {
        const msg = `${this.entityName} ', item ${
          i + 1
        }, is not a valid entity key (id)`;
        this.throwError(action, msg);
      }
    });
    return data;
  }

  /** Throw if the action payload is not an update with a valid key (id) */
  mustBeUpdate(action: EntityAction<Update<T>>): Update<T> {
    const data = this.extractData(action);
    if (!data) {
      return this.throwError(action, `should be a single entity update`);
    }
    const { id, changes } = data;
    const id2 = this.selectId(changes as T);
    if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
      this.throwError(action, `has a missing or invalid entity key (id)`);
    }
    return data;
  }

  /** Throw if the action payload is not an array of updates with valid keys (ids) */
  mustBeUpdates(action: EntityAction<Update<T>[]>): Update<T>[] {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entity updates`);
    }
    data.forEach((item, i) => {
      const { id, changes } = item;
      const id2 = this.selectId(changes as T);
      if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
        this.throwError(
          action,
          `, item ${i + 1}, has a missing or invalid entity key (id)`
        );
      }
    });
    return data;
  }

  /** Throw if the action payload is not an update response with a valid key (id) */
  mustBeUpdateResponse(
    action: EntityAction<UpdateResponseData<T>>
  ): UpdateResponseData<T> {
    const data = this.extractData(action);
    if (!data) {
      return this.throwError(action, `should be a single entity update`);
    }
    const { id, changes } = data;
    const id2 = this.selectId(changes as T);
    if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
      this.throwError(action, `has a missing or invalid entity key (id)`);
    }
    return data;
  }

  /** Throw if the action payload is not an array of update responses with valid keys (ids) */
  mustBeUpdateResponses(
    action: EntityAction<UpdateResponseData<T>[]>
  ): UpdateResponseData<T>[] {
    const data = this.extractData(action);
    if (!Array.isArray(data)) {
      return this.throwError(action, `should be an array of entity updates`);
    }
    data.forEach((item, i) => {
      const { id, changes } = item;
      const id2 = this.selectId(changes as T);
      if (this.isNotKeyType(id) || this.isNotKeyType(id2)) {
        this.throwError(
          action,
          `, item ${i + 1}, has a missing or invalid entity key (id)`
        );
      }
    });
    return data;
  }

  private extractData<T>(action: EntityAction<T>) {
    return action.payload && action.payload.data;
  }

  /** Return true if this key (id) is invalid */
  private isNotKeyType(id: any) {
    return typeof id !== 'string' && typeof id !== 'number';
  }

  private throwError(action: EntityAction, msg: string): never {
    throw new Error(
      `${this.entityName} EntityAction guard for "${action.type}": payload ${msg}`
    );
  }
}
