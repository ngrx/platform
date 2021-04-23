// Not using marble testing
import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { observeOn } from 'rxjs/operators';
import { asapScheduler, ReplaySubject, Subject } from 'rxjs';

import {
  EntityCacheEffects,
  EntityActionFactory,
  EntityCacheDataService,
  SaveEntities,
  SaveEntitiesSuccess,
  SaveEntitiesCancel,
  SaveEntitiesCanceled,
  SaveEntitiesError,
  HttpMethods,
  DataServiceError,
  ChangeSet,
  ChangeSetItem,
  ChangeSetOperation,
  Logger,
  MergeStrategy,
} from '../..';

describe('EntityCacheEffects (normal testing)', () => {
  let actions$: ReplaySubject<Action>;
  let correlationId: string;
  let dataService: TestEntityCacheDataService;
  let effects: EntityCacheEffects;
  let logger: Logger;
  let mergeStrategy: MergeStrategy | undefined;
  let options: {
    correlationId: typeof correlationId;
    mergeStrategy: typeof mergeStrategy;
  };

  function expectCompletion(completion: any, done: any) {
    effects.saveEntities$.subscribe((result) => {
      expect(result).toEqual(completion);
      done();
    }, fail);
  }

  beforeEach(() => {
    actions$ = new ReplaySubject<Action>(1);
    correlationId = 'CORID42';
    logger = {
      error: jasmine.createSpy('error'),
      log: jasmine.createSpy('log'),
      warn: jasmine.createSpy('warn'),
    };
    mergeStrategy = undefined;
    options = { correlationId, mergeStrategy };

    const eaFactory = new EntityActionFactory(); // doesn't change.

    TestBed.configureTestingModule({
      providers: [
        EntityCacheEffects,
        { provide: EntityActionFactory, useValue: eaFactory },
        { provide: Actions, useValue: actions$ },
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        {
          provide: EntityCacheDataService,
          useClass: TestEntityCacheDataService,
        },
        { provide: Logger, useValue: logger },
      ],
    });

    actions$ = TestBed.inject(Actions) as ReplaySubject<Action>;
    effects = TestBed.inject(EntityCacheEffects);
    dataService = TestBed.inject<unknown>(
      EntityCacheDataService
    ) as TestEntityCacheDataService;
  });

  it('should return a SAVE_ENTITIES_SUCCESS with the expected ChangeSet on success', (done: any) => {
    const cs = createChangeSet();
    const action = new SaveEntities(cs, 'test/save', options);
    const completion = new SaveEntitiesSuccess(cs, 'test/save', options);

    expectCompletion(completion, done);

    actions$.next(action);
    dataService.setResponse(cs);
  });

  it('should not emit SAVE_ENTITIES_SUCCESS if cancel arrives in time', (done: any) => {
    const cs = createChangeSet();
    const action = new SaveEntities(cs, 'test/save', options);
    const cancel = new SaveEntitiesCancel(correlationId, 'Test Cancel');

    effects.saveEntities$.subscribe((result) => {
      expect(result instanceof SaveEntitiesSuccess).toBe(false);
      expect(result instanceof SaveEntitiesCanceled).toBe(true); // instead
      done();
    }, done.fail);

    actions$.next(action);
    actions$.next(cancel);
    dataService.setResponse(cs);
  });

  it('should emit SAVE_ENTITIES_SUCCESS if cancel arrives too late', (done: any) => {
    const cs = createChangeSet();
    const action = new SaveEntities(cs, 'test/save', options);
    const cancel = new SaveEntitiesCancel(correlationId, 'Test Cancel');

    effects.saveEntities$.subscribe((result) => {
      expect(result instanceof SaveEntitiesSuccess).toBe(true);
      done();
    }, done.fail);

    actions$.next(action);
    dataService.setResponse(cs);
    setTimeout(() => actions$.next(cancel), 1);
  });

  it('should emit SAVE_ENTITIES_SUCCESS immediately if no changes to save', (done: any) => {
    const action = new SaveEntities({ changes: [] }, 'test/save', options);
    effects.saveEntities$.subscribe((result) => {
      expect(result instanceof SaveEntitiesSuccess).toBe(true);
      expect(dataService.saveEntities).not.toHaveBeenCalled();
      done();
    }, done.fail);
    actions$.next(action);
  });

  xit('should return a SAVE_ENTITIES_ERROR when data service fails', (done: any) => {
    const cs = createChangeSet();
    const action = new SaveEntities(cs, 'test/save', options);
    const httpError = { error: new Error('Test Failure'), status: 501 };
    const error = makeDataServiceError('POST', httpError);
    const completion = new SaveEntitiesError(error, action);

    expectCompletion(completion, done);

    actions$.next(action);
    dataService.setErrorResponse(error);
  });
});

// #region test helpers
export class TestEntityCacheDataService {
  response$ = new Subject<any>();

  saveEntities = jasmine
    .createSpy('saveEntities')
    .and.returnValue(this.response$.pipe(observeOn(asapScheduler)));

  setResponse(data: any) {
    this.response$.next(data);
  }

  setErrorResponse(error: any) {
    this.response$.error(error);
  }
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
  let url = 'test/save';
  if (httpError) {
    url = httpError.url || url;
  } else {
    httpError = { error: new Error('Test error'), status: 500, url };
  }
  return new DataServiceError(httpError, { method, url, options });
}

function createChangeSet(): ChangeSet {
  const changes: ChangeSetItem[] = [
    {
      op: ChangeSetOperation.Add,
      entityName: 'Hero',
      entities: [{ id: 1, name: 'A1 Add' }],
    },
    {
      op: ChangeSetOperation.Delete,
      entityName: 'Hero',
      entities: [2, 3],
    },
    {
      op: ChangeSetOperation.Update,
      entityName: 'Villain',
      entities: [
        { id: 4, changes: { id: 4, name: 'V4 Update' } },
        { id: 5, changes: { id: 5, name: 'V5 Update' } },
        { id: 6, changes: { id: 6, name: 'V6 Update' } },
      ],
    },
    {
      op: ChangeSetOperation.Upsert,
      entityName: 'Villain',
      entities: [
        { id: 7, name: 'V7 Upsert new' },
        { id: 4, name: 'V4 Upsert existing' },
      ],
    },
  ];

  return {
    changes,
    extras: { foo: 'anything' },
    tag: 'Test',
  };
}
// #endregion test helpers
