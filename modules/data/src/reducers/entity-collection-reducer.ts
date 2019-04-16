import { Injectable } from '@angular/core';

import { EntityAction } from '../actions/entity-action';
import { EntityCollection } from './entity-collection';
import { EntityCollectionReducerMethodsFactory } from './entity-collection-reducer-methods';

export type EntityCollectionReducer<T = any> = (
  collection: EntityCollection<T>,
  action: EntityAction
) => EntityCollection<T>;

/** Create a default reducer for a specific entity collection */
@Injectable()
export class EntityCollectionReducerFactory {
  constructor(private methodsFactory: EntityCollectionReducerMethodsFactory) {}

  /** Create a default reducer for a collection of entities of T */
  create<T = any>(entityName: string): EntityCollectionReducer<T> {
    const methods = this.methodsFactory.create<T>(entityName);

    /** Perform Actions against a particular entity collection in the EntityCache */
    return function entityCollectionReducer(
      collection: EntityCollection<T>,
      action: EntityAction
    ): EntityCollection<T> {
      const reducerMethod = methods[action.payload.entityOp];
      return reducerMethod ? reducerMethod(collection, action) : collection;
    };
  }
}
