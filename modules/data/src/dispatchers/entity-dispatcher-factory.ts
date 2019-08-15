import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Action, Store, ScannedActionsSubject } from '@ngrx/store';
import { IdSelector } from '@ngrx/entity';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { EntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';
import { defaultSelectId } from '../utils/utilities';
import { EntityActionFactory } from '../actions/entity-action-factory';
import { EntityCache } from '../reducers/entity-cache';
import {
  EntityCacheSelector,
  ENTITY_CACHE_SELECTOR_TOKEN,
} from '../selectors/entity-cache-selector';
import { EntityDispatcher } from './entity-dispatcher';
import { EntityDispatcherBase } from './entity-dispatcher-base';

/** Creates EntityDispatchers for entity collections */
@Injectable()
export class EntityDispatcherFactory implements OnDestroy {
  /**
   * Actions scanned by the store after it processed them with reducers.
   * A replay observable of the most recent action reduced by the store.
   */
  reducedActions$: Observable<Action>;
  private raSubscription: Subscription;

  constructor(
    private entityActionFactory: EntityActionFactory,
    private store: Store<EntityCache>,
    private entityDispatcherDefaultOptions: EntityDispatcherDefaultOptions,
    @Inject(ScannedActionsSubject) scannedActions$: Observable<Action>,
    @Inject(ENTITY_CACHE_SELECTOR_TOKEN)
    private entityCacheSelector: EntityCacheSelector,
    private correlationIdGenerator: CorrelationIdGenerator
  ) {
    // Replay because sometimes in tests will fake data service with synchronous observable
    // which makes subscriber miss the dispatched actions.
    // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
    this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
    // Start listening so late subscriber won't miss the most recent action.
    this.raSubscription = this.reducedActions$.subscribe();
  }

  /**
   * Create an `EntityDispatcher` for an entity type `T` and store.
   */
  create<T>(
    /** Name of the entity type */
    entityName: string,
    /**
     * Function that returns the primary key for an entity `T`.
     * Usually acquired from `EntityDefinition` metadata.
     */
    selectId: IdSelector<T> = defaultSelectId,
    /** Defaults for options that influence dispatcher behavior such as whether
     * `add()` is optimistic or pessimistic;
     */
    defaultOptions: Partial<EntityDispatcherDefaultOptions> = {}
  ): EntityDispatcher<T> {
    // merge w/ defaultOptions with injected defaults
    const options: EntityDispatcherDefaultOptions = {
      ...this.entityDispatcherDefaultOptions,
      ...defaultOptions,
    };
    return new EntityDispatcherBase<T>(
      entityName,
      this.entityActionFactory,
      this.store,
      selectId,
      options,
      this.reducedActions$,
      this.entityCacheSelector,
      this.correlationIdGenerator
    );
  }

  ngOnDestroy() {
    this.raSubscription.unsubscribe();
  }
}
