import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Action, StoreModule, Store } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';

import { Observable, of, throwError, timer } from 'rxjs';
import { delay, filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { commandDispatchTest } from '../dispatchers/entity-dispatcher.spec';
import {
  EntityCollectionService,
  EntityActionOptions,
  PersistanceCanceled,
  EntityDispatcherDefaultOptions,
  EntityAction,
  EntityActionFactory,
  EntityCache,
  EntityOp,
  EntityMetadataMap,
  EntityDataModule,
  EntityCacheEffects,
  EntityDataService,
  EntityDispatcherFactory,
  EntityServices,
  OP_SUCCESS,
  HttpMethods,
  DataServiceError,
  Logger,
} from '../..';
import { Mock, vi } from 'vitest';

describe('EntityCollectionService', () => {
  describe('Command dispatching', () => {
    // Borrowing the dispatcher tests from entity-dispatcher.spec.
    // The critical difference: those test didn't invoke the reducers; they do when run here.
    commandDispatchTest(getDispatcher);

    function getDispatcher() {
      const { heroCollectionService, store } = entityServicesSetup();
      const dispatcher = heroCollectionService.dispatcher;
      return { dispatcher, store };
    }
  });

  // TODO: test the effect of MergeStrategy when there are entities in cache with changes
  // This concern is largely met by EntityChangeTracker tests but integration tests would be reassuring.
  describe('queries', () => {
    let heroCollectionService: EntityCollectionService<Hero>;
    let dataService: TestDataService;
    let reducedActions$Snoop: () => void;

    beforeEach(() => {
      ({ heroCollectionService, reducedActions$Snoop, dataService } =
        entityServicesSetup());
    });

    // Compare to next test which subscribes to getAll() result
    it('can use loading$ to learn when getAll() succeeds', () =>
      new Promise<void>((done, fail) => {
        const hero1 = { id: 1, name: 'A' } as Hero;
        const hero2 = { id: 2, name: 'B' } as Hero;
        const heroes = [hero1, hero2];
        dataService.setResponse('getAll', heroes);
        heroCollectionService.getAll();

        // N.B.: This technique does not detect errors
        heroCollectionService.loading$
          .pipe(
            filter((loading) => !loading),
            withLatestFrom(heroCollectionService.entities$)
          )
          .subscribe(([loading, data]) => {
            expect(data).toEqual(heroes);
            done();
          });
      }));

    // Compare to previous test the waits for loading$ flag to flip
    it('getAll observable should emit heroes on success', () =>
      new Promise<void>((done, fail) => {
        const hero1 = { id: 1, name: 'A' } as Hero;
        const hero2 = { id: 2, name: 'B' } as Hero;
        const heroes = [hero1, hero2];
        dataService.setResponse('getAll', heroes);
        heroCollectionService
          .getAll()
          .subscribe(expectDataToBe(heroes, { done, fail }));

        // reducedActions$Snoop(); // diagnostic
      }));

    it('getAll observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeDataServiceError('GET', httpError);
        dataService.setErrorResponse('getAll', error);
        heroCollectionService
          .getAll()
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));

    it('getByKey observable should emit a hero on success', () =>
      new Promise<void>((done, fail) => {
        const hero = { id: 1, name: 'A' } as Hero;
        dataService.setResponse('getById', hero);
        heroCollectionService
          .getByKey(1)
          .subscribe(expectDataToBe(hero, { done, fail }));
      }));

    it('getByKey observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        // Simulate HTTP 'Not Found' response
        const httpError = new HttpErrorResponse({
          error: 'Entity not found',
          status: 404,
          statusText: 'Not Found',
          url: 'bad/location',
        });

        // For test purposes, the following would have been effectively the same thing
        // const httpError = { error: new Error('Entity not found'), status: 404 };

        const error = makeDataServiceError('GET', httpError);
        dataService.setErrorResponse('getById', error);
        heroCollectionService
          .getByKey(42)
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));

    it('getWithQuery observable should emit heroes on success', () =>
      new Promise<void>((done, fail) => {
        const hero1 = { id: 1, name: 'A' } as Hero;
        const hero2 = { id: 2, name: 'B' } as Hero;
        const heroes = [hero1, hero2];
        dataService.setResponse('getWithQuery', heroes);
        heroCollectionService
          .getWithQuery({ name: 'foo' })
          .subscribe(expectDataToBe(heroes, { done, fail }));

        // reducedActions$Snoop(); // diagnostic
      }));

    it('getWithQuery observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeDataServiceError('GET', httpError);
        dataService.setErrorResponse('getWithQuery', error);
        heroCollectionService
          .getWithQuery({ name: 'foo' })
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));

    it('load observable should emit heroes on success', () =>
      new Promise<void>((done, fail) => {
        const hero1 = { id: 1, name: 'A' } as Hero;
        const hero2 = { id: 2, name: 'B' } as Hero;
        const heroes = [hero1, hero2];
        dataService.setResponse('getAll', heroes);
        heroCollectionService
          .load()
          .subscribe(expectDataToBe(heroes, { done, fail }));
      }));

    it('load observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeDataServiceError('GET', httpError);
        dataService.setErrorResponse('getAll', error);
        heroCollectionService
          .load()
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));

    it('loadWithQuery observable should emit heroes on success', () =>
      new Promise<void>((done, fail) => {
        const hero1 = { id: 1, name: 'A' } as Hero;
        const hero2 = { id: 2, name: 'B' } as Hero;
        const heroes = [hero1, hero2];
        dataService.setResponse('getWithQuery', heroes);
        heroCollectionService
          .loadWithQuery({ name: 'foo' })
          .subscribe(expectDataToBe(heroes, { done, fail }));
      }));

    it('loadWithQuery observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeDataServiceError('GET', httpError);
        dataService.setErrorResponse('getWithQuery', error);
        heroCollectionService
          .loadWithQuery({ name: 'foo' })
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));
  });

  describe('cancel', () => {
    const hero1 = { id: 1, name: 'A' } as Hero;
    const hero2 = { id: 2, name: 'B' } as Hero;
    const heroes = [hero1, hero2];

    let heroCollectionService: EntityCollectionService<Hero>;
    let dataService: TestDataService;
    let reducedActions$Snoop: () => void;

    beforeEach(() => {
      ({ dataService, heroCollectionService, reducedActions$Snoop } =
        entityServicesSetup());
    });

    it('can cancel a long running query', () =>
      new Promise<void>((done, fail) => {
        const responseDelay = 4;
        dataService['getAll'].mockReturnValue(
          of(heroes).pipe(delay(responseDelay))
        );

        // Create the correlation id yourself to know which action to cancel.
        const correlationId = 'CRID007';
        const options: EntityActionOptions = { correlationId };
        heroCollectionService.getAll(options).subscribe({
          next: (data) => fail('should not have data but got data'),
          error: (error) => {
            expect(error instanceof PersistanceCanceled).toBe(true);
            expect(error.message).toBe('Test cancel');
            done();
          },
        });

        heroCollectionService.cancel(correlationId, 'Test cancel');
      }));

    it('has no effect on action with different correlationId', () =>
      new Promise<void>((done, fail) => {
        const responseDelay = 4;
        dataService['getAll'].mockReturnValue(
          of(heroes).pipe(delay(responseDelay))
        );

        const correlationId = 'CRID007';
        const options: EntityActionOptions = { correlationId };
        heroCollectionService.getAll(options).subscribe({
          next: (data) => {
            expect(data).toEqual(heroes);
            done();
          },
          error: fail,
        });

        heroCollectionService.cancel('not-the-crid');
      }));

    it('has no effect when too late', () =>
      new Promise<void>((done, fail) => {
        const responseDelay = 4;
        dataService['getAll'].mockReturnValue(
          of(heroes).pipe(delay(responseDelay))
        );

        const correlationId = 'CRID007';
        const options: EntityActionOptions = { correlationId };
        heroCollectionService.getAll(options).subscribe({
          next: (data) => expect(data).toEqual(heroes),
          error: fail,
        });

        setTimeout(
          () => heroCollectionService.cancel(correlationId),
          responseDelay + 2
        );
        setTimeout(done, responseDelay + 4); // wait for all to complete
      }));
  });

  describe.skip('saves (optimistic)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        providers: [
          {
            provide: EntityDispatcherDefaultOptions,
            useClass: OptimisticDispatcherDefaultOptions,
          },
        ],
      });
    });

    combinedSaveTests(true);
  });

  describe.skip('saves (pessimistic)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        providers: [
          {
            provide: EntityDispatcherDefaultOptions,
            useClass: PessimisticDispatcherDefaultOptions,
          },
        ],
      });
    });

    combinedSaveTests(false);
  });

  /** Save tests to be run both optimistically and pessimistically */
  function combinedSaveTests(isOptimistic: boolean) {
    let heroCollectionService: EntityCollectionService<Hero>;
    let dataService: TestDataService;
    let expectOptimisticSuccess: (expect: boolean) => () => void;
    let reducedActions$Snoop: () => void;
    let successActions$: Observable<EntityAction>;

    beforeEach(() => {
      ({
        dataService,
        expectOptimisticSuccess,
        heroCollectionService,
        reducedActions$Snoop,
        successActions$,
      } = entityServicesSetup());
    });

    it('add() should save a new entity and return it', () =>
      new Promise<void>((done, fail) => {
        const extra = expectOptimisticSuccess(isOptimistic);
        const hero = { id: 1, name: 'A' } as Hero;
        dataService.setResponse('add', hero);
        heroCollectionService
          .add(hero)
          .subscribe(expectDataToBe(hero, { done, fail }, undefined, extra));
      }));

    it('add() observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        const hero = { id: 1, name: 'A' } as Hero;
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeDataServiceError('PUT', httpError);
        dataService.setErrorResponse('add', error);
        heroCollectionService
          .add(hero)
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));

    it('delete() should send delete for entity not in cache and return its id', () =>
      new Promise<void>((done, fail) => {
        const extra = expectOptimisticSuccess(isOptimistic);
        dataService.setResponse('delete', 42);
        heroCollectionService
          .delete(42)
          .subscribe(expectDataToBe(42, { done, fail }, undefined, extra));
      }));

    it('delete() should skip delete for added entity cache', () =>
      new Promise<void>((done, fail) => {
        // reducedActions$Snoop();
        let wasSkipped: boolean;
        successActions$.subscribe(
          (act: EntityAction) => (wasSkipped = act.payload.skip === true)
        );
        const extra = () => expect(wasSkipped).toBe(true);

        const hero = { id: 1, name: 'A' } as Hero;
        heroCollectionService.addOneToCache(hero);
        dataService.setResponse('delete', 1);
        heroCollectionService
          .delete(1)
          .subscribe(expectDataToBe(1, { done, fail }, undefined, extra));
      }));

    it('delete() observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeDataServiceError('DELETE', httpError);
        dataService.setErrorResponse('delete', error);
        heroCollectionService
          .delete(42)
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));

    it('update() should save updated entity and return it', () =>
      new Promise<void>((done, fail) => {
        const extra = expectOptimisticSuccess(isOptimistic);
        const preUpdate = { id: 1, name: 'A' } as Hero;
        heroCollectionService.addAllToCache([preUpdate]); // populate cache
        const update = { ...preUpdate, name: 'Updated A' };
        dataService.setResponse('update', null); // server returns nothing after update
        heroCollectionService
          .update(update)
          .subscribe(expectDataToBe(update, { done, fail }, undefined, extra));
      }));

    it('update() should save updated entity and return server-changed version', () =>
      new Promise<void>((done, fail) => {
        const extra = expectOptimisticSuccess(isOptimistic);
        const preUpdate = { id: 1, name: 'A' } as Hero;
        heroCollectionService.addAllToCache([preUpdate]); // populate cache
        const update = { ...preUpdate, name: 'Updated A' };
        const postUpdate = {
          ...preUpdate,
          name: 'Updated A',
          saying: 'Server set this',
        };
        dataService.setResponse('update', postUpdate); // server returns entity with server-side changes
        heroCollectionService
          .update(update)
          .subscribe(
            expectDataToBe(postUpdate, { done, fail }, undefined, extra)
          );
      }));

    it('update() observable should emit expected error when data service fails', () =>
      new Promise<void>((done, fail) => {
        const preUpdate = { id: 1, name: 'A' } as Hero;
        heroCollectionService.addAllToCache([preUpdate]); // populate cache
        const update = { ...preUpdate, name: 'Updated A' };
        const httpError = { error: new Error('Test Failure'), status: 501 };
        const error = makeDataServiceError('PUT', httpError);
        dataService.setErrorResponse('update', error);
        heroCollectionService
          .update(update)
          .subscribe(expectErrorToBe(error, { done, fail }));
      }));

    it('can handle out-of-order save results', () =>
      new Promise<void>((done) => {
        const hero1 = { id: 1, name: 'A' } as Hero;
        const hero2 = { id: 2, name: 'B' } as Hero;
        let successActionCount = 0;
        const delayMs = 5;
        let responseDelay = delayMs;
        const savedHeroes: Hero[] = [];

        successActions$.pipe(delay(1)).subscribe((act) => {
          successActionCount += 1;
          if (successActionCount === 2) {
            // Confirm hero2 actually saved before hero1
            expect(savedHeroes).toEqual([hero2, hero1]);
            done();
          }
        });

        // dataService.add returns odd responses later than even responses
        // so add of hero2 should complete before add of hero1
        dataService['add'].mockImplementation((data: Hero) => {
          const result = of(data).pipe(
            delay(responseDelay),
            tap((h) => savedHeroes.push(h))
          );
          responseDelay = delayMs === responseDelay ? 1 : responseDelay;
          return result;
        });

        // Save hero1 before hero2
        // Confirm that each add returns with its own hero
        heroCollectionService
          .add(hero1)
          .subscribe((data) => expect(data).toEqual(hero1));

        heroCollectionService
          .add(hero2)
          .subscribe((data) => expect(data).toEqual(hero2));
      }));
  }

  describe('selectors$', () => {
    let entityActionFactory: EntityActionFactory;
    let heroCollectionService: EntityCollectionService<Hero>;
    let store: Store<EntityCache>;

    function dispatchedAction() {
      return <EntityAction>(<Mock>store.dispatch).mock.calls.at(0)?.[0];
    }

    beforeEach(() => {
      const setup = entityServicesSetup();
      ({ entityActionFactory, heroCollectionService, store } = setup);
      vi.spyOn(store, 'dispatch');
    });

    it('can get collection from collection$', () => {
      const action = entityActionFactory.create('Hero', EntityOp.ADD_ALL, [
        { id: 1, name: 'A' },
      ]);
      store.dispatch(action);
      heroCollectionService.collection$.subscribe((collection) => {
        expect(collection.ids).toEqual([1]);
      });
    });
  });
});

