import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import {
  DataServiceError,
  EntityActionDataServiceError,
} from './data-service-error';
import { EntityAction } from '../actions/entity-action';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { makeErrorOp, makeSuccessOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';

/**
 * Handling of responses from persistence operation
 */
export abstract class PersistenceResultHandler {
  /** Handle successful result of persistence operation for an action */
  abstract handleSuccess(originalAction: EntityAction): (data: any) => Action;

  /** Handle error result of persistence operation for an action */
  abstract handleError(
    originalAction: EntityAction
  ): (
    error: DataServiceError | Error
  ) => EntityAction<EntityActionDataServiceError>;
}

/**
 * Default handling of responses from persistence operation,
 * specifically an EntityDataService
 */
@Injectable()
export class DefaultPersistenceResultHandler
  implements PersistenceResultHandler {
  constructor(
    private logger: Logger,
    private entityActionFactory: EntityActionFactory
  ) {}

  /** Handle successful result of persistence operation on an EntityAction */
  handleSuccess(originalAction: EntityAction): (data: any) => Action {
    const successOp = makeSuccessOp(originalAction.payload.entityOp);
    return (data: any) =>
      this.entityActionFactory.createFromAction(originalAction, {
        entityOp: successOp,
        data,
      });
  }

  /** Handle error result of persistence operation on an EntityAction */
  handleError(
    originalAction: EntityAction
  ): (
    error: DataServiceError | Error
  ) => EntityAction<EntityActionDataServiceError> {
    const errorOp = makeErrorOp(originalAction.payload.entityOp);

    return (err: DataServiceError | Error) => {
      const error =
        err instanceof DataServiceError ? err : new DataServiceError(err, null);
      const errorData: EntityActionDataServiceError = { error, originalAction };
      this.logger.error(errorData);
      const action = this.entityActionFactory.createFromAction<
        EntityActionDataServiceError
      >(originalAction, {
        entityOp: errorOp,
        data: errorData,
      });
      return action;
    };
  }
}
