import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, timeout } from 'rxjs/operators';

import { IdSelector } from '@ngrx/entity';

import {
  ChangeSetOperation,
  ChangeSet,
  ChangeSetItem,
  ChangeSetUpdate,
  excludeEmptyChangeSetItems,
} from '../actions/entity-cache-change-set';
import { DataServiceError } from './data-service-error';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { RequestData } from './interfaces';

const updateOp = ChangeSetOperation.Update;

/**
 * Default data service for making remote service calls targeting the entire EntityCache.
 * See EntityDataService for services that target a single EntityCollection
 */
@Injectable()
export class EntityCacheDataService {
  protected idSelectors: { [entityName: string]: IdSelector<any> } = {};
  protected saveDelay = 0;
  protected timeout = 0;

  constructor(
    protected entityDefinitionService: EntityDefinitionService,
    protected http: HttpClient,
    @Optional() config?: DefaultDataServiceConfig
  ) {
    const { saveDelay = 0, timeout: to = 0 } = config || {};
    this.saveDelay = saveDelay;
    this.timeout = to;
  }

  /**
   * Save changes to multiple entities across one or more entity collections.
   * Server endpoint must understand the essential SaveEntities protocol,
   * in particular the ChangeSet interface (except for Update<T>).
   * This implementation extracts the entity changes from a ChangeSet Update<T>[] and sends those.
   * It then reconstructs Update<T>[] in the returned observable result.
   * @param changeSet  An array of SaveEntityItems.
   * Each SaveEntityItem describe a change operation for one or more entities of a single collection,
   * known by its 'entityName'.
   * @param url The server endpoint that receives this request.
   */
  saveEntities(changeSet: ChangeSet, url: string): Observable<ChangeSet> {
    changeSet = this.filterChangeSet(changeSet);
    // Assume server doesn't understand @ngrx/entity Update<T> structure;
    // Extract the entity changes from the Update<T>[] and restore on the return from server
    changeSet = this.flattenUpdates(changeSet);

    let result$: Observable<ChangeSet> = this.http
      .post<ChangeSet>(url, changeSet)
      .pipe(
        map((result) => this.restoreUpdates(result)),
        catchError(this.handleError({ method: 'POST', url, data: changeSet }))
      );

    if (this.timeout) {
      result$ = result$.pipe(timeout(this.timeout));
    }

    if (this.saveDelay) {
      result$ = result$.pipe(delay(this.saveDelay));
    }

    return result$;
  }

  // #region helpers
  protected handleError(reqData: RequestData) {
    return (err: any) => {
      const error = new DataServiceError(err, reqData);
      return throwError(() => error);
    };
  }

  /**
   * Filter changeSet to remove unwanted ChangeSetItems.
   * This implementation excludes null and empty ChangeSetItems.
   * @param changeSet ChangeSet with changes to filter
   */
  protected filterChangeSet(changeSet: ChangeSet): ChangeSet {
    return excludeEmptyChangeSetItems(changeSet);
  }

  /**
   * Convert the entities in update changes from @ngrx Update<T> structure to just T.
   * Reverse of restoreUpdates().
   */
  protected flattenUpdates(changeSet: ChangeSet): ChangeSet {
    let changes = changeSet.changes;
    if (changes.length === 0) {
      return changeSet;
    }
    let hasMutated = false;
    changes = changes.map((item) => {
      if (item.op === updateOp && item.entities.length > 0) {
        hasMutated = true;
        return {
          ...item,
          entities: (item as ChangeSetUpdate).entities.map((u) => u.changes),
        };
      } else {
        return item;
      }
    }) as ChangeSetItem[];
    return hasMutated ? { ...changeSet, changes } : changeSet;
  }

  /**
   * Convert the flattened T entities in update changes back to @ngrx Update<T> structures.
   * Reverse of flattenUpdates().
   */
  protected restoreUpdates(changeSet: ChangeSet): ChangeSet {
    if (changeSet == null) {
      // Nothing? Server probably responded with 204 - No Content because it made no changes to the inserted or updated entities
      return changeSet;
    }
    let changes = changeSet.changes;
    if (changes.length === 0) {
      return changeSet;
    }
    let hasMutated = false;
    changes = changes.map((item) => {
      if (item.op === updateOp) {
        // These are entities, not Updates; convert back to Updates
        hasMutated = true;
        const selectId = this.getIdSelector(item.entityName);
        return {
          ...item,
          entities: item.entities.map((u: any) => ({
            id: selectId(u),
            changes: u,
          })),
        } as ChangeSetUpdate;
      } else {
        return item;
      }
    }) as ChangeSetItem[];
    return hasMutated ? { ...changeSet, changes } : changeSet;
  }

  /**
   * Get the id (primary key) selector function for an entity type
   * @param entityName name of the entity type
   */
  protected getIdSelector(entityName: string) {
    let idSelector = this.idSelectors[entityName];
    if (!idSelector) {
      idSelector =
        this.entityDefinitionService.getDefinition(entityName).selectId;
      this.idSelectors[entityName] = idSelector;
    }
    return idSelector;
  }
  // #endregion helpers
}
