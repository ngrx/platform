import { Injectable, InjectionToken } from '@angular/core';
import {
  Action,
  ActionReducer,
  MetaReducer,
  Store,
  StoreModule,
} from '@ngrx/store';
import { Actions, EffectsModule, createEffect } from '@ngrx/effects';

// Not using marble testing
import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';

import {
  EntityCache,
  ofEntityOp,
  persistOps,
  EntityAction,
  EntityActionFactory,
  EntityDataModule,
  EntityCacheEffects,
  EntityEffects,
  EntityOp,
  EntityCollectionCreator,
  EntityCollection,
} from '..';

const TEST_ACTION = 'test/get-everything-succeeded';
const EC_METAREDUCER_TOKEN = new InjectionToken<
  MetaReducer<EntityCache, Action>
>('EC MetaReducer');

@Injectable()
class TestEntityEffects {
  test$: Observable<Action> = createEffect(() =>
    this.actions.pipe(
      // tap(action => console.log('test$ effect', action)),
      ofEntityOp(persistOps),
      map(this.testHook)
    )
  );

  testHook(action: EntityAction) {
    return {
      type: 'test-action',
      payload: action, // the incoming action
      entityName: action.payload.entityName,
    };
  }

  constructor(private actions: Actions<EntityAction>) {}
}

class Hero {
  id!: number;
  name!: string;
  power?: string;
}

class Villain {
  id!: string;
  name!: string;
}

const entityMetadata = {
  Hero: {},
  Villain: {},
};

//////// Tests begin ////////

describe('EntityDataModule', () => {
  describe('with replaced EntityEffects', () => {
    // factory never changes in these tests
    const entityActionFactory = new EntityActionFactory();

    let actions$: Actions;
    let store: Store<EntityCache>;
    let testEffects: TestEntityEffects;

    beforeEach(() => {
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
          { provide: EntityEffects, useClass: TestEntityEffects },
        ],
      });

      actions$ = TestBed.inject(Actions);
      store = TestBed.inject(Store);

      testEffects = TestBed.inject<unknown>(EntityEffects) as TestEntityEffects;
      spyOn(testEffects, 'testHook').and.callThrough();
    });

    it('should invoke test effect with an EntityAction', () => {
      const actions: Action[] = [];

      // listen for actions after the next dispatched action
      actions$
        .pipe(
          // tap(act => console.log('test action', act)),
          skip(1) // Skip QUERY_ALL
        )
        .subscribe((act) => actions.push(act));

      const action = entityActionFactory.create('Hero', EntityOp.QUERY_ALL);
      store.dispatch(action);
      expect(actions.length).toBe(1);
      expect(actions[0].type).toBe('test-action');
    });

    it('should not invoke test effect with non-EntityAction', () => {
      const actions: Action[] = [];

      // listen for actions after the next dispatched action
      actions$.pipe(skip(1)).subscribe((act) => actions.push(act));

      store.dispatch({ type: 'not-an-entity-action' });
      expect(actions.length).toBe(0);
    });
  });

  describe('with EntityCacheMetaReducer', () => {
    let cacheSelector$: Observable<EntityCache>;
    let eaFactory: EntityActionFactory;
    let metaReducerLog: string[];
    let store: Store<{ entityCache: EntityCache }>;

    function loggingEntityCacheMetaReducer(
      reducer: ActionReducer<EntityCache>
    ): ActionReducer<EntityCache> {
      return (state, action) => {
        metaReducerLog.push(`MetaReducer saw "${action.type}"`);
        return reducer(state, action);
      };
    }

    beforeEach(() => {
      metaReducerLog = [];

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          EntityDataModule.forRoot({
            entityMetadata: entityMetadata,
            entityCacheMetaReducers: [
              loggingEntityCacheMetaReducer,
              EC_METAREDUCER_TOKEN,
            ],
          }),
        ],
        providers: [
          { provide: EntityCacheEffects, useValue: {} },
          { provide: EntityEffects, useValue: {} },
          {
            // Here's how you add an EntityCache metareducer with an injected service
            provide: EC_METAREDUCER_TOKEN,
            useFactory: entityCacheMetaReducerFactory,
            deps: [EntityCollectionCreator],
          },
        ],
      });

      store = TestBed.inject(Store);
      cacheSelector$ = <any>store.select((state) => state.entityCache);
      eaFactory = TestBed.inject(EntityActionFactory);
    });

    it('should log an ordinary entity action', () => {
      const action = eaFactory.create('Hero', EntityOp.SET_LOADING);
      store.dispatch(action);
      expect(metaReducerLog.join('|')).toContain(EntityOp.SET_LOADING);
    });

    it('should respond to action handled by custom EntityCacheMetaReducer', (done) => {
      const data = {
        Hero: [
          { id: 2, name: 'B', power: 'Fast' },
          { id: 1, name: 'A', power: 'invisible' },
        ],
        Villain: [{ id: 30, name: 'Dr. Evil' }],
      };
      const action = {
        type: TEST_ACTION,
        payload: data,
      };
      store.dispatch(action);
      cacheSelector$.subscribe({
        next: (cache) => {
          try {
            expect(cache.Hero.entities[1]).toEqual(data.Hero[1]);
            expect(cache.Villain.entities[30]).toEqual(data.Villain[0]);
            expect(metaReducerLog.join('|')).toContain(TEST_ACTION);
            done();
          } catch (error: any) {
            fail(error);
          }
        },
        error: fail,
      });
    });
  });
});

// #region helpers

/** Create the test entityCacheMetaReducer, injected in tests */
function entityCacheMetaReducerFactory(
  collectionCreator: EntityCollectionCreator
) {
  return (reducer: ActionReducer<EntityCache, Action>) => {
    return (state: EntityCache, action: { type: string; payload?: any }) => {
      switch (action.type) {
        case TEST_ACTION: {
          const mergeState = {
            Hero: createCollection<Hero>('Hero', action.payload['Hero'] || []),
            Villain: createCollection<Villain>(
              'Villain',
              action.payload['Villain'] || []
            ),
          };
          return { ...state, ...mergeState };
        }
      }
      return reducer(state, action);
    };
  };

  function createCollection<T extends { id: any }>(
    entityName: string,
    data: T[]
  ) {
    return {
      ...collectionCreator.create<T>(entityName),
      ids: data.map((e) => e.id),
      entities: data.reduce((acc, e) => {
        acc[e.id] = e;
        return acc;
      }, {} as any),
    } as EntityCollection<T>;
  }
}
// #endregion
