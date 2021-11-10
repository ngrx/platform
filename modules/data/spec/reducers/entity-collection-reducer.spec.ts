// EntityCollectionReducer tests - tests of reducers for entity collections in the entity cache
// Tests for EntityCache-level reducers (e.g., SET_ENTITY_CACHE) are in `entity-cache-reducer.spec.ts`
import { Action } from '@ngrx/store';
import { EntityAdapter, Update, IdSelector } from '@ngrx/entity';

import {
  EntityMetadataMap,
  EntityActionFactory,
  EntityOp,
  EntityActionOptions,
  EntityAction,
  toUpdateFactory,
  EntityCollectionReducerRegistry,
  EntityCache,
  EntityCollectionCreator,
  EntityDefinitionService,
  EntityCollectionReducerMethodsFactory,
  EntityCollectionReducerFactory,
  EntityCacheReducerFactory,
  EntityCollection,
  ChangeStateMap,
  EntityActionDataServiceError,
  DataServiceError,
  ChangeType,
  ChangeState,
  Logger,
} from '../../';

class Foo {
  id!: string;
  foo!: string;
}
class Hero {
  id!: number;
  name!: string;
  power?: string;
}
class Villain {
  key!: string;
  name!: string;
}

const metadata: EntityMetadataMap = {
  Hero: {},
  Villain: { selectId: (villain) => villain.key },
};

