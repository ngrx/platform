// Not using marble testing
import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { of, merge, ReplaySubject, throwError, timer } from 'rxjs';
import { delay, first, mergeMap } from 'rxjs/operators';

import {
  EntityActionFactory,
  EntityEffects,
  EntityAction,
  EntityDataService,
  PersistenceResultHandler,
  DefaultPersistenceResultHandler,
  EntityOp,
  HttpMethods,
  DataServiceError,
  makeErrorOp,
  EntityActionDataServiceError,
  Logger,
} from '../..';

describe('EntityEffects (normal testing)', () => {
  // factory never changes in these tests
  const entityActionFactory = new EntityActionFactory();

  let actions$: ReplaySubject<Action>;
  let effects: EntityEffects;
  let logger: Logger;
  let dataService: TestDataService;

  function expectCompletion(completion: EntityAction, done: any) {
    effects.persist$.subscribe(
      (result) => {
        expect(result).toEqual(completion);
        done();
      },
      (error) => {
        fail(error);
      }
    );
  }

  beforeEach(() => {
    logger = {
      error: jasmine.createSpy('error'),
      log: jasmine.createSpy('log'),
      warn: jasmine.createSpy('warn'),
    };
    actions$ = new ReplaySubject<Action>(1);

    TestBed.configureTestingModule({
      providers: [
        EntityEffects,
        { provide: Actions, useValue: actions$ },
        { provide: EntityActionFactory, useValue: entityActionFactory },
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        { provide: EntityDataService, useClass: TestDataService },
        { provide: Logger, useValue: logger },
        {
          provide: PersistenceResultHandler,
          useClass: DefaultPersistenceResultHandler,
        },
      ],
    });

    actions$ = TestBed.inject<unknown>(Actions) as ReplaySubject<Action>;
    effects = TestBed.inject(EntityEffects);
    dataService = TestBed.inject<unknown>(EntityDataService) as TestDataService;
  });

  it('cancel$ should emit correlation id for CANCEL_PERSIST', (done: any) => {
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.CANCEL_PERSIST,
      undefined,
      { correlationId: 42 }
    );
    effects.cancel$.subscribe((crid: any) => {
      expect(crid).toBe(42);
      done();
    });
    actions$.next(action);
  });

  it('should return a QUERY_ALL_SUCCESS with the heroes on success', (done: any) => {
    const hero1 = { id: 1, name: 'A' } as Hero;
    const hero2 = { id: 2, name: 'B' } as Hero;
    const heroes = [hero1, hero2];
    dataService.setResponse('getAll', heroes);

    const action = entityActionFactory.create('Hero', EntityOp.QUERY_ALL);
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.QUERY_ALL_SUCCESS,
      heroes
    );

    actions$.next(action);
    expectCompletion(completion, done);
  });

  it('should perform QUERY_ALL when dispatch custom tagged action', (done: any) => {
    const hero1 = { id: 1, name: 'A' } as Hero;
    const hero2 = { id: 2, name: 'B' } as Hero;
    const heroes = [hero1, hero2];
    dataService.setResponse('getAll', heroes);

    const action = entityActionFactory.create({
      entityName: 'Hero',
      entityOp: EntityOp.QUERY_ALL,
      tag: 'Custom Hero Tag',
    });

    const completion = entityActionFactory.createFromAction(action, {
      entityOp: EntityOp.QUERY_ALL_SUCCESS,
      data: heroes,
    });

    actions$.next(action);
    expectCompletion(completion, done);
  });

  it('should perform QUERY_ALL when dispatch custom action w/ that entityOp', (done: any) => {
    const hero1 = { id: 1, name: 'A' } as Hero;
    const hero2 = { id: 2, name: 'B' } as Hero;
    const heroes = [hero1, hero2];
    dataService.setResponse('getAll', heroes);

    const action = {
      type: 'some/arbitrary/type/text',
      payload: {
        entityName: 'Hero',
        entityOp: EntityOp.QUERY_ALL,
      },
    };

    const completion = entityActionFactory.createFromAction(action, {
      entityOp: EntityOp.QUERY_ALL_SUCCESS,
      data: heroes,
    });

    actions$.next(action);
    expectCompletion(completion, done);
  });

  it('should return a QUERY_ALL_ERROR when data service fails', (done: any) => {
    const action = entityActionFactory.create('Hero', EntityOp.QUERY_ALL);
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('GET', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions$.next(action);
    dataService.setErrorResponse('getAll', error);

    expectCompletion(completion, done);
    expect(completion.payload.entityOp).toEqual(EntityOp.QUERY_ALL_ERROR);
  });

  it('should return a QUERY_BY_KEY_SUCCESS with a hero on success', (done: any) => {
    const hero = { id: 1, name: 'A' } as Hero;
    const action = entityActionFactory.create('Hero', EntityOp.QUERY_BY_KEY, 1);
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.QUERY_BY_KEY_SUCCESS,
      hero
    );

    actions$.next(action);
    dataService.setResponse('getById', hero);

    expectCompletion(completion, done);
  });

  it('should return a QUERY_BY_KEY_ERROR when data service fails', (done: any) => {
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.QUERY_BY_KEY,
      42
    );
    const httpError = { error: new Error('Entity not found'), status: 404 };
    const error = makeDataServiceError('GET', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions$.next(action);
    dataService.setErrorResponse('getById', error);

    expectCompletion(completion, done);
  });

  it('should return a QUERY_MANY_SUCCESS with selected heroes on success', (done: any) => {
    const hero1 = { id: 1, name: 'BA' } as Hero;
    const hero2 = { id: 2, name: 'BB' } as Hero;
    const heroes = [hero1, hero2];

    const action = entityActionFactory.create('Hero', EntityOp.QUERY_MANY, {
      name: 'B',
    });
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.QUERY_MANY_SUCCESS,
      heroes
    );

    actions$.next(action);
    dataService.setResponse('getWithQuery', heroes);

    expectCompletion(completion, done);
  });

  it('should return a QUERY_MANY_ERROR when data service fails', (done: any) => {
    const action = entityActionFactory.create('Hero', EntityOp.QUERY_MANY, {
      name: 'B',
    });
    const httpError = { error: new Error('Resource not found'), status: 404 };
    const error = makeDataServiceError('GET', httpError, {
      name: 'B',
    });
    const completion = makeEntityErrorCompletion(action, error);

    actions$.next(action);
    dataService.setErrorResponse('getWithQuery', error);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_ADD_ONE_SUCCESS (Optimistic) with the hero on success', (done: any) => {
    const hero = { id: 1, name: 'A' } as Hero;

    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_ADD_ONE,
      hero,
      { isOptimistic: true }
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_ADD_ONE_SUCCESS,
      hero,
      { isOptimistic: true }
    );

    actions$.next(action);
    dataService.setResponse('add', hero);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_ADD_ONE_SUCCESS (Pessimistic) with the hero on success', (done: any) => {
    const hero = { id: 1, name: 'A' } as Hero;

    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_ADD_ONE,
      hero
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_ADD_ONE_SUCCESS,
      hero
    );

    actions$.next(action);
    dataService.setResponse('add', hero);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_ADD_ONE_ERROR when data service fails', (done: any) => {
    const hero = { id: 1, name: 'A' } as Hero;
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_ADD_ONE,
      hero
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('PUT', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions$.next(action);
    dataService.setErrorResponse('add', error);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_DELETE_ONE_SUCCESS (Optimistic) on success with delete id', (done: any) => {
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_DELETE_ONE,
      42,
      { isOptimistic: true }
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_DELETE_ONE_SUCCESS,
      42,
      { isOptimistic: true }
    );

    actions$.next(action);
    dataService.setResponse('delete', 42);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_DELETE_ONE_SUCCESS (Pessimistic) on success', (done: any) => {
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_DELETE_ONE,
      42
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_DELETE_ONE_SUCCESS,
      42
    );

    actions$.next(action);
    dataService.setResponse('delete', 42);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_DELETE_ONE_ERROR when data service fails', (done: any) => {
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_DELETE_ONE,
      42
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('DELETE', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions$.next(action);
    dataService.setErrorResponse('delete', error);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_UPDATE_ONE_SUCCESS (Optimistic) with the hero on success', (done: any) => {
    const updateEntity = { id: 1, name: 'A' };
    const update = { id: 1, changes: updateEntity } as Update<Hero>;
    const updateResponse = { ...update, changed: true };

    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPDATE_ONE,
      update,
      { isOptimistic: true }
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPDATE_ONE_SUCCESS,
      updateResponse,
      { isOptimistic: true }
    );

    actions$.next(action);
    dataService.setResponse('update', updateEntity);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_UPDATE_ONE_SUCCESS (Pessimistic) with the hero on success', (done: any) => {
    const updateEntity = { id: 1, name: 'A' };
    const update = { id: 1, changes: updateEntity } as Update<Hero>;
    const updateResponse = { ...update, changed: true };

    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPDATE_ONE,
      update
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPDATE_ONE_SUCCESS,
      updateResponse
    );

    actions$.next(action);
    dataService.setResponse('update', updateEntity);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_UPDATE_ONE_ERROR when data service fails', (done: any) => {
    const update = { id: 1, changes: { id: 1, name: 'A' } } as Update<Hero>;
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPDATE_ONE,
      update
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('PUT', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions$.next(action);
    dataService.setErrorResponse('update', error);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_UPSERT_ONE_SUCCESS (Optimistic) with the hero on success', (done: any) => {
    const hero = { id: 1, name: 'A' } as Hero;

    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPSERT_ONE,
      hero,
      { isOptimistic: true }
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPSERT_ONE_SUCCESS,
      hero,
      { isOptimistic: true }
    );

    actions$.next(action);
    dataService.setResponse('upsert', hero);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_UPSERT_ONE_SUCCESS (Pessimistic) with the hero on success', (done: any) => {
    const hero = { id: 1, name: 'A' } as Hero;

    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPSERT_ONE,
      hero
    );
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPSERT_ONE_SUCCESS,
      hero
    );

    actions$.next(action);
    dataService.setResponse('upsert', hero);

    expectCompletion(completion, done);
  });

  it('should return a SAVE_UPSERT_ONE_ERROR when data service fails', (done: any) => {
    const hero = { id: 1, name: 'A' } as Hero;
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPSERT_ONE,
      hero
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('POST', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions$.next(action);
    dataService.setErrorResponse('upsert', error);

    expectCompletion(completion, done);
  });
  it(`should not do anything with an irrelevant action`, (done: any) => {
    // Would clear the cached collection
    const action = entityActionFactory.create('Hero', EntityOp.REMOVE_ALL);

    actions$.next(action);
    const sentinel = 'no persist$ effect';

    merge(
      effects.persist$,
      of(sentinel).pipe(delay(1))
      // of(entityActionFactory.create('Hero', EntityOp.QUERY_ALL)) // will cause test to fail
    )
      .pipe(first())
      .subscribe(
        (result) => expect(result).toEqual(sentinel),
        (err) => {
          fail(err);
          done();
        },
        done
      );
  });
});