// #region test helpers
class Hero {
  id!: number;
  name!: string;
  saying?: string;
}
class Villain {
  key!: string;
  name!: string;
}

const entityMetadata: EntityMetadataMap = {
  Hero: {},
  Villain: { selectId: (villain) => villain.key },
};

function entityServicesSetup() {
  const logger = {
    error: vi.fn().mockName('error'),
    log: vi.fn().mockName('log'),
    warn: vi.fn().mockName('warn'),
  };

  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      EntityDataModule.forRoot({
        entityMetadata: entityMetadata,
      }),
    ],
    providers: [
      { provide: EntityCacheEffects, useValue: {} },
      /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
      { provide: EntityDataService, useClass: TestDataService },
      { provide: Logger, useValue: logger },
    ],
  });

  const actions$: Observable<Action> = TestBed.inject(Actions);
  const dataService: TestDataService = TestBed.inject<unknown>(
    EntityDataService
  ) as TestDataService;
  const entityActionFactory: EntityActionFactory =
    TestBed.inject(EntityActionFactory);
  const entityDispatcherFactory: EntityDispatcherFactory = TestBed.inject(
    EntityDispatcherFactory
  );
  const entityServices: EntityServices = TestBed.inject(EntityServices);
  const heroCollectionService =
    entityServices.getEntityCollectionService<Hero>('Hero');
  const reducedActions$: Observable<Action> =
    entityDispatcherFactory.reducedActions$;
  const store: Store<EntityCache> = TestBed.inject(Store);
  const successActions$: Observable<EntityAction> = reducedActions$.pipe(
    filter(
      (act: any) => act.payload && act.payload.entityOp.endsWith(OP_SUCCESS)
    )
  );

  /** Returns fn that confirms EntityAction was (or was not Optimistic) after success */
  function expectOptimisticSuccess(expected: boolean) {
    let wasOptimistic: boolean;
    const msg = `${expected ? 'Optimistic' : 'Pessimistic'} save `;
    successActions$.subscribe(
      (act: EntityAction) => (wasOptimistic = act.payload.isOptimistic === true)
    );
    return () => expect(wasOptimistic).toBe(expected);
  }

  /** Snoop on reducedActions$ while debugging a test */
  function reducedActions$Snoop() {
    reducedActions$.subscribe((act) => {
      console.log('scannedActions$', act);
    });
  }

  return {
    actions$,
    dataService,
    entityActionFactory,
    entityServices,
    expectOptimisticSuccess,
    heroCollectionService,
    reducedActions$,
    reducedActions$Snoop,
    store,
    successActions$,
  };
}

