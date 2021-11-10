import { Inject, Injectable, Optional } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import {
  asyncScheduler,
  Observable,
  of,
  merge,
  race,
  SchedulerLike,
} from 'rxjs';
import {
  concatMap,
  catchError,
  delay,
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';

import { DataServiceError } from '../dataservices/data-service-error';
import {
  ChangeSet,
  excludeEmptyChangeSetItems,
} from '../actions/entity-cache-change-set';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityOp } from '../actions/entity-op';

import {
  EntityCacheAction,
  SaveEntities,
  SaveEntitiesCancel,
  SaveEntitiesCanceled,
  SaveEntitiesError,
  SaveEntitiesSuccess,
} from '../actions/entity-cache-action';
import { EntityCacheDataService } from '../dataservices/entity-cache-data.service';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { Logger } from '../utils/interfaces';

@Injectable()
export class EntityCacheEffects {
  // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
  /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
  private responseDelay = 10;

  constructor(
    private actions: Actions,
    private dataService: EntityCacheDataService,
    private entityActionFactory: EntityActionFactory,
    private logger: Logger,
    /**
     * Injecting an optional Scheduler that will be undefined
     * in normal application usage, but its injected here so that you can mock out
     * during testing using the RxJS TestScheduler for simulating passages of time.
     */
    @Optional()
    @Inject(ENTITY_EFFECTS_SCHEDULER)
    private scheduler: SchedulerLike
  ) {}

  /**
   * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
   */
  saveEntitiesCancel$: Observable<SaveEntitiesCancel> = createEffect(
    () =>
      this.actions.pipe(
        ofType(EntityCacheAction.SAVE_ENTITIES_CANCEL),
        filter((a: SaveEntitiesCancel) => a.payload.correlationId != null)
      ),
    { dispatch: false }
  );

  // Concurrent persistence requests considered unsafe.
  // `mergeMap` allows for concurrent requests which may return in any order
  saveEntities$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      ofType(EntityCacheAction.SAVE_ENTITIES),
      mergeMap((action: SaveEntities) => this.saveEntities(action))
    )
  );

  /**
   * Perform the requested SaveEntities actions and return a scalar Observable<Action>
   * that the effect should dispatch to the store after the server responds.
   * @param action The SaveEntities action
   */
  saveEntities(action: SaveEntities): Observable<Action> {
    const error = action.payload.error;
    if (error) {
      return this.handleSaveEntitiesError$(action)(error);
    }
    try {
      const changeSet = excludeEmptyChangeSetItems(action.payload.changeSet);
      const { correlationId, mergeStrategy, tag, url } = action.payload;
      const options = { correlationId, mergeStrategy, tag };

      if (changeSet.changes.length === 0) {
        // nothing to save
        return of(new SaveEntitiesSuccess(changeSet, url, options));
      }

      // Cancellation: returns Observable<SaveEntitiesCanceled> for a saveEntities action
      // whose correlationId matches the cancellation correlationId
      const c = this.saveEntitiesCancel$.pipe(
        filter((a) => correlationId === a.payload.correlationId),
        map(
          (a) =>
            new SaveEntitiesCanceled(
              correlationId,
              a.payload.reason,
              a.payload.tag
            )
        )
      );

      // Data: SaveEntities result as a SaveEntitiesSuccess action
      const d = this.dataService.saveEntities(changeSet, url).pipe(
        concatMap((result) =>
          this.handleSaveEntitiesSuccess$(
            action,
            this.entityActionFactory
          )(result)
        ),
        catchError(this.handleSaveEntitiesError$(action))
      );

      // Emit which ever gets there first; the other observable is terminated.
      return race(c, d);
    } catch (err: any) {
      return this.handleSaveEntitiesError$(action)(err);
    }
  }

  /** return handler of error result of saveEntities, returning a scalar observable of error action */
  private handleSaveEntitiesError$(
    action: SaveEntities
  ): (err: DataServiceError | Error) => Observable<Action> {
    // Although error may return immediately,
    // ensure observable takes some time,
    // as app likely assumes asynchronous response.
    return (err: DataServiceError | Error) => {
      const error =
        err instanceof DataServiceError ? err : new DataServiceError(err, null);
      return of(new SaveEntitiesError(error, action)).pipe(
        delay(this.responseDelay, this.scheduler || asyncScheduler)
      );
    };
  }

  /** return handler of the ChangeSet result of successful saveEntities() */
  private handleSaveEntitiesSuccess$(
    action: SaveEntities,
    entityActionFactory: EntityActionFactory
  ): (changeSet: ChangeSet) => Observable<Action> {
    const { url, correlationId, mergeStrategy, tag } = action.payload;
    const options = { correlationId, mergeStrategy, tag };

    return (changeSet) => {
      // DataService returned a ChangeSet with possible updates to the saved entities
      if (changeSet) {
        return of(new SaveEntitiesSuccess(changeSet, url, options));
      }

      // No ChangeSet = Server probably responded '204 - No Content' because
      // it made no changes to the inserted/updated entities.
      // Respond with success action best on the ChangeSet in the request.
      changeSet = action.payload.changeSet;

      // If pessimistic save, return success action with the original ChangeSet
      if (!action.payload.isOptimistic) {
        return of(new SaveEntitiesSuccess(changeSet, url, options));
      }

      // If optimistic save, avoid cache grinding by just turning off the loading flags
      // for all collections in the original ChangeSet
      const entityNames = changeSet.changes.reduce(
        (acc, item) =>
          acc.indexOf(item.entityName) === -1
            ? acc.concat(item.entityName)
            : acc,
        [] as string[]
      );
      return merge(
        entityNames.map((name) =>
          entityActionFactory.create(name, EntityOp.SET_LOADING, false)
        )
      );
    };
  }
}
