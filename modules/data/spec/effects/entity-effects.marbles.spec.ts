// Using marble testing
import { TestBed } from '@angular/core/testing';

import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { Actions } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  EntityEffects,
  EntityActionFactory,
  EntityDataService,
  PersistenceResultHandler,
  DefaultPersistenceResultHandler,
  EntityOp,
  HttpMethods,
  DataServiceError,
  EntityAction,
  makeErrorOp,
  EntityActionDataServiceError,
  Logger,
} from '../..';
import { ENTITY_EFFECTS_SCHEDULER } from '../../src/effects/entity-effects-scheduler';

//////// Tests begin ////////
describe('EntityEffects (marble testing)', () => {
  let effects: EntityEffects;
  let entityActionFactory: EntityActionFactory;
  let dataService: TestDataService;
  let actions: Observable<any>;
  let logger: Logger;

  beforeEach(() => {
    logger = {
      error: jasmine.createSpy('error'),
      log: jasmine.createSpy('log'),
      warn: jasmine.createSpy('warn'),
    };

    TestBed.configureTestingModule({
      providers: [
        EntityEffects,
        provideMockActions(() => actions),
        EntityActionFactory,
        // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
        { provide: ENTITY_EFFECTS_SCHEDULER, useFactory: getTestScheduler },
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        { provide: EntityDataService, useClass: TestDataService },
        { provide: Logger, useValue: logger },
        {
          provide: PersistenceResultHandler,
          useClass: DefaultPersistenceResultHandler,
        },
      ],
    });
    actions = TestBed.inject(Actions);
    dataService = TestBed.inject<unknown>(EntityDataService) as TestDataService;
    entityActionFactory = TestBed.inject(EntityActionFactory);
    effects = TestBed.inject(EntityEffects);
  });

  it('should return a QUERY_ALL_SUCCESS with the heroes on success', () => {
    const hero1 = { id: 1, name: 'A' } as Hero;
    const hero2 = { id: 2, name: 'B' } as Hero;
    const heroes = [hero1, hero2];

    const action = entityActionFactory.create('Hero', EntityOp.QUERY_ALL);
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.QUERY_ALL_SUCCESS,
      heroes
    );

    const x = hot('-a---', { a: action });
    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: heroes });
    const expected = cold('----b', { b: completion });
    dataService.getAll.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a QUERY_ALL_ERROR when data service fails', () => {
    const action = entityActionFactory.create('Hero', EntityOp.QUERY_ALL);
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('GET', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions = hot('-a---', { a: action });
    const response = cold('----#|', {}, error);
    const expected = cold('------b', { b: completion });
    dataService.getAll.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
    expect(completion.payload.entityOp).toEqual(EntityOp.QUERY_ALL_ERROR);
  });

  it('should return a QUERY_BY_KEY_SUCCESS with a hero on success', () => {
    const hero = { id: 1, name: 'A' } as Hero;
    const action = entityActionFactory.create('Hero', EntityOp.QUERY_BY_KEY, 1);
    const completion = entityActionFactory.create(
      'Hero',
      EntityOp.QUERY_BY_KEY_SUCCESS,
      hero
    );

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: hero });
    const expected = cold('----b', { b: completion });
    dataService.getById.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a QUERY_BY_KEY_ERROR when data service fails', () => {
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.QUERY_BY_KEY,
      42
    );
    const httpError = { error: new Error('Entity not found'), status: 404 };
    const error = makeDataServiceError('GET', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions = hot('-a---', { a: action });
    const response = cold('----#|', {}, error);
    const expected = cold('------b', { b: completion });
    dataService.getById.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a QUERY_MANY_SUCCESS with selected heroes on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: heroes });
    const expected = cold('----b', { b: completion });
    dataService.getWithQuery.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a QUERY_MANY_ERROR when data service fails', () => {
    const action = entityActionFactory.create('Hero', EntityOp.QUERY_MANY, {
      name: 'B',
    });
    const httpError = { error: new Error('Resource not found'), status: 404 };
    const error = makeDataServiceError('GET', httpError, {
      name: 'B',
    });
    const completion = makeEntityErrorCompletion(action, error);

    actions = hot('-a---', { a: action });
    const response = cold('----#|', {}, error);
    const expected = cold('------b', { b: completion });
    dataService.getWithQuery.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
    expect(completion.payload.entityOp).toEqual(EntityOp.QUERY_MANY_ERROR);
  });

  it('should return a SAVE_ADD_ONE_SUCCESS (optimistic) with the hero on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: hero });
    const expected = cold('----b', { b: completion });
    dataService.add.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_ADD_ONE_SUCCESS (pessimistic) with the hero on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: hero });
    const expected = cold('----b', { b: completion });
    dataService.add.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_ADD_ONE_ERROR when data service fails', () => {
    const hero = { id: 1, name: 'A' } as Hero;
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_ADD_ONE,
      hero
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('PUT', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions = hot('-a---', { a: action });
    const response = cold('----#|', {}, error);
    const expected = cold('------b', { b: completion });
    dataService.add.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_DELETE_ONE_SUCCESS (Optimistic) with the delete id on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: 42 });
    const expected = cold('----b', { b: completion });
    dataService.delete.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_DELETE_ONE_SUCCESS (Pessimistic) on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: 42 });
    const expected = cold('----b', { b: completion });
    dataService.delete.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_DELETE_ONE_ERROR when data service fails', () => {
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_DELETE_ONE,
      42
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('DELETE', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions = hot('-a---', { a: action });
    const response = cold('----#|', {}, error);
    const expected = cold('------b', { b: completion });
    dataService.delete.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_UPDATE_ONE_SUCCESS (Optimistic) with the hero on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: updateEntity });
    const expected = cold('----b', { b: completion });
    dataService.update.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_UPDATE_ONE_SUCCESS (Pessimistic) with the hero on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: updateEntity });
    const expected = cold('----b', { b: completion });
    dataService.update.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_UPDATE_ONE_ERROR when data service fails', () => {
    const update = { id: 1, changes: { id: 1, name: 'A' } } as Update<Hero>;
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPDATE_ONE,
      update
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('PUT', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions = hot('-a---', { a: action });
    const response = cold('----#|', {}, error);
    const expected = cold('------b', { b: completion });
    dataService.update.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_UPSERT_ONE_SUCCESS (optimistic) with the hero on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: hero });
    const expected = cold('----b', { b: completion });
    dataService.upsert.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_UPSERT_ONE_SUCCESS (pessimistic) with the hero on success', () => {
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

    actions = hot('-a---', { a: action });
    // delay the response 3 frames
    const response = cold('---a|', { a: hero });
    const expected = cold('----b', { b: completion });
    dataService.upsert.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it('should return a SAVE_UPSERT_ONE_ERROR when data service fails', () => {
    const hero = { id: 1, name: 'A' } as Hero;
    const action = entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_UPSERT_ONE,
      hero
    );
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('POST', httpError);
    const completion = makeEntityErrorCompletion(action, error);

    actions = hot('-a---', { a: action });
    const response = cold('----#|', {}, error);
    const expected = cold('------b', { b: completion });
    dataService.upsert.and.returnValue(response);

    expect(effects.persist$).toBeObservable(expected);
  });

  it(`should not do anything with an irrelevant action`, () => {
    // Would clear the cached collection
    const action = entityActionFactory.create('Hero', EntityOp.REMOVE_ALL);

    actions = hot('-a---', { a: action });
    const expected = cold('---');

    expect(effects.persist$).toBeObservable(expected);
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

  setResponse(methodName: keyof TestDataServiceMethod, data$: Observable<any>) {
    this[methodName].and.returnValue(data$);
  }
}
// #endregion test helpers