// #region test helpers
export class Hero {
  id!: number;
  name!: string;
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

/** Make an EntityDataService error */
function makeEntityErrorCompletion(
  /** The action that initiated the data service call */
  originalAction: EntityAction,
  /** error produced by the EntityDataService */
  error: DataServiceError
) {
  const errOp = makeErrorOp(originalAction.payload.entityOp);

  // Entity Error Action
  const eaFactory = new EntityActionFactory();
  return eaFactory.create<EntityActionDataServiceError>('Hero', errOp, {
    originalAction,
    error,
  });
}

export interface TestDataServiceMethod {
  add: jasmine.Spy;
  delete: jasmine.Spy;
  getAll: jasmine.Spy;
  getById: jasmine.Spy;
  getWithQuery: jasmine.Spy;
  update: jasmine.Spy;
  upsert: jasmine.Spy;
}
export class TestDataService {
  add = jasmine.createSpy('add');
  delete = jasmine.createSpy('delete');
  getAll = jasmine.createSpy('getAll');
  getById = jasmine.createSpy('getById');
  getWithQuery = jasmine.createSpy('getWithQuery');
  update = jasmine.createSpy('update');
  upsert = jasmine.createSpy('upsert');

  getService(): TestDataServiceMethod {
    return this;
  }

  setResponse(methodName: keyof TestDataServiceMethod, data: any) {
    this[methodName].and.returnValue(of(data).pipe(delay(1)));
  }

  setErrorResponse(methodName: keyof TestDataServiceMethod, error: any) {
    // Following won't quite work because delay does not appear to delay an error
    // this[methodName].and.returnValue(throwError(() => error).pipe(delay(1)));
    // Use timer instead
    this[methodName].and.returnValue(
      timer(1).pipe(mergeMap(() => throwError(() => error)))
    );
  }
}
// #endregion test helpers