describe('EntityCollectionReducer', () => {
  // action factory never changes in these tests
  const entityActionFactory = new EntityActionFactory();
  const createAction: (
    entityName: string,
    op: EntityOp,
    data?: any,
    options?: EntityActionOptions
  ) => EntityAction = entityActionFactory.create.bind(entityActionFactory);

  const toHeroUpdate = toUpdateFactory<Hero>();

  let entityReducerRegistry: EntityCollectionReducerRegistry;
  let entityReducer: (state: EntityCache, action: Action) => EntityCache;

  let initialHeroes: Hero[];
  let initialCache: EntityCache;
  let logger: Logger;
  let collectionCreator: EntityCollectionCreator;

  beforeEach(() => {
    const eds = new EntityDefinitionService([metadata]);
    collectionCreator = new EntityCollectionCreator(eds);
    const collectionReducerMethodsFactory = new EntityCollectionReducerMethodsFactory(
      eds
    );
    const collectionReducerFactory = new EntityCollectionReducerFactory(
      collectionReducerMethodsFactory
    );
    logger = {
      error: jasmine.createSpy('error'),
      log: jasmine.createSpy('log'),
      warn: jasmine.createSpy('warn'),
    };

    entityReducerRegistry = new EntityCollectionReducerRegistry(
      collectionReducerFactory
    );
    const entityCacheReducerFactory = new EntityCacheReducerFactory(
      collectionCreator,
      entityReducerRegistry,
      logger
    );
    entityReducer = entityCacheReducerFactory.create();

    initialHeroes = [
      { id: 2, name: 'B', power: 'Fast' },
      { id: 1, name: 'A', power: 'Invisible' },
    ];
    initialCache = createInitialCache({ Hero: initialHeroes });
  });

  it('should ignore an action without an EntityOp', () => {
    // should not throw
    const action = {
      type: 'does-not-matter',
      payload: {
        entityName: 'Hero',
        entityOp: undefined,
      },
    };
    const newCache = entityReducer(initialCache, action);
    expect(newCache).toBe(initialCache);
  });

  // #region queries
  describe('QUERY_ALL', () => {
    const queryAction = createAction('Hero', EntityOp.QUERY_ALL);

    it('QUERY_ALL sets loading flag but does not fill collection', () => {
      const state = entityReducer({}, queryAction);
      const collection = state['Hero'];
      expect(collection.ids.length).toBe(0);
      expect(collection.loaded).toBe(false);
      expect(collection.loading).toBe(true);
    });

    it('QUERY_ALL_SUCCESS can create the initial collection', () => {
      let state = entityReducer({}, queryAction);
      const heroes: Hero[] = [
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_ALL_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];
      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities['1']).toBe(heroes[1]);
      expect(collection.entities['2']).toBe(heroes[0]);
    });

    it('QUERY_ALL_SUCCESS sets the loaded flag and clears loading flag', () => {
      let state = entityReducer({}, queryAction);
      const heroes: Hero[] = [
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_ALL_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];
      expect(collection.loaded).toBe(true);
      expect(collection.loading).toBe(false);
    });

    it('QUERY_ALL_ERROR clears loading flag and does not fill collection', () => {
      let state = entityReducer({}, queryAction);
      const action = createAction('Hero', EntityOp.QUERY_ALL_ERROR);
      state = entityReducer(state, action);
      const collection = state['Hero'];
      expect(collection.loading).toBe(false);
      expect(collection.loaded).toBe(false);
      expect(collection.ids.length).toBe(0);
    });

    it('QUERY_ALL_SUCCESS works for "Villain" entity with non-id primary key', () => {
      let state = entityReducer({}, queryAction);
      const villains: Villain[] = [
        { key: '2', name: 'B' },
        { key: '1', name: 'A' },
      ];
      const action = createAction(
        'Villain',
        EntityOp.QUERY_ALL_SUCCESS,
        villains
      );
      state = entityReducer(state, action);
      const collection = state['Villain'];
      expect(collection.ids).toEqual(['2', '1']);
      expect(collection.entities['1']).toBe(villains[1]);
      expect(collection.entities['2']).toBe(villains[0]);
      expect(collection.loaded).toBe(true);
      expect(collection.loading).toBe(false);
    });

    it('QUERY_ALL_SUCCESS can add to existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const heroes: Hero[] = [{ id: 3, name: 'C' }];
      const action = createAction('Hero', EntityOp.QUERY_ALL_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 3]);
    });

    it('QUERY_ALL_SUCCESS can update existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const heroes: Hero[] = [{ id: 1, name: 'A+' }];
      const action = createAction('Hero', EntityOp.QUERY_ALL_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities['1'].name).toBe('A+');
    });

    it('QUERY_ALL_SUCCESS can add and update existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const heroes: Hero[] = [
        { id: 3, name: 'C' },
        { id: 1, name: 'A+' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_ALL_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 3]);
      expect(collection.entities['1'].name).toBe('A+');
    });

    it('QUERY_ALL_SUCCESS overwrites changeState.originalValue for updated entity', () => {
      const {
        entityCache,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      const queriedUpdate = { ...updatedEntity, name: 'Queried update' };

      // a new entity and yet another version of the entity that is currently updated but not saved.
      const queryResults: Hero[] = [{ id: 100, name: 'X' }, queriedUpdate];
      const action = createAction(
        'Hero',
        EntityOp.QUERY_ALL_SUCCESS,
        queryResults
      );
      const collection = entityReducer(entityCache, action)['Hero'];
      const originalValue = collection.changeState[updatedEntity.id]!
        .originalValue;

      expect(collection.entities[updatedEntity.id]).toEqual(updatedEntity);
      expect(originalValue).toBeDefined();
      expect(originalValue).not.toEqual(preUpdatedEntity);
      expect(originalValue).not.toEqual(updatedEntity);
      expect(originalValue).toEqual(queriedUpdate);
    });

    it('QUERY_ALL_SUCCESS works when the query results are empty', () => {
      let state = entityReducer(initialCache, queryAction);
      const action = createAction('Hero', EntityOp.QUERY_ALL_SUCCESS, []);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.entities).toBe(initialCache['Hero'].entities);
      expect(collection.ids).toBe(initialCache['Hero'].ids);
      expect(collection.ids).toEqual([2, 1]);
      expect(collection).not.toBe(initialCache['Hero']);
    });
  });

  describe('QUERY_BY_KEY', () => {
    const queryAction = createAction('Hero', EntityOp.QUERY_BY_KEY);

    it('QUERY_BY_KEY sets loading flag but does not touch the collection', () => {
      const state = entityReducer({}, queryAction);
      const collection = state['Hero'];
      expect(collection.ids.length).toBe(0);
      expect(collection.loaded).toBe(false);
      expect(collection.loading).toBe(true);
    });

    it('QUERY_BY_KEY_SUCCESS can create the initial collection', () => {
      let state = entityReducer({}, queryAction);
      const hero: Hero = { id: 3, name: 'C' };
      const action = createAction('Hero', EntityOp.QUERY_BY_KEY_SUCCESS, hero);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([3]);
      expect(collection.loaded).toBe(false);
      expect(collection.loading).toBe(false);
    });

    it('QUERY_BY_KEY_SUCCESS can add to existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const hero: Hero = { id: 3, name: 'C' };
      const action = createAction('Hero', EntityOp.QUERY_BY_KEY_SUCCESS, hero);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 3]);
    });

    it('QUERY_BY_KEY_SUCCESS can update existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const hero: Hero = { id: 1, name: 'A+' };
      const action = createAction('Hero', EntityOp.QUERY_BY_KEY_SUCCESS, hero);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities['1'].name).toBe('A+');
    });

    it('QUERY_BY_KEY_SUCCESS updates the originalValue of a pending update', () => {
      const {
        entityCache,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      const queriedUpdate = { ...updatedEntity, name: 'Queried update' };
      const action = createAction(
        'Hero',
        EntityOp.QUERY_BY_KEY_SUCCESS,
        queriedUpdate
      );
      const collection = entityReducer(entityCache, action)['Hero'];
      const originalValue = collection.changeState[updatedEntity.id]!
        .originalValue;

      expect(collection.entities[updatedEntity.id]).toEqual(updatedEntity);
      expect(originalValue).toBeDefined();
      expect(originalValue).not.toEqual(preUpdatedEntity);
      expect(originalValue).not.toEqual(updatedEntity);
      expect(originalValue).toEqual(queriedUpdate);
    });

    // Normally would 404 but maybe this API just returns an empty result.
    it('QUERY_BY_KEY_SUCCESS works when the query results are empty', () => {
      let state = entityReducer(initialCache, queryAction);
      const action = createAction(
        'Hero',
        EntityOp.QUERY_BY_KEY_SUCCESS,
        undefined
      );
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.entities).toBe(initialCache['Hero'].entities);
      expect(collection.ids).toBe(initialCache['Hero'].ids);
      expect(collection.ids).toEqual([2, 1]);
    });
  });

  describe('QUERY_MANY', () => {
    const queryAction = createAction('Hero', EntityOp.QUERY_MANY);

    it('QUERY_MANY sets loading flag but does not touch the collection', () => {
      const state = entityReducer({}, queryAction);
      const collection = state['Hero'];
      expect(collection.loaded).toBe(false);
      expect(collection.loading).toBe(true);
      expect(collection.ids.length).toBe(0);
    });

    it('QUERY_MANY_SUCCESS can create the initial collection', () => {
      let state = entityReducer({}, queryAction);
      const heroes: Hero[] = [{ id: 3, name: 'C' }];
      const action = createAction('Hero', EntityOp.QUERY_MANY_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([3]);
      expect(collection.loaded).toBe(true);
      expect(collection.loading).toBe(false);
    });

    it('QUERY_MANY_SUCCESS can add to existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const heroes: Hero[] = [{ id: 3, name: 'C' }];
      const action = createAction('Hero', EntityOp.QUERY_MANY_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 3]);
    });

    it('QUERY_MANY_SUCCESS can update existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const heroes: Hero[] = [{ id: 1, name: 'A+' }];
      const action = createAction('Hero', EntityOp.QUERY_MANY_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities['1'].name).toBe('A+');
    });

    it('QUERY_MANY_SUCCESS can add and update existing collection', () => {
      let state = entityReducer(initialCache, queryAction);
      const heroes: Hero[] = [
        { id: 3, name: 'C' },
        { id: 1, name: 'A+' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_MANY_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 3]);
      expect(collection.entities['1'].name).toBe('A+');
    });

    it('QUERY_MANY_SUCCESS overwrites changeState.originalValue for updated entity', () => {
      const {
        entityCache,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      const queriedUpdate = { ...updatedEntity, name: 'Queried update' };

      // a new entity and yet another version of the entity that is currently updated but not saved.
      const queryResults: Hero[] = [{ id: 100, name: 'X' }, queriedUpdate];
      const action = createAction(
        'Hero',
        EntityOp.QUERY_MANY_SUCCESS,
        queryResults
      );
      const collection = entityReducer(entityCache, action)['Hero'];
      const originalValue = collection.changeState[updatedEntity.id]!
        .originalValue;

      expect(collection.entities[updatedEntity.id]).toEqual(updatedEntity);
      expect(originalValue).toBeDefined();
      expect(originalValue).not.toEqual(preUpdatedEntity);
      expect(originalValue).not.toEqual(updatedEntity);
      expect(originalValue).toEqual(queriedUpdate);
    });

    it('QUERY_MANY_SUCCESS works when the query results are empty', () => {
      let state = entityReducer(initialCache, queryAction);
      const action = createAction('Hero', EntityOp.QUERY_MANY_SUCCESS, []);
      state = entityReducer(state, action);
      const collection = state['Hero'];

      expect(collection.entities).toBe(initialCache['Hero'].entities);
      expect(collection.ids).toBe(initialCache['Hero'].ids);
      expect(collection.ids).toEqual([2, 1]);
      expect(collection).not.toBe(initialCache['Hero']);
    });
  });

  describe('CANCEL_PERSIST', () => {
    it('should only clear the loading flag', () => {
      const { entityCache } = createTestTrackedEntities();
      let cache = entityReducer(
        entityCache,
        createAction('Hero', EntityOp.SET_LOADING, true)
      );
      expect(cache['Hero'].loading).toBe(true);
      cache = entityReducer(
        cache,
        createAction('Hero', EntityOp.CANCEL_PERSIST, undefined, {
          correlationId: 42,
        })
      );
      expect(cache['Hero'].loading).toBe(false);
      expect(cache).toEqual(entityCache);
    });
  });

  describe('QUERY_LOAD', () => {
    const queryAction = createAction('Hero', EntityOp.QUERY_LOAD);

    it('QUERY_LOAD sets loading flag but does not fill collection', () => {
      const state = entityReducer({}, queryAction);
      const collection = state['Hero'];
      expect(collection.ids.length).toBe(0);
      expect(collection.loaded).toBe(false);
      expect(collection.loading).toBe(true);
    });

    it('QUERY_LOAD_SUCCESS fills collection, clears loading flag, and sets loaded flag', () => {
      let state = entityReducer({}, queryAction);
      const heroes: Hero[] = [
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_LOAD_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];
      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities['1']).toBe(heroes[1]);
      expect(collection.entities['2']).toBe(heroes[0]);
      expect(collection.loaded).toBe(true);
      expect(collection.loading).toBe(false);
    });

    it('QUERY_LOAD_SUCCESS clears changeState', () => {
      const {
        entityCache,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      // Completely replaces existing Hero entities
      const heroes: Hero[] = [
        { id: 1000, name: 'X' },
        { ...updatedEntity, name: 'Queried update' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_LOAD_SUCCESS, heroes);
      const collection: EntityCollection<Hero> = entityReducer(
        entityCache,
        action
      )['Hero'];
      const { ids, changeState } = collection;
      expect(changeState).toEqual({} as ChangeStateMap<Hero>);
      expect(ids).toEqual([1000, updatedEntity.id]); // no sort so in load order
    });

    it('QUERY_LOAD_SUCCESS replaces collection contents with queried entities', () => {
      let state: EntityCache = {
        Hero: {
          entityName: 'Hero',
          ids: [42],
          entities: { 42: { id: 42, name: 'Fribit' } },
          filter: 'xxx',
          loaded: true,
          loading: false,
          changeState: {},
        },
      };
      state = entityReducer(state, queryAction);
      const heroes: Hero[] = [
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_LOAD_SUCCESS, heroes);
      state = entityReducer(state, action);
      const collection = state['Hero'];
      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities['1']).toBe(heroes[1]);
      expect(collection.entities['2']).toBe(heroes[0]);
    });

    it('QUERY_LOAD_ERROR clears loading flag and does not fill collection', () => {
      let state = entityReducer({}, queryAction);
      const action = createAction('Hero', EntityOp.QUERY_LOAD_ERROR);
      state = entityReducer(state, action);
      const collection = state['Hero'];
      expect(collection.loading).toBe(false);
      expect(collection.loaded).toBe(false);
      expect(collection.ids.length).toBe(0);
    });

    it('QUERY_LOAD_SUCCESS works for "Villain" entity with non-id primary key', () => {
      let state = entityReducer({}, queryAction);
      const villains: Villain[] = [
        { key: '2', name: 'B' },
        { key: '1', name: 'A' },
      ];
      const action = createAction(
        'Villain',
        EntityOp.QUERY_LOAD_SUCCESS,
        villains
      );
      state = entityReducer(state, action);
      const collection = state['Villain'];
      expect(collection.ids).toEqual(['2', '1']);
      expect(collection.entities['1']).toBe(villains[1]);
      expect(collection.entities['2']).toBe(villains[0]);
      expect(collection.loaded).toBe(true);
      expect(collection.loading).toBe(false);
    });
  });
  // #endregion queries

  // #region saves
  describe('SAVE_ADD_ONE (Optimistic)', () => {
    function createTestAction(hero: Hero) {
      return createAction('Hero', EntityOp.SAVE_ADD_ONE, hero, {
        isOptimistic: true,
      });
    }

    it('should add a new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero = { name: 'New One', power: 'Strong' };
      // bad add, no id.
      const action = createTestAction(<any>hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    it('should NOT update an existing entity in collection', () => {
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });
  });

  describe('SAVE_ADD_ONE (Pessimistic)', () => {
    it('should only set the loading flag', () => {
      const addedEntity = { id: 42, name: 'New Guy' };
      const action = createAction('Hero', EntityOp.SAVE_ADD_ONE, addedEntity);
      expectOnlySetLoadingFlag(action, initialCache);
    });
  });

  describe('SAVE_ADD_ONE_SUCCESS (Optimistic)', () => {
    function createTestAction(hero: Hero) {
      return createAction('Hero', EntityOp.SAVE_ADD_ONE_SUCCESS, hero, {
        isOptimistic: true,
      });
    }

    // server returned a hero with different id; not good
    it('should NOT add a new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });

    // The hero was already added to the collection by SAVE_ADD_ONE
    // You cannot change the key with SAVE_ADD_ONE_SUCCESS
    // You'd have to do it with SAVE_UPDATE_ONE...
    it('should NOT change the id of a newly added hero', () => {
      // pretend this hero was added by SAVE_ADD_ONE and returned by server with new ID
      const hero = initialHeroes[0];
      hero.id = 13;

      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero = { name: 'New One', power: 'Strong' };
      // bad add, no id.
      const action = createTestAction(<any>hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    // because the hero was already added to the collection by SAVE_ADD_ONE
    // should update values (but not id) if the server changed them
    // as it might with a concurrency property.
    it('should update an existing entity with that ID in collection', () => {
      // This example simulates the server updating the name and power
      const hero: Hero = { id: 2, name: 'Updated Name', power: 'Test Power' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('Updated Name');
      // unmentioned property updated too
      expect(collection.entities[2].power).toBe('Test Power');
    });
  });

  describe('SAVE_ADD_ONE_SUCCESS (Pessimistic)', () => {
    function createTestAction(hero: Hero) {
      return createAction('Hero', EntityOp.SAVE_ADD_ONE_SUCCESS, hero);
    }

    it('should add a new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(hero);
      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.ids).toEqual([2, 1, 13]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero = { name: 'New One', power: 'Strong' };
      // bad add, no id.
      const action = createTestAction(<any>hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    it('should update an existing entity in collection', () => {
      // ... because reducer calls mergeServerUpserts()
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(hero);
      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });
  });

  describe('SAVE_ADD_ONE_ERROR', () => {
    it('should only clear the loading flag', () => {
      const { entityCache, addedEntity } = createTestTrackedEntities();
      const originalAction = createAction(
        'Hero',
        EntityOp.SAVE_ADD_ONE,
        addedEntity
      );
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'POST',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction('Hero', EntityOp.SAVE_ADD_MANY_ERROR, error);
      expectOnlySetLoadingFlag(action, entityCache);
    });
  });

  describe('SAVE_ADD_MANY (Optimistic)', () => {
    function createTestAction(heroes: Hero[]) {
      return createAction('Hero', EntityOp.SAVE_ADD_MANY, heroes, {
        isOptimistic: true,
      });
    }

    it('should add new heroes to collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
    });

    it('should error if one of new heroes lacks its pkey', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: undefined as any, name: 'New B', power: 'Swift' }, // missing its id
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /does not have a valid entity key/
      );
    });

    it('should NOT update an existing entity in collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 2, name: 'B+' },
        { id: 14, name: 'New B', power: 'Swift' }, // missing its id
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
      expect(collection.entities[2].name).toBe('B');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });
  });

  describe('SAVE_ADD_MANY (Pessimistic)', () => {
    it('should only set the loading flag', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createAction('Hero', EntityOp.SAVE_ADD_MANY, heroes);
      expectOnlySetLoadingFlag(action, initialCache);
    });
  });

  describe('SAVE_ADD_MANY_SUCCESS (Optimistic)', () => {
    function createTestAction(heroes: Hero[]) {
      return createAction('Hero', EntityOp.SAVE_ADD_MANY_SUCCESS, heroes, {
        isOptimistic: true,
      });
    }

    // Server returned heroes with ids that are new and were not sent to the server.
    // This could be correct or it could be bad (e.g. server changed the id of a new entity)
    // Regardless, SAVE_ADD_MANY_SUCCESS (optimistic) will add them because it upserts.
    it('should add heroes that were not previously in the collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
    });

    it('should error if new hero lacks its pkey', () => {
      const heroes: Hero[] = [
        { id: undefined as any, name: 'New A', power: 'Strong' }, // missing its id
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /does not have a valid entity key/
      );
    });

    // because the hero was already added to the collection by SAVE_ADD_MANY
    // should update values (but not id) if the server changed them
    // as it might with a concurrency property.
    it('should update an existing entity with that ID in collection', () => {
      // This example simulates the server updating the name and power
      const heroes: Hero[] = [
        { id: 1, name: 'Updated name A', power: 'Test Power A' },
        { id: 2, name: 'Updated name B', power: 'Test Power B' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[1].name).toBe('Updated name A');
      expect(collection.entities[2].name).toBe('Updated name B');
      // unmentioned property updated too
      expect(collection.entities[1].power).toBe('Test Power A');
      expect(collection.entities[2].power).toBe('Test Power B');
    });
  });

  describe('SAVE_ADD_MANY_SUCCESS (Pessimistic)', () => {
    function createTestAction(heroes: Hero[]) {
      return createAction('Hero', EntityOp.SAVE_ADD_MANY_SUCCESS, heroes, {
        isOptimistic: false,
      });
    }

    it('should add new heroes to collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.ids).toEqual([2, 1, 13, 14]);
    });

    it('should error if new hero lacks its pkey', () => {
      const heroes: Hero[] = [
        { id: undefined as any, name: 'New A', power: 'Strong' }, // missing id
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload!.error!.message).toMatch(
        /does not have a valid entity key/
      );
    });

    it('should update an existing entity in collection', () => {
      // This example simulates the server updating the name and power
      const heroes: Hero[] = [
        { id: 1, name: 'Updated name A' },
        { id: 2, name: 'Updated name B' },
      ];
      const action = createTestAction(heroes);
      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[1].name).toBe('Updated name A');
      expect(collection.entities[2].name).toBe('Updated name B');
      // unmentioned property stays the same
      expect(collection.entities[1].power).toBe(initialHeroes[1].power);
      expect(collection.entities[2].power).toBe(initialHeroes[0].power);
    });
  });

  describe('SAVE_ADD_MANY_ERROR', () => {
    it('should only clear the loading flag', () => {
      const { entityCache, addedEntity } = createTestTrackedEntities();
      const originalAction = createAction('Hero', EntityOp.SAVE_ADD_MANY, [
        addedEntity,
      ]);
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'POST',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction('Hero', EntityOp.SAVE_ADD_MANY_ERROR, error);
      expectOnlySetLoadingFlag(action, entityCache);
    });
  });

  describe('SAVE_DELETE_ONE (Optimistic)', () => {
    it('should immediately remove the existing hero', () => {
      const hero = initialHeroes[0];
      expect(initialCache['Hero'].entities[hero.id]).toBe(hero);

      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, hero, {
        isOptimistic: true,
      });

      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.entities[hero.id]).toBeUndefined();
      expect(collection.loading).toBe(true);
    });

    it('should immediately remove the hero by id ', () => {
      const hero = initialHeroes[0];
      expect(initialCache['Hero'].entities[hero.id]).toBe(hero);

      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, hero.id, {
        isOptimistic: true,
      });

      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.entities[hero.id]).toBeUndefined();
      expect(collection.loading).toBe(true);
    });

    it('should immediately remove an unsaved added hero', () => {
      const { entityCache, addedEntity } = createTestTrackedEntities();
      const id = addedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, id, {
        isOptimistic: true,
      });
      const { entities, changeState } = entityReducer(entityCache, action)[
        'Hero'
      ];
      expect(entities[id]).toBeUndefined();
      expect(changeState[id]).toBeUndefined();
      expect(action.payload.skip).toBe(true);
    });

    it('should reclassify change of an unsaved updated hero to "deleted"', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const id = updatedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, id, {
        isOptimistic: true,
      });
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.entities[id]).toBeUndefined();
      const entityChangeState = collection.changeState[id];
      expect(entityChangeState).toBeDefined();
      expect(entityChangeState!.changeType).toBe(ChangeType.Deleted);
    });

    it('should be ok when the id is not in the collection', () => {
      expect(initialCache['Hero'].entities[1000]).toBeUndefined();

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE,
        1000, // id of entity that is not in the collection
        { isOptimistic: true }
      );

      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.entities[1000]).toBeUndefined();
      expect(collection.loading).toBe(true);
    });
  });

  describe('SAVE_DELETE_ONE (Pessimistic)', () => {
    it('should NOT remove the existing hero', () => {
      const hero = initialHeroes[0];
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, hero);

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];
      expect(collection.entities[hero.id]).toBe(hero);
      expect(collection.loading).toBe(true);
    });

    it('should immediately remove an unsaved added hero', () => {
      const { entityCache, addedEntity } = createTestTrackedEntities();
      const id = addedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, id);
      const { entities, changeState } = entityReducer(entityCache, action)[
        'Hero'
      ];
      expect(entities[id]).toBeUndefined();
      expect(changeState[id]).toBeUndefined();
      expect(action.payload.skip).toBe(true);
    });

    it('should reclassify change of an unsaved updated hero to "deleted"', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const id = updatedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, id);
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.entities[id]).toBeDefined();
      const entityChangeState = collection.changeState[id];
      expect(entityChangeState).toBeDefined();
      expect(entityChangeState!.changeType).toBe(ChangeType.Deleted);
    });
  });

  describe('SAVE_DELETE_ONE_SUCCESS (Optimistic)', () => {
    it('should turn loading flag off and clear change tracking for existing entity', () => {
      const { entityCache, removedEntity } = createTestTrackedEntities();

      // the action that would have saved the delete
      const saveAction = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE,
        removedEntity.id,
        { isOptimistic: true }
      );

      const {
        entities: initialEntities,
        changeState: initialChangeState,
      } = entityCache['Hero'];
      expect(initialChangeState[removedEntity.id]).toBeDefined();

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE_SUCCESS,
        removedEntity.id, // Pretend optimistically deleted this hero
        { isOptimistic: true }
      );

      const collection = entityReducer(entityCache, action)['Hero'];
      expect(collection.entities).toBe(initialEntities);
      expect(collection.loading).toBe(false);
      expect(collection.changeState[removedEntity.id]).toBeUndefined();
    });

    it('should be ok when the id is not in the collection', () => {
      expect(initialCache['Hero'].entities[1000]).toBeUndefined();

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE_SUCCESS,
        1000, // id of entity that is not in the collection
        { isOptimistic: true }
      );

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.entities[1000]).toBeUndefined();
      expect(collection.loading).toBe(false);
    });
  });

  describe('SAVE_DELETE_ONE_SUCCESS (Pessimistic)', () => {
    it('should remove the hero by id', () => {
      const hero = initialHeroes[0];
      expect(initialCache['Hero'].entities[hero.id]).toBe(hero);

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE_SUCCESS,
        hero.id
      );

      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.entities[hero.id]).toBeUndefined();
      expect(collection.loading).toBe(false);
    });

    it('should be ok when the id is not in the collection', () => {
      expect(initialCache['Hero'].entities[1000]).toBeUndefined();

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE_SUCCESS,
        1000
      );

      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.entities[1000]).toBeUndefined();
      expect(collection.loading).toBe(false);
    });
  });

  describe('SAVE_DELETE_ONE_ERROR', () => {
    it('should only clear the loading flag', () => {
      const { entityCache, removedEntity } = createTestTrackedEntities();
      const originalAction = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE,
        removedEntity.id
      );
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'DELETE',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE_ERROR,
        error
      );
      expectOnlySetLoadingFlag(action, entityCache);
    });

    // No compensating action on error (yet)
    it('should NOT restore the hero after optimistic save', () => {
      const initialEntities = initialCache['Hero'].entities;
      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_ONE_ERROR,
        { id: 13, name: 'Deleted' }, // Pretend optimistically deleted this hero
        { isOptimistic: true }
      );

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];
      expect(collection.entities).toBe(initialEntities);
      expect(collection.loading).toBe(false);
    });

    it('should NOT remove the hero', () => {
      const hero = initialHeroes[0];
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE_ERROR, hero);

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];
      expect(collection.entities[hero.id]).toBe(hero);
      expect(collection.loading).toBe(false);
    });
  });

  describe('SAVE_DELETE_MANY (Optimistic)', () => {
    it('should immediately remove the heroes by id ', () => {
      const ids = initialHeroes.map((h) => h.id);
      expect(initialCache['Hero'].entities[ids[0]]).toBe(initialHeroes[0]);
      expect(initialCache['Hero'].entities[ids[1]]).toBe(initialHeroes[1]);

      const action = createAction('Hero', EntityOp.SAVE_DELETE_MANY, ids, {
        isOptimistic: true,
      });

      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.entities[ids[0]]).toBeUndefined();
      expect(collection.entities[ids[1]]).toBeUndefined();
      expect(collection.loading).toBe(true);
    });

    it('should immediately remove an unsaved added hero', () => {
      const { entityCache, addedEntity } = createTestTrackedEntities();
      const id = addedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_MANY, [id], {
        isOptimistic: true,
      });
      const { entities, changeState } = entityReducer(entityCache, action)[
        'Hero'
      ];
      expect(entities[id]).toBeUndefined();
      expect(changeState[id]).toBeUndefined();
    });

    it('should reclassify change of an unsaved updated hero to "deleted"', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const id = updatedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_MANY, [id], {
        isOptimistic: true,
      });
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.entities[id]).toBeUndefined();
      const entityChangeState = collection.changeState[id];
      expect(entityChangeState).toBeDefined();
      expect(entityChangeState!.changeType).toBe(ChangeType.Deleted);
    });

    it('should be ok when the id is not in the collection', () => {
      expect(initialCache['Hero'].entities[1000]).toBeUndefined();

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY,
        [1000], // id of entity that is not in the collection
        { isOptimistic: true }
      );

      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.entities[1000]).toBeUndefined();
      expect(collection.loading).toBe(true);
    });
  });

  describe('SAVE_DELETE_MANY (Pessimistic)', () => {
    it('should NOT remove the existing hero', () => {
      const hero = initialHeroes[0];
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, hero);

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];
      expect(collection.entities[hero.id]).toBe(hero);
      expect(collection.loading).toBe(true);
    });

    it('should immediately remove an unsaved added hero', () => {
      const { entityCache, addedEntity } = createTestTrackedEntities();
      const id = addedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, id);
      const { entities, changeState } = entityReducer(entityCache, action)[
        'Hero'
      ];
      expect(entities[id]).toBeUndefined();
      expect(changeState[id]).toBeUndefined();
      expect(action.payload.skip).toBe(true);
    });

    it('should reclassify change of an unsaved updated hero to "deleted"', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const id = updatedEntity.id;
      const action = createAction('Hero', EntityOp.SAVE_DELETE_ONE, id);
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.entities[id]).toBeDefined();
      const entityChangeState = collection.changeState[id];
      expect(entityChangeState).toBeDefined();
      expect(entityChangeState!.changeType).toBe(ChangeType.Deleted);
    });
  });

  describe('SAVE_DELETE_MANY_SUCCESS (Optimistic)', () => {
    it('should turn loading flag off and clear change tracking for existing entities', () => {
      const {
        entityCache,
        removedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      const ids = [removedEntity.id, updatedEntity.id];

      let action = createAction('Hero', EntityOp.SAVE_DELETE_MANY, ids, {
        isOptimistic: true,
      });

      let collection = entityReducer(entityCache, action)['Hero'];
      let changeState = collection.changeState;
      expect(collection.loading).toBe(true);
      expect(changeState[ids[0]]).toBeDefined();
      expect(changeState[ids[1]]).toBeDefined();

      action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY_SUCCESS,
        ids, // After optimistically deleted this hero
        { isOptimistic: true }
      );

      collection = entityReducer(entityCache, action)['Hero'];
      changeState = collection.changeState;
      expect(collection.loading).toBe(false);
      expect(changeState[ids[0]]).toBeUndefined();
      expect(changeState[ids[1]]).toBeUndefined();
    });

    it('should be ok when the id is not in the collection', () => {
      expect(initialCache['Hero'].entities[1000]).toBeUndefined();

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY_SUCCESS,
        [1000], // id of entity that is not in the collection
        { isOptimistic: true }
      );

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.entities[1000]).toBeUndefined();
      expect(collection.loading).toBe(false);
    });
  });

  describe('SAVE_DELETE_MANY_SUCCESS (Pessimistic)', () => {
    it('should remove heroes by id', () => {
      const heroes = initialHeroes;
      const ids = heroes.map((h) => h.id);

      expect(initialCache['Hero'].entities[ids[0]]).toBe(heroes[0]);
      expect(initialCache['Hero'].entities[ids[1]]).toBe(heroes[1]);

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY_SUCCESS,
        ids,
        { isOptimistic: false }
      );

      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.entities[ids[0]]).toBeUndefined();
      expect(collection.entities[ids[1]]).toBeUndefined();
      expect(collection.loading).toBe(false);
    });

    it('should be ok when an id is not in the collection', () => {
      const ids = [initialHeroes[0].id, 1000];
      expect(initialCache['Hero'].entities[1000]).toBeUndefined();

      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY_SUCCESS,
        ids,
        { isOptimistic: false }
      );

      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.entities[ids[0]]).toBeUndefined();
      expect(collection.entities[1000]).toBeUndefined();
      expect(collection.loading).toBe(false);
    });
  });

  describe('SAVE_DELETE_MANY_ERROR', () => {
    it('should only clear the loading flag', () => {
      const { entityCache, removedEntity } = createTestTrackedEntities();
      const originalAction = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY,
        removedEntity.id
      );
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'DELETE',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY_ERROR,
        error
      );
      expectOnlySetLoadingFlag(action, entityCache);
    });

    // No compensating action on error (yet)
    it('should NOT restore the hero after optimistic save', () => {
      const initialEntities = initialCache['Hero'].entities;
      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY_ERROR,
        { id: 13, name: 'Deleted' }, // Pretend optimistically deleted this hero
        { isOptimistic: true }
      );

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];
      expect(collection.entities).toBe(initialEntities);
      expect(collection.loading).toBe(false);
    });

    it('should NOT remove the hero', () => {
      const hero = initialHeroes[0];
      const action = createAction(
        'Hero',
        EntityOp.SAVE_DELETE_MANY_ERROR,
        hero
      );

      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];
      expect(collection.entities[hero.id]).toBe(hero);
      expect(collection.loading).toBe(false);
    });
  });

  describe('SAVE_UPDATE_ONE (Optimistic)', () => {
    function createTestAction(hero: Update<Hero>) {
      return createAction('Hero', EntityOp.SAVE_UPDATE_ONE, hero, {
        isOptimistic: true,
      });
    }

    it('should update existing entity in collection', () => {
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(toHeroUpdate(hero));
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('can update existing entity key in collection', () => {
      // Change the pkey (id) and the name of former hero:2
      const hero: Hero = { id: 42, name: 'Super' };
      const update = { id: 2, changes: hero };
      const action = createTestAction(update);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([42, 1]);
      expect(collection.entities[42].name).toBe('Super');
      // unmentioned property stays the same
      expect(collection.entities[42].power).toBe('Fast');
    });

    // Changed in v6. It used to add a new entity.
    it('should NOT add new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(toHeroUpdate(hero));
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });
  });

  describe('SAVE_UPDATE_ONE (Pessimistic)', () => {
    it('should only set the loading flag', () => {
      const updatedEntity = { ...initialHeroes[0], name: 'Updated' };
      const update = { id: updatedEntity.id, changes: updatedEntity };
      const action = createAction('Hero', EntityOp.SAVE_UPDATE_ONE, update);
      expectOnlySetLoadingFlag(action, initialCache);
    });
  });

  describe('SAVE_UPDATE_ONE_SUCCESS (Optimistic)', () => {
    function createTestAction(update: Update<Hero>, changed: boolean) {
      return createAction(
        'Hero',
        EntityOp.SAVE_UPDATE_ONE_SUCCESS,
        { ...update, changed },
        { isOptimistic: true }
      );
    }

    it('should leave updated entity alone if server did not change the update (changed: false)', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const ids = entityCache['Hero'].ids;
      const id = updatedEntity.id;
      const action = createTestAction(toHeroUpdate(updatedEntity), false);
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.ids).toEqual(ids);
      expect(collection.entities[id].name).toBe(updatedEntity.name);
      expect(collection.entities[id].power).toBe(updatedEntity.power);
    });

    it('should update existing entity when server adds its own changes (changed: true)', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const ids = entityCache['Hero'].ids;
      const id = updatedEntity.id;
      // Server changed the name
      const serverEntity = { id: updatedEntity.id, name: 'Server Update Name' };
      const action = createTestAction(toHeroUpdate(serverEntity), true);
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.ids).toEqual(ids);
      expect(collection.entities[id].name).toBe(serverEntity.name);
      // unmentioned property stays the same
      expect(collection.entities[id].power).toBe(updatedEntity.power);
    });

    it('can update existing entity key', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const ids = entityCache['Hero'].ids as number[];
      const id = updatedEntity.id;
      // Server changed the pkey (id) and the name
      const serverEntity = { id: 13, name: 'Server Update Name' };
      const update = { id: updatedEntity.id, changes: serverEntity };
      const action = createTestAction(update, true);
      const collection = entityReducer(entityCache, action)['Hero'];

      // Should have replaced updatedEntity.id with 13
      const newIds = ids.map((i) => (i === id ? 13 : i));

      expect(collection.ids).toEqual(newIds);
      expect(collection.entities[13].name).toBe(serverEntity.name);
      // unmentioned property stays the same
      expect(collection.entities[13].power).toBe(updatedEntity.power);
    });

    // Changed in v6. It used to add a new entity.
    it('should NOT add new hero to collection', () => {
      const { entityCache } = createTestTrackedEntities();
      const ids = entityCache['Hero'].ids;
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(toHeroUpdate(hero), true);
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.ids).toEqual(ids);
    });
  });

  describe('SAVE_UPDATE_ONE_SUCCESS (Pessimistic)', () => {
    function createTestAction(update: Update<Hero>, changed: boolean) {
      return createAction('Hero', EntityOp.SAVE_UPDATE_ONE_SUCCESS, {
        ...update,
        changed,
      });
    }

    it('should update existing entity in collection', () => {
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(toHeroUpdate(hero), false);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('can update existing entity key in collection', () => {
      // Change the pkey (id) and the name of former hero:2
      const hero: Hero = { id: 42, name: 'Super' };
      const update = { id: 2, changes: hero };
      const action = createTestAction(update, true);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([42, 1]);
      expect(collection.entities[42].name).toBe('Super');
      // unmentioned property stays the same
      expect(collection.entities[42].power).toBe('Fast');
    });

    // Changed in v6. It used to add a new entity.
    it('should NOT add new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(toHeroUpdate(hero), false);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });
  });

  describe('SAVE_UPDATE_ONE_ERROR', () => {
    it('should only clear the loading flag', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const originalAction = createAction(
        'Hero',
        EntityOp.SAVE_UPDATE_ONE,
        updatedEntity
      );
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'PUT',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction(
        'Hero',
        EntityOp.SAVE_UPDATE_ONE_ERROR,
        error
      );
      expectOnlySetLoadingFlag(action, entityCache);
    });
  });

  describe('SAVE_UPDATE_MANY (Optimistic)', () => {
    function createTestAction(heroes: Update<Hero>[]) {
      return createAction('Hero', EntityOp.SAVE_UPDATE_MANY, heroes, {
        isOptimistic: true,
      });
    }

    it('should update existing entities in collection', () => {
      const heroes: Partial<Hero>[] = [
        { id: 2, name: 'B+' },
        { id: 1, power: 'Updated Power' },
      ];
      const action = createTestAction(heroes.map((h) => toHeroUpdate(h)));
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[1].name).toBe('A');
      expect(collection.entities[1].power).toBe('Updated Power');
      expect(collection.entities[2].name).toBe('B+');
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('can update existing entity key in collection', () => {
      // Change the pkey (id) and the name of former hero:2
      const hero: Hero = { id: 42, name: 'Super' };
      const update = { id: 2, changes: hero };
      const action = createTestAction([update]);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([42, 1]);
      expect(collection.entities[42].name).toBe('Super');
      // unmentioned property stays the same
      expect(collection.entities[42].power).toBe('Fast');
    });

    // Changed in v6. It used to add a new entity.
    it('should NOT add new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction([toHeroUpdate(hero)]);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });
  });

  describe('SAVE_UPDATE_MANY (Pessimistic)', () => {
    it('should only set the loading flag', () => {
      const updatedEntity = { ...initialHeroes[0], name: 'Updated' };
      const update = { id: updatedEntity.id, changes: updatedEntity };
      const action = createAction('Hero', EntityOp.SAVE_UPDATE_MANY, [update]);
      expectOnlySetLoadingFlag(action, initialCache);
    });
  });

  describe('SAVE_UPDATE_MANY_SUCCESS (Optimistic)', () => {
    function createInitialAction(updates: Update<Hero>[]) {
      return createAction('Hero', EntityOp.SAVE_UPDATE_MANY, updates, {
        isOptimistic: true,
      });
    }
    function createTestAction(updates: Update<Hero>[]) {
      return createAction('Hero', EntityOp.SAVE_UPDATE_MANY_SUCCESS, updates, {
        isOptimistic: true,
      });
    }

    it('should update existing entities when server adds its own changes', () => {
      const updates = initialHeroes.map((h) => {
        return { id: h.id, changes: { ...h, name: 'Updated ' + h.name } };
      });

      let action = createInitialAction(updates);
      let entityCache = entityReducer(initialCache, action);
      let collection = entityCache['Hero'];

      let name0 = updates[0].changes.name;
      expect(name0).toContain('Updated');

      const id0 = updates[0].id;
      name0 = 'Re-' + name0; // server's own change
      updates[0] = { id: id0, changes: { ...updates[0].changes, name: name0 } };
      action = createTestAction(updates);
      entityCache = entityReducer(entityCache, action);
      collection = entityCache['Hero'];

      expect(collection.entities[id0].name).toBe(name0);
    });

    it('can update existing entity key', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const ids = entityCache['Hero'].ids as number[];
      const id = updatedEntity.id;
      // Server changed the pkey (id) and the name
      const serverEntity = { id: 13, name: 'Server Update Name' };
      const update = { id: updatedEntity.id, changes: serverEntity };
      const action = createTestAction([update]);
      const collection = entityReducer(entityCache, action)['Hero'];

      // Should have replaced updatedEntity.id with 13
      const newIds = ids.map((i) => (i === id ? 13 : i));

      expect(collection.ids).toEqual(newIds);
      expect(collection.entities[13].name).toBe(serverEntity.name);
      // unmentioned property stays the same
      expect(collection.entities[13].power).toBe(updatedEntity.power);
    });

    // Changed in v6. It used to add a new entity.
    it('should NOT add new hero to collection', () => {
      const { entityCache } = createTestTrackedEntities();
      const ids = entityCache['Hero'].ids;
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction([toHeroUpdate(hero)]);
      const collection = entityReducer(entityCache, action)['Hero'];

      expect(collection.ids).toEqual(ids);
    });
  });

  describe('SAVE_UPDATE_MANY_SUCCESS (Pessimistic)', () => {
    function createTestAction(updates: Update<Hero>[]) {
      return createAction('Hero', EntityOp.SAVE_UPDATE_MANY_SUCCESS, updates, {
        isOptimistic: false,
      });
    }

    it('should update existing entities in collection', () => {
      const updates = initialHeroes.map((h) => {
        return { id: h.id, changes: { ...h, name: 'Updated ' + h.name } };
      });

      const action = createTestAction(updates);
      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[1].name).toContain('Updated');
      expect(collection.entities[2].name).toContain('Updated');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('can update existing entity key in collection', () => {
      // Change the pkey (id) and the name of former hero:2
      const hero: Hero = { id: 42, name: 'Super' };
      const update = { id: 2, changes: hero };
      const action = createTestAction([update]);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([42, 1]);
      expect(collection.entities[42].name).toBe('Super');
      // unmentioned property stays the same
      expect(collection.entities[42].power).toBe('Fast');
    });

    // Changed in v6. It used to add a new entity.
    it('should NOT add new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction([toHeroUpdate(hero)]);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });
  });

  describe('SAVE_UPDATE_MANY_ERROR', () => {
    it('should only clear the loading flag', () => {
      const { entityCache, updatedEntity } = createTestTrackedEntities();
      const originalAction = createAction('Hero', EntityOp.SAVE_UPDATE_MANY, [
        updatedEntity,
      ]);
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'PUT',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction(
        'Hero',
        EntityOp.SAVE_UPDATE_MANY_ERROR,
        error
      );
      expectOnlySetLoadingFlag(action, entityCache);
    });
  });

  describe('SAVE_UPSERT_ONE (Optimistic)', () => {
    function createTestAction(hero: Hero) {
      return createAction('Hero', EntityOp.SAVE_UPSERT_ONE, hero, {
        isOptimistic: true,
      });
    }

    it('should add a new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero = { name: 'New One', power: 'Strong' };
      // bad add, no id.
      const action = createTestAction(<any>hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    it('should update an existing entity in collection', () => {
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });
  });

  describe('SAVE_UPSERT_ONE (Pessimistic)', () => {
    it('should only set the loading flag', () => {
      const addedEntity = { id: 42, name: 'New Guy' };
      const action = createAction(
        'Hero',
        EntityOp.SAVE_UPSERT_ONE,
        addedEntity
      );
      expectOnlySetLoadingFlag(action, initialCache);
    });
  });

  describe('SAVE_UPSERT_ONE_SUCCESS (Optimistic)', () => {
    function createTestAction(hero: Hero) {
      return createAction('Hero', EntityOp.SAVE_UPSERT_ONE_SUCCESS, hero, {
        isOptimistic: true,
      });
    }

    it('should add a new hero to collection, even if it was not among the saved upserted entities', () => {
      // pretend this new hero was returned by the server instead of the one added by SAVE_UPSERT_ONE
      const hero: Hero = { id: 13, name: 'Different New One', power: 'Strong' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero = { name: 'New One', power: 'Strong' };
      // bad add, no id.
      const action = createTestAction(<any>hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    // because the hero was already upserted to the collection by SAVE_UPSERT_ONE
    // should update values (but not id) if the server changed them
    // as it might with a concurrency property.
    it('should update an existing entity with that ID in collection', () => {
      // This example simulates the server updating the name and power
      const hero: Hero = { id: 2, name: 'Updated Name', power: 'Test Power' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('Updated Name');
      // unmentioned property updated too
      expect(collection.entities[2].power).toBe('Test Power');
    });

    // You cannot change the key with SAVE_UPSERT_MANY_SUCCESS
    // You'd have to do it with SAVE_UPDATE_ONE...
    it('should NOT change the id of an existing entity hero (will add instead)', () => {
      const hero = initialHeroes[0];
      hero.id = 13;

      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
      expect(collection.entities[13].name).toEqual(collection.entities[2].name);
    });
  });

  describe('SAVE_UPSERT_ONE_SUCCESS (Pessimistic)', () => {
    function createTestAction(heroes: Hero) {
      return createAction('Hero', EntityOp.SAVE_UPSERT_ONE_SUCCESS, heroes, {
        isOptimistic: false,
      });
    }

    it('should add new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New A', power: 'Strong' };
      const action = createTestAction(hero);
      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.ids).toEqual([2, 1, 13]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero: Hero = {
        id: undefined as any,
        name: 'New A',
        power: 'Strong',
      }; // missing id
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    it('should update an existing entity in collection', () => {
      // This example simulates the server updating the name and power
      const hero: Hero = {
        id: 1,
        name: 'Updated name A',
        power: 'Updated power A',
      };
      const action = createTestAction(hero);
      const collection = entityReducer(initialCache, action)['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[1].name).toBe('Updated name A');
      expect(collection.entities[1].power).toBe('Updated power A');
    });
  });

  describe('SAVE_UPSERT_ONE_ERROR', () => {
    it('should only clear the loading flag', () => {
      const { entityCache, addedEntity } = createTestTrackedEntities();
      const originalAction = createAction(
        'Hero',
        EntityOp.SAVE_UPSERT_ONE,
        addedEntity
      );
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'POST',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction(
        'Hero',
        EntityOp.SAVE_UPSERT_ONE_ERROR,
        error
      );
      expectOnlySetLoadingFlag(action, entityCache);
    });
  });

  describe('SAVE_UPSERT_MANY (Optimistic)', () => {
    function createTestAction(heroes: Hero[]) {
      return createAction('Hero', EntityOp.SAVE_UPSERT_MANY, heroes, {
        isOptimistic: true,
      });
    }

    it('should add new heroes to collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
    });

    it('should error if one of new heroes lacks its pkey', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: undefined as any, name: 'New B', power: 'Swift' }, // missing its id
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /does not have a valid entity key/
      );
    });

    it('should update an existing entity in collection while adding new ones', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 2, name: 'B+' },
        { id: 14, name: 'New C', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });
  });

  describe('SAVE_UPSERT_MANY (Pessimistic)', () => {
    it('should only set the loading flag', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createAction('Hero', EntityOp.SAVE_UPSERT_MANY, heroes);
      expectOnlySetLoadingFlag(action, initialCache);
    });
  });

  describe('SAVE_UPSERT_MANY_SUCCESS (Optimistic)', () => {
    function createTestAction(heroes: Hero[]) {
      return createAction('Hero', EntityOp.SAVE_UPSERT_MANY_SUCCESS, heroes, {
        isOptimistic: true,
      });
    }

    // server returned additional heroes
    it('should add new heroes to collection, even if they were not among the saved upserted entities', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 2, name: 'Updated name' },
        { id: 14, name: 'New C', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
    });

    // You cannot change the key with SAVE_UPSERT_MANY_SUCCESS
    // You'd have to do it with SAVE_UPDATE_ONE...
    it('should NOT change the id of an existing entity hero (will add instead)', () => {
      const hero = initialHeroes[0];
      hero.id = 13;

      const action = createTestAction([hero]);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
      expect(collection.entities[13].name).toEqual(collection.entities[2].name);
    });

    it('should error if new hero lacks its pkey', () => {
      const heroes: Hero[] = [
        { id: undefined as any, name: 'New A', power: 'Strong' }, // missing its id
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /does not have a valid entity key/
      );
    });

    // because the hero was already added to the collection by SAVE_UPSERT_MANY
    // should update values (but not id) if the server changed them
    // as it might with a concurrency property.
    it('should update an existing entity with that ID in collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 2, name: 'Updated name', power: 'Updated power' },
        { id: 14, name: 'New C', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
      expect(collection.entities[2].name).toBe('Updated name');
      expect(collection.entities[2].power).toBe('Updated power');
    });
  });

  describe('SAVE_UPSERT_MANY_SUCCESS (Pessimistic)', () => {
    function createTestAction(heroes: Hero[]) {
      return createAction('Hero', EntityOp.SAVE_UPSERT_MANY_SUCCESS, heroes, {
        isOptimistic: false,
      });
    }

    it('should add new heroes to collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const collection = entityReducer(initialCache, action)['Hero'];
      expect(collection.ids).toEqual([2, 1, 13, 14]);
    });

    it('should error if new hero lacks its pkey', () => {
      const heroes: Hero[] = [
        { id: undefined as any, name: 'New A', power: 'Strong' }, // missing id
        { id: 14, name: 'New B', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /does not have a valid entity key/
      );
    });

    it('should update an existing entity in collection', () => {
      const heroes: Hero[] = [
        { id: 13, name: 'New A', power: 'Strong' },
        { id: 2, name: 'Updated name', power: 'Updated power' },
        { id: 14, name: 'New C', power: 'Swift' },
      ];
      const action = createTestAction(heroes);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13, 14]);
      expect(collection.entities[2].name).toBe('Updated name');
      expect(collection.entities[2].power).toBe('Updated power');
    });
  });

  describe('SAVE_UPSERT_MANY_ERROR', () => {
    it('should only clear the loading flag', () => {
      const {
        entityCache,
        addedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      const originalAction = createAction('Hero', EntityOp.SAVE_UPSERT_MANY, [
        addedEntity,
        updatedEntity,
      ]);
      const error: EntityActionDataServiceError = {
        error: new DataServiceError(new Error('Test Error'), {
          method: 'POST',
          url: 'foo',
        }),
        originalAction,
      };
      const action = createAction(
        'Hero',
        EntityOp.SAVE_UPSERT_MANY_ERROR,
        error
      );
      expectOnlySetLoadingFlag(action, entityCache);
    });
  });

  // #endregion saves

  // #region cache-only
  describe('ADD_ONE', () => {
    function createTestAction(hero: Hero) {
      return createAction('Hero', EntityOp.ADD_ONE, hero);
    }

    it('should add a new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero = { name: 'New One', power: 'Strong' };
      // bad add, no id.
      const action = createTestAction(<any>hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    it('should NOT update an existing entity in collection', () => {
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });
  });

  describe('UPDATE_MANY', () => {
    function createTestAction(heroes: Update<Hero>[]) {
      return createAction('Hero', EntityOp.UPDATE_MANY, heroes);
    }

    it('should not add new hero to collection', () => {
      const heroes: Hero[] = [{ id: 3, name: 'New One' }];
      const updates = heroes.map((h) => toHeroUpdate(h));
      const action = createTestAction(updates);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });

    it('should update existing entity in collection', () => {
      const heroes: Hero[] = [{ id: 2, name: 'B+' }];
      const updates = heroes.map((h) => toHeroUpdate(h));
      const action = createTestAction(updates);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('should update multiple existing entities in collection', () => {
      const heroes: Hero[] = [
        { id: 1, name: 'A+' },
        { id: 2, name: 'B+' },
        { id: 3, name: 'New One' },
      ];
      const updates = heroes.map((h) => toHeroUpdate(h));
      const action = createTestAction(updates);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      // Did not add the 'New One'
      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[1].name).toBe('A+');
      expect(collection.entities[2].name).toBe('B+');
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('can update existing entity key in collection', () => {
      // Change the pkey (id) and the name of former hero:2
      const heroes: Hero[] = [{ id: 42, name: 'Super' }];
      const updates = [{ id: 2, changes: heroes[0] }];
      const action = createTestAction(updates);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([42, 1]);
      expect(collection.entities[42].name).toBe('Super');
      // unmentioned property stays the same
      expect(collection.entities[42].power).toBe('Fast');
    });
  });

  describe('UPDATE_ONE', () => {
    function createTestAction(hero: Update<Hero>) {
      return createAction('Hero', EntityOp.UPDATE_ONE, hero);
    }

    it('should not add a new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(toHeroUpdate(hero));
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
    });

    it('should error if new hero lacks its pkey', () => {
      const hero = { name: 'New One', power: 'Strong' };
      // bad update: not an Update<T>
      const action = createTestAction(<any>hero);
      const state = entityReducer(initialCache, action);
      expect(state).toBe(initialCache);
      expect(action.payload.error!.message).toMatch(
        /missing or invalid entity key/
      );
    });

    it('should update existing entity in collection', () => {
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(toHeroUpdate(hero));
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('can update existing entity key in collection', () => {
      // Change the pkey (id) and the name of former hero:2
      const hero: Hero = { id: 42, name: 'Super' };
      const update = { id: 2, changes: hero };
      const action = createTestAction(update);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([42, 1]);
      expect(collection.entities[42].name).toBe('Super');
      // unmentioned property stays the same
      expect(collection.entities[42].power).toBe('Fast');
    });
  });

  describe('UPSERT_MANY', () => {
    function createTestAction(heroes: Hero[]) {
      return createAction('Hero', EntityOp.UPSERT_MANY, heroes);
    }

    it('should add new hero to collection', () => {
      const updates: Hero[] = [{ id: 13, name: 'New One', power: 'Strong' }];
      const action = createTestAction(updates);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
      expect(collection.entities[13].name).toBe('New One');
      expect(collection.entities[13].power).toBe('Strong');
    });

    it('should update existing entity in collection', () => {
      const updates: Hero[] = [{ id: 2, name: 'B+' }];
      const action = createTestAction(updates);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });

    it('should update multiple existing entities in collection', () => {
      const updates: Hero[] = [
        { id: 1, name: 'A+' },
        { id: 2, name: 'B+' },
        { id: 13, name: 'New One', power: 'Strong' },
      ];
      const action = createTestAction(updates);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      // Did not add the 'New One'
      expect(collection.ids).toEqual([2, 1, 13]);
      expect(collection.entities[1].name).toBe('A+');
      expect(collection.entities[2].name).toBe('B+');
      expect(collection.entities[2].power).toBe('Fast');
      expect(collection.entities[13].name).toBe('New One');
      expect(collection.entities[13].power).toBe('Strong');
    });
  });

  describe('UPSERT_ONE', () => {
    function createTestAction(hero: Hero) {
      return createAction('Hero', EntityOp.UPSERT_ONE, hero);
    }

    it('should add new hero to collection', () => {
      const hero: Hero = { id: 13, name: 'New One', power: 'Strong' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1, 13]);
      expect(collection.entities[13].name).toBe('New One');
      expect(collection.entities[13].power).toBe('Strong');
    });

    it('should update existing entity in collection', () => {
      const hero: Hero = { id: 2, name: 'B+' };
      const action = createTestAction(hero);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities[2].name).toBe('B+');
      // unmentioned property stays the same
      expect(collection.entities[2].power).toBe('Fast');
    });
  });

  describe('SET FLAGS', () => {
    it('should set filter value with SET_FILTER', () => {
      const action = createAction(
        'Hero',
        EntityOp.SET_FILTER,
        'test filter value'
      );
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.filter).toEqual('test filter value');
    });

    it('should set loaded flag with SET_LOADED', () => {
      const beforeLoaded = initialCache['Hero'].loaded;
      const expectedLoaded = !beforeLoaded;
      const action = createAction('Hero', EntityOp.SET_LOADED, expectedLoaded);
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.loaded).toEqual(expectedLoaded);
    });

    it('should set loading flag with SET_LOADING', () => {
      const beforeLoading = initialCache['Hero'].loading;
      const expectedLoading = !beforeLoading;
      const action = createAction(
        'Hero',
        EntityOp.SET_LOADING,
        expectedLoading
      );
      const state = entityReducer(initialCache, action);
      const collection = state['Hero'];

      expect(collection.loading).toEqual(expectedLoading);
    });
  });
  // #endregion cache-only

  /** TODO: TEST REMAINING ACTIONS **/

  /***
   * Todo: test all other reducer actions
   * Not a high priority because these other EntityReducer methods delegate to the
   * @ngrx/entity EntityAdapter reducer methods which are presumed to be well tested.
   ***/

  describe('reducer override', () => {
    const queryLoadAction = createAction('Hero', EntityOp.QUERY_LOAD);

    beforeEach(() => {
      const eds = new EntityDefinitionService([metadata]);
      const def = eds.getDefinition<Hero>('Hero');
      const reducer = createReadOnlyHeroReducer(def.entityAdapter);
      // override regular Hero reducer
      entityReducerRegistry.registerReducer('Hero', reducer);
    });

    // Make sure read-only reducer doesn't change QUERY_ALL behavior
    it('QUERY_LOAD_SUCCESS —clears loading flag and fills collection', () => {
      let state = entityReducer({}, queryLoadAction);
      let collection = state['Hero'];
      expect(collection.loaded).toBe(false);
      expect(collection.loading).toBe(true);

      const heroes: Hero[] = [
        { id: 2, name: 'B' },
        { id: 1, name: 'A' },
      ];
      const action = createAction('Hero', EntityOp.QUERY_LOAD_SUCCESS, heroes);
      state = entityReducer(state, action);
      collection = state['Hero'];
      expect(collection.ids).toEqual([2, 1]);
      expect(collection.entities['1']).toBe(heroes[1]);
      expect(collection.entities['2']).toBe(heroes[0]);
      expect(collection.loaded).toBe(true);
      expect(collection.loading).toBe(false);
    });

    it('QUERY_LOAD_ERROR clears loading flag and does not fill collection', () => {
      let state = entityReducer({}, queryLoadAction);
      const action = createAction('Hero', EntityOp.QUERY_LOAD_ERROR);
      state = entityReducer(state, action);
      const collection = state['Hero'];
      expect(collection.loading).toBe(false);
      expect(collection.ids.length).toBe(0);
    });

    it('QUERY_LOAD_SUCCESS works for "Villain" entity with non-id primary key', () => {
      let state = entityReducer({}, queryLoadAction);
      const villains: Villain[] = [
        { key: '2', name: 'B' },
        { key: '1', name: 'A' },
      ];
      const action = createAction(
        'Villain',
        EntityOp.QUERY_LOAD_SUCCESS,
        villains
      );
      state = entityReducer(state, action);
      const collection = state['Villain'];
      expect(collection.loading).toBe(false);
      expect(collection.ids).toEqual(['2', '1']);
      expect(collection.entities['1']).toBe(villains[1]);
      expect(collection.entities['2']).toBe(villains[0]);
    });

    it('QUERY_MANY is illegal for "Hero" collection', () => {
      const initialState = entityReducer({}, queryLoadAction);

      const action = createAction('Hero', EntityOp.QUERY_MANY);
      const state = entityReducer(initialState, action);

      // Expect override reducer to throw error and for
      // EntityReducer to catch it and set the `EntityAction.payload.error`
      expect(action.payload.error!.message).toMatch(
        /illegal operation for the "Hero" collection/
      );
      expect(state).toBe(initialState);
    });

    it('QUERY_MANY still works for "Villain" collection', () => {
      const action = createAction('Villain', EntityOp.QUERY_MANY);
      const state = entityReducer({}, action);
      const collection = state['Villain'];
      expect(collection.loading).toBe(true);
    });

    /** Make Hero collection readonly except for QUERY_LOAD  */
    function createReadOnlyHeroReducer(adapter: EntityAdapter<Hero>) {
      return function heroReducer(
        collection: EntityCollection<Hero>,
        action: EntityAction
      ): EntityCollection<Hero> {
        switch (action.payload.entityOp) {
          case EntityOp.QUERY_LOAD:
            return collection.loading
              ? collection
              : { ...collection, loading: true };

          case EntityOp.QUERY_LOAD_SUCCESS:
            return {
              ...adapter.setAll(action.payload.data, collection),
              loaded: true,
              loading: false,
              changeState: {},
            };

          case EntityOp.QUERY_LOAD_ERROR: {
            return collection.loading
              ? { ...collection, loading: false }
              : collection;
          }

          default:
            throw new Error(
              `${action.payload.entityOp} is an illegal operation for the "Hero" collection`
            );
        }
      };
    }
  });

  // #region helpers
  function createCollection<T = any>(
    entityName: string,
    data: T[],
    selectId: IdSelector<any>
  ) {
    return {
      ...collectionCreator.create<T>(entityName),
      ids: data.map((e) => selectId(e)) as string[] | number[],
      entities: data.reduce((acc, e) => {
        acc[selectId(e)] = e;
        return acc;
      }, {} as any),
    } as EntityCollection<T>;
  }

  function createInitialCache(entityMap: { [entityName: string]: any[] }) {
    const cache: EntityCache = {};
    // eslint-disable-next-line guard-for-in
    for (const entityName in entityMap) {
      const selectId =
        metadata[entityName].selectId || ((entity: any) => entity.id);
      cache[entityName] = createCollection(
        entityName,
        entityMap[entityName],
        selectId
      );
    }

    return cache;
  }

  /**
   * Prepare the state of the collection with some test data.
   * Assumes that ADD_ALL, ADD_ONE, REMOVE_ONE, and UPDATE_ONE are working
   */
  function createTestTrackedEntities() {
    const startingHeroes = [
      { id: 2, name: 'B', power: 'Fast' },
      { id: 1, name: 'A', power: 'Invisible' },
      { id: 3, name: 'C', power: 'Strong' },
    ];

    const [removedEntity, preUpdatedEntity] = startingHeroes;
    let action = createAction('Hero', EntityOp.ADD_ALL, startingHeroes);
    let entityCache = entityReducer({}, action);

    const addedEntity = { id: 42, name: 'E', power: 'Smart' };
    action = createAction('Hero', EntityOp.ADD_ONE, addedEntity);
    entityCache = entityReducer(entityCache, action);

    action = createAction('Hero', EntityOp.REMOVE_ONE, removedEntity.id);
    entityCache = entityReducer(entityCache, action);

    const updatedEntity = { ...preUpdatedEntity, name: 'A Updated' };
    action = createAction('Hero', EntityOp.UPDATE_ONE, {
      id: updatedEntity.id,
      changes: updatedEntity,
    });
    entityCache = entityReducer(entityCache, action);

    return {
      entityCache,
      addedEntity,
      removedEntity,
      preUpdatedEntity,
      startingHeroes,
      updatedEntity,
    };
  }

  /** Test for ChangeState with expected ChangeType */
  function expectChangeType(
    change: ChangeState<any>,
    expectedChangeType: ChangeType,
    msg?: string
  ) {
    expect(ChangeType[change.changeType]).toEqual(
      ChangeType[expectedChangeType]
    );
  }

  /** Test that loading flag changed in expected way and the rest of the collection stayed the same. */
  function expectOnlySetLoadingFlag(
    action: EntityAction,
    entityCache: EntityCache
  ) {
    // Flag should be true when op starts, false after error or success
    const expectedLoadingFlag = !/error|success/i.test(action.payload.entityOp);
    const initialCollection = entityCache['Hero'];
    const newCollection = entityReducer(entityCache, action)['Hero'];
    expect(newCollection.loading).toBe(expectedLoadingFlag);
    expect({
      ...newCollection,
      loading: initialCollection.loading, // revert flag for test
    }).toEqual(initialCollection);
  }
  // #endregion helpers
});