function expectDataToBe(
  expected: any,
  { done, fail }: { done: any; fail: any },
  message?: string,
  extra?: () => void
) {
  return {
    next: (data: any) => {
      expect(data).toEqual(expected);
      if (extra) {
        extra(); // extra expectations before done
      }
      done();
    },
    error: fail,
  };
}

function expectErrorToBe(
  expected: any,
  { done, fail }: { done: any; fail: any },
  message?: string
) {
  return {
    next: (data: any) => {
      fail(`Expected error response but got data: '${JSON.stringify(data)}'`);
      done();
    },
    error: (error: any) => {
      expect(error).toEqual(expected);
      done();
    },
  };
}

/** make error produced by the EntityDataService */
function makeDataServiceError(
  /** Http method for that action */
  method: HttpMethods,
  /** Http error from the web api */
  httpError?: any,
  /** Options sent with the request */
  options?: any
) {
  let url = 'api/heroes';
  if (httpError) {
    url = httpError.url || url;
  } else {
    httpError = { error: new Error('Test error'), status: 500, url };
  }
  return new DataServiceError(httpError, { method, url, options });
}

@Injectable()
export class OptimisticDispatcherDefaultOptions {
  optimisticAdd = true;
  optimisticDelete = true;
  optimisticUpdate = true;
}

@Injectable()
export class PessimisticDispatcherDefaultOptions {
  optimisticAdd = false;
  optimisticDelete = false;
  optimisticUpdate = false;
}

export interface TestDataServiceMethod {
  add: Mock;
  delete: Mock;
  getAll: Mock;
  getById: Mock;
  getWithQuery: Mock;
  update: Mock;
}

export class TestDataService {
  add = vi.fn().mockName('add');
  delete = vi.fn().mockName('delete');
  getAll = vi.fn().mockName('getAll');
  getById = vi.fn().mockName('getById');
  getWithQuery = vi.fn().mockName('getWithQuery');
  update = vi.fn().mockName('update');

  getService(): TestDataServiceMethod {
    return this;
  }

  setResponse(methodName: keyof TestDataServiceMethod, data: any) {
    this[methodName].mockReturnValue(of(data).pipe(delay(1)));
  }

  setErrorResponse(methodName: keyof TestDataServiceMethod, error: any) {
    // Following won't quite work because delay does not appear to delay an error
    // this[methodName].mockReturnValue(throwError(() => error).pipe(delay(1)));
    // Use timer instead
    this[methodName].mockReturnValue(
      timer(1).pipe(mergeMap(() => throwError(() => error)))
    );
  }
}
// #endregion test helpers
