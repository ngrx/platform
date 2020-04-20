import { TestBed } from '@angular/core/testing';
import { Action, ActionReducer } from '@ngrx/store';
import { IdSelector } from '@ngrx/entity';

import {
  EntityMetadataMap,
  EntityCollectionCreator,
  EntityActionFactory,
  EntityCache,
  EntityCacheReducerFactory,
  EntityCollectionReducerMethodsFactory,
  EntityCollectionReducerFactory,
  EntityCollectionReducerRegistry,
  EntityDefinitionService,
  ENTITY_METADATA_TOKEN,
  EntityOp,
  ClearCollections,
  EntityCacheQuerySet,
  LoadCollections,
  MergeQuerySet,
  SetEntityCache,
  SaveEntities,
  SaveEntitiesCancel,
  SaveEntitiesSuccess,
  DataServiceError,
  SaveEntitiesError,
  EntityCollection,
  ChangeSet,
  ChangeSetOperation,
  Logger,
} from '../..';

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
  Fool: {},
  Hero: {},
  Knave: {},
  Villain: { selectId: villain => villain.key },
};

describe('EntityCacheReducer', () => {
  let collectionCreator: EntityCollectionCreator;
  let entityActionFactory: EntityActionFactory;
  let entityCacheReducer: ActionReducer<EntityCache, Action>;

  beforeEach(() => {
    entityActionFactory = new EntityActionFactory();
    const logger = {
      error: jasmine.createSpy('error'),
      log: jasmine.createSpy('log'),
      warn: jasmine.createSpy('warn'),
    };

    TestBed.configureTestingModule({
      providers: [
        EntityCacheReducerFactory,
        EntityCollectionCreator,
        {
          provide: EntityCollectionReducerMethodsFactory,
          useClass: EntityCollectionReducerMethodsFactory,
        },
        EntityCollectionReducerFactory,
        EntityCollectionReducerRegistry,
        EntityDefinitionService,
        { provide: ENTITY_METADATA_TOKEN, multi: true, useValue: metadata },
        { provide: Logger, useValue: logger },
      ],
    });

    collectionCreator = TestBed.inject(EntityCollectionCreator);
    const entityCacheReducerFactory = TestBed.inject(EntityCacheReducerFactory);
    entityCacheReducer = entityCacheReducerFactory.create();
  });

  describe('#create', () => {
    it('creates a default hero reducer when QUERY_ALL for hero', () => {
      const hero: Hero = { id: 42, name: 'Bobby' };
      const action = entityActionFactory.create<Hero>(
        'Hero',
        EntityOp.ADD_ONE,
        hero
      );

      const state = entityCacheReducer({}, action);
      const collection = state['Hero'];
      expect(collection.ids.length).toBe(1, 'should have added one');
      expect(collection.entities[42]).toEqual(hero, 'should be added hero');
    });

    it('throws when ask for reducer of unknown entity type', () => {
      const action = entityActionFactory.create('Foo', EntityOp.QUERY_ALL);
      expect(() => entityCacheReducer({}, action)).toThrowError(
        /no EntityDefinition/i
      );
    });
  });

  /**
   * Test the EntityCache-level actions, SET and MERGE, which can
   * be used to restore the entity cache from a know state such as
   * re-hydrating from browser storage.
   * Useful for an offline-capable app.
   */
  describe('EntityCache-level actions', () => {
    let initialHeroes: Hero[];
    let initialCache: EntityCache;

    beforeEach(() => {
      initialHeroes = [
        { id: 2, name: 'B', power: 'Fast' },
        { id: 1, name: 'A', power: 'invisible' },
      ];
      initialCache = createInitialCache({ Hero: initialHeroes });
    });

    describe('CLEAR_COLLECTIONS', () => {
      beforeEach(() => {
        const heroes = [
          { id: 2, name: 'B', power: 'Fast' },
          { id: 1, name: 'A', power: 'invisible' },
        ];
        const villains = [{ key: 'DE', name: 'Dr. Evil' }];
        const fools = [{ id: 66, name: 'Fool 66' }];

        initialCache = createInitialCache({
          Hero: heroes,
          Villain: villains,
          Fool: fools,
        });
      });

      it('should clear an existing cached collection', () => {
        const collections = ['Hero'];
        const action = new ClearCollections(collections);
        const state = entityCacheReducer(initialCache, action);
        expect(state['Hero'].ids).toEqual([], 'empty Hero collection');
        expect(state['Fool'].ids.length).toBeGreaterThan(0, 'Fools remain');
        expect(state['Villain'].ids.length).toBeGreaterThan(
          0,
          'Villains remain'
        );
      });

      it('should clear multiple existing cached collections', () => {
        const collections = ['Hero', 'Villain'];
        const action = new ClearCollections(collections);
        const state = entityCacheReducer(initialCache, action);
        expect(state['Hero'].ids).toEqual([], 'empty Hero collection');
        expect(state['Villain'].ids).toEqual([], 'empty Villain collection');
        expect(state['Fool'].ids.length).toBeGreaterThan(0, 'Fools remain');
      });

      it('should initialize an empty cache with the collections', () => {
        // because ANY call to a reducer creates the collection!
        const collections = ['Hero', 'Villain'];
        const action = new ClearCollections(collections);

        const state = entityCacheReducer({}, action);
        expect(Object.keys(state)).toEqual(
          ['Hero', 'Villain'],
          'created collections'
        );
        expect(state['Villain'].ids).toEqual([], 'Hero id');
        expect(state['Hero'].ids).toEqual([], 'Villain ids');
      });

      it('should return cache matching existing cache for empty collections array', () => {
        const collections: string[] = [];
        const action = new ClearCollections(collections);
        const state = entityCacheReducer(initialCache, action);
        expect(state).toEqual(initialCache);
      });

      it('should clear every collection in an existing cache when collections is falsy', () => {
        const action = new ClearCollections(undefined);
        const state = entityCacheReducer(initialCache, action);
        expect(Object.keys(state).sort()).toEqual(
          ['Fool', 'Hero', 'Villain'],
          'collections still exist'
        );
        expect(state['Fool'].ids).toEqual([], 'no Fool ids');
        expect(state['Hero'].ids).toEqual([], 'no Villain ids');
        expect(state['Villain'].ids).toEqual([], 'no Hero id');
      });
    });

    describe('LOAD_COLLECTIONS', () => {
      function shouldHaveExpectedHeroes(entityCache: EntityCache) {
        const heroCollection = entityCache['Hero'];
        expect(heroCollection.ids).toEqual([2, 1], 'Hero ids');
        expect(heroCollection.entities).toEqual({
          1: initialHeroes[1],
          2: initialHeroes[0],
        });
        expect(heroCollection.loaded).toBe(true, 'Heroes loaded');
      }

      it('should initialize an empty cache with the collections', () => {
        const collections: EntityCacheQuerySet = {
          Hero: initialHeroes,
          Villain: [{ key: 'DE', name: 'Dr. Evil' }],
        };

        const action = new LoadCollections(collections);

        const state = entityCacheReducer({}, action);
        shouldHaveExpectedHeroes(state);
        expect(state['Villain'].ids).toEqual(['DE'], 'Villain ids');
        expect(state['Villain'].loaded).toBe(true, 'Villains loaded');
      });

      it('should return cache matching existing cache when collections set is empty', () => {
        const action = new LoadCollections({});
        const state = entityCacheReducer(initialCache, action);
        expect(state).toEqual(initialCache);
      });

      it('should add a new collection to existing cache', () => {
        const collections: EntityCacheQuerySet = {
          Knave: [{ id: 96, name: 'Sneaky Pete' }],
        };
        const action = new LoadCollections(collections);
        const state = entityCacheReducer(initialCache, action);
        expect(state['Knave'].ids).toEqual([96], 'Knave ids');
        expect(state['Knave'].loaded).toBe(true, 'Knave loaded');
      });

      it('should replace an existing cached collection', () => {
        const collections: EntityCacheQuerySet = {
          Hero: [{ id: 42, name: 'Bobby' }],
        };
        const action = new LoadCollections(collections);
        const state = entityCacheReducer(initialCache, action);
        const heroCollection = state['Hero'];
        expect(heroCollection.ids).toEqual([42], 'only the loaded hero');
        expect(heroCollection.entities[42]).toEqual(
          { id: 42, name: 'Bobby' },
          'loaded hero'
        );
      });
    });

    describe('MERGE_QUERY_SET', () => {
      function shouldHaveExpectedHeroes(entityCache: EntityCache) {
        expect(entityCache['Hero'].ids).toEqual([2, 1], 'Hero ids');
        expect(entityCache['Hero'].entities).toEqual({
          1: initialHeroes[1],
          2: initialHeroes[0],
        });
      }

      it('should initialize an empty cache with query set', () => {
        const querySet: EntityCacheQuerySet = {
          Hero: initialHeroes,
          Villain: [{ key: 'DE', name: 'Dr. Evil' }],
        };

        const action = new MergeQuerySet(querySet);

        const state = entityCacheReducer({}, action);
        shouldHaveExpectedHeroes(state);
        expect(state['Villain'].ids).toEqual(['DE'], 'Villain ids');
      });

      it('should return cache matching existing cache when query set is empty', () => {
        const action = new MergeQuerySet({});
        const state = entityCacheReducer(initialCache, action);
        shouldHaveExpectedHeroes(state);
      });

      it('should add a new collection to existing cache', () => {
        const querySet: EntityCacheQuerySet = {
          Villain: [{ key: 'DE', name: 'Dr. Evil' }],
        };
        const action = new MergeQuerySet(querySet);
        const state = entityCacheReducer(initialCache, action);
        shouldHaveExpectedHeroes(state);
        expect(state['Villain'].ids).toEqual(['DE'], 'Villain ids');
      });

      it('should merge into an existing cached collection', () => {
        const querySet: EntityCacheQuerySet = {
          Hero: [{ id: 42, name: 'Bobby' }],
        };
        const action = new MergeQuerySet(querySet);
        const state = entityCacheReducer(initialCache, action);
        const heroCollection = state['Hero'];
        const expectedIds = initialHeroes.map(h => h.id).concat(42);
        expect(heroCollection.ids).toEqual(expectedIds, 'merged ids');
        expect(heroCollection.entities[42]).toEqual(
          { id: 42, name: 'Bobby' },
          'merged hero'
        );
      });
    });

    describe('SET_ENTITY_CACHE', () => {
      it('should initialize cache', () => {
        const cache = createInitialCache({
          Hero: initialHeroes,
          Villain: [{ key: 'DE', name: 'Dr. Evil' }],
        });

        const action = new SetEntityCache(cache);
        // const action = {  // equivalent
        //   type: SET_ENTITY_CACHE,
        //   payload: cache
        // };

        const state = entityCacheReducer(cache, action);
        expect(state['Hero'].ids).toEqual([2, 1], 'Hero ids');
        expect(state['Hero'].entities).toEqual({
          1: initialHeroes[1],
          2: initialHeroes[0],
        });
        expect(state['Villain'].ids).toEqual(['DE'], 'Villain ids');
      });

      it('should clear the cache when set with empty object', () => {
        const action = new SetEntityCache({});
        const state = entityCacheReducer(initialCache, action);
        expect(Object.keys(state)).toEqual([]);
      });

      it('should replace prior cache with new cache', () => {
        const priorCache = createInitialCache({
          Hero: initialHeroes,
          Villain: [{ key: 'DE', name: 'Dr. Evil' }],
        });

        const newHeroes = [{ id: 42, name: 'Bobby' }];
        const newCache = createInitialCache({ Hero: newHeroes });

        const action = new SetEntityCache(newCache);
        const state = entityCacheReducer(priorCache, action);
        expect(state['Villain']).toBeUndefined();

        const heroCollection = state['Hero'];
        expect(heroCollection.ids).toEqual([42], 'hero ids');
        expect(heroCollection.entities[42]).toEqual(newHeroes[0], 'heroes');
      });
    });

    describe('SAVE_ENTITIES', () => {
      it('should turn on loading flags for affected collections and nothing more when pessimistic', () => {
        const changeSet = createTestChangeSet();
        const action = new SaveEntities(changeSet, 'api/save', {
          isOptimistic: false,
        });

        const entityCache = entityCacheReducer({}, action);

        expect(entityCache['Fool'].ids).toEqual([], 'Fool ids');
        expect(entityCache['Hero'].ids).toEqual([], 'Hero ids');
        expect(entityCache['Knave'].ids).toEqual([], 'Knave ids');
        expect(entityCache['Villain'].ids).toEqual([], 'Villain ids');
        expectLoadingFlags(entityCache, true);
      });

      it('should initialize an empty cache with entities when optimistic and turn on loading flags', () => {
        const changeSet = createTestChangeSet();
        const action = new SaveEntities(changeSet, 'api/save', {
          isOptimistic: true,
        });

        const entityCache = entityCacheReducer({}, action);

        expect(entityCache['Fool'].ids).toEqual([], 'Fool ids');
        expect(entityCache['Hero'].ids).toEqual([42, 43], 'added Hero ids');
        expect(entityCache['Knave'].ids).toEqual([6, 66], 'Knave ids');
        expect(entityCache['Villain'].ids).toEqual(
          ['44', '45'],
          'added Villain ids'
        );
        expectLoadingFlags(entityCache, true);
      });

      it('should modify existing cache with entities when optimistic and turn on loading flags', () => {
        const initialEntities = createInitialSaveTestEntities();
        let entityCache = createInitialCache(initialEntities);

        const changeSet = createTestChangeSet();
        const action = new SaveEntities(changeSet, 'api/save', {
          isOptimistic: true,
        });

        entityCache = entityCacheReducer(entityCache, action);

        expect(entityCache['Fool'].ids).toEqual([1, 2], 'Fool ids');
        expect(entityCache['Fool'].entities[1].skill).toEqual(
          'Updated Skill 1'
        );

        expect(entityCache['Hero'].ids).toEqual(
          [4, 42, 43],
          'Hero ids - 2 new, {3,5} deleted'
        );

        expect(entityCache['Knave'].ids).toEqual([6, 66], 'Knave ids');
        expect(entityCache['Knave'].entities[6].name).toEqual(
          'Upsert Update Knave 6'
        );
        expect(entityCache['Knave'].entities[66].name).toEqual(
          'Upsert Add Knave 66'
        );

        expect(entityCache['Villain'].ids).toEqual(
          ['7', '8', '10', '44', '45'],
          'Villain ids'
        );

        expectLoadingFlags(entityCache, true);
      });
    });

    describe('SAVE_ENTITIES_CANCEL', () => {
      const corid = 'CORID42';

      it('should not turn off loading flags if you do not specify collections', () => {
        const changeSet = createTestChangeSet();
        let action: Action = new SaveEntities(changeSet, 'api/save', {
          correlationId: corid,
          isOptimistic: false,
        });

        // Pessimistic save turns on loading flags
        let entityCache = entityCacheReducer({}, action);
        expectLoadingFlags(entityCache, true);

        action = new SaveEntitiesCancel(corid, 'Test Cancel'); // no names so no flags turned off.
        entityCache = entityCacheReducer(entityCache, action);
        expectLoadingFlags(entityCache, true);
      });

      it('should turn off loading flags for collections that you specify', () => {
        const changeSet = createTestChangeSet();
        let action: Action = new SaveEntities(changeSet, 'api/save', {
          correlationId: corid,
          isOptimistic: false,
        });

        // Pessimistic save turns on loading flags
        let entityCache = entityCacheReducer({}, action);
        expectLoadingFlags(entityCache, true);

        action = new SaveEntitiesCancel(corid, 'Test Cancel', ['Hero', 'Fool']);
        entityCache = entityCacheReducer(entityCache, action);
        expectLoadingFlags(entityCache, false, ['Hero', 'Fool']);
        expectLoadingFlags(entityCache, true, ['Knave', 'Villain']);
      });
    });

    describe('SAVE_ENTITIES_SUCCESS', () => {
      it('should initialize an empty cache with entities when pessimistic', () => {
        const changeSet = createTestChangeSet();
        const action = new SaveEntitiesSuccess(changeSet, 'api/save', {
          isOptimistic: false,
        });

        const entityCache = entityCacheReducer({}, action);

        expect(entityCache['Fool'].ids).toEqual([], 'Fool ids');
        expect(entityCache['Hero'].ids).toEqual([42, 43], 'added Hero ids');
        expect(entityCache['Knave'].ids).toEqual([6, 66], 'Knave ids');
        expect(entityCache['Villain'].ids).toEqual(
          ['44', '45'],
          'added Villain ids'
        );
        expectLoadingFlags(entityCache, false);
      });

      it('should modify existing cache with entities when pessimistic', () => {
        const initialEntities = createInitialSaveTestEntities();
        let entityCache = createInitialCache(initialEntities);

        const changeSet = createTestChangeSet();
        const action = new SaveEntitiesSuccess(changeSet, 'api/save', {
          isOptimistic: false,
        });

        entityCache = entityCacheReducer(entityCache, action);

        expect(entityCache['Fool'].ids).toEqual([1, 2], 'Fool ids');
        expect(entityCache['Fool'].entities[1].skill).toEqual(
          'Updated Skill 1'
        );

        expect(entityCache['Hero'].ids).toEqual(
          [4, 42, 43],
          'Hero ids - 2 new, {3,5} deleted'
        );

        expect(entityCache['Knave'].ids).toEqual([6, 66], 'Knave ids');
        expect(entityCache['Knave'].entities[6].name).toEqual(
          'Upsert Update Knave 6'
        );
        expect(entityCache['Knave'].entities[66].name).toEqual(
          'Upsert Add Knave 66'
        );

        expect(entityCache['Villain'].ids).toEqual(
          ['7', '8', '10', '44', '45'],
          'Villain ids'
        );

        expectLoadingFlags(entityCache, false);
      });

      it('should modify existing cache with entities when optimistic', () => {
        const initialEntities = createInitialSaveTestEntities();
        let entityCache = createInitialCache(initialEntities);

        const changeSet = createTestChangeSet();
        const action = new SaveEntitiesSuccess(changeSet, 'api/save', {
          isOptimistic: true,
        });

        entityCache = entityCacheReducer(entityCache, action);

        expect(entityCache['Fool'].ids).toEqual([1, 2], 'Fool ids');
        expect(entityCache['Fool'].entities[1].skill).toEqual(
          'Updated Skill 1'
        );

        expect(entityCache['Hero'].ids).toEqual(
          [4, 42, 43],
          'Hero ids - 2 new, {3,5} deleted'
        );

        expect(entityCache['Knave'].ids).toEqual([6, 66], 'Knave ids');
        expect(entityCache['Knave'].entities[6].name).toEqual(
          'Upsert Update Knave 6'
        );
        expect(entityCache['Knave'].entities[66].name).toEqual(
          'Upsert Add Knave 66'
        );

        expect(entityCache['Villain'].ids).toEqual(
          ['7', '8', '10', '44', '45'],
          'Villain ids'
        );

        expectLoadingFlags(entityCache, false);
      });
    });

    describe('SAVE_ENTITIES_ERROR', () => {
      it('should turn loading flags off', () => {
        // Begin as if saving optimistically
        const changeSet = createTestChangeSet();
        const saveAction = new SaveEntities(changeSet, 'api/save', {
          isOptimistic: true,
        });
        let entityCache = entityCacheReducer({}, saveAction);

        expectLoadingFlags(entityCache, true);

        const dsError = new DataServiceError(new Error('Test Error'), {
          url: 'api/save',
        } as any);
        const errorAction = new SaveEntitiesError(dsError, saveAction);
        entityCache = entityCacheReducer(entityCache, errorAction);

        expectLoadingFlags(entityCache, false);

        // Added entities remain in cache (if not on the server), with pending changeState
        expect(entityCache['Hero'].ids).toEqual([42, 43], 'added Hero ids');
        const heroChangeState = entityCache['Hero'].changeState;
        expect(heroChangeState[42]).toBeDefined();
        expect(heroChangeState[43]).toBeDefined();
      });
    });
  });

  // #region helpers
  function createCollection<T = any>(
    entityName: string,
    data: T[],
    selectId: IdSelector<any>
  ) {
    return {
      ...collectionCreator.create<T>(entityName),
      ids: data.map(e => selectId(e)) as string[] | number[],
      entities: data.reduce(
        (acc, e) => {
          acc[selectId(e)] = e;
          return acc;
        },
        {} as any
      ),
    } as EntityCollection<T>;
  }

  function createInitialCache(entityMap: { [entityName: string]: any[] }) {
    const cache: EntityCache = {};
    // tslint:disable-next-line:forin
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

  function createInitialSaveTestEntities() {
    const entities: { [entityName: string]: any[] } = {
      Fool: [
        { id: 1, name: 'Fool 1', skill: 'Skill 1' },
        { id: 2, name: 'Fool 2', skill: 'Skill 2' },
      ],
      Hero: [
        { id: 3, name: 'Hero 3', power: 'Power 3' },
        { id: 4, name: 'Hero 4', power: 'Power 4' },
        { id: 5, name: 'Hero 5', power: 'Power 5' },
      ],
      Knave: [{ id: 6, name: 'Knave 1', weakness: 'Weakness 6' }],
      Villain: [
        { key: '7', name: 'Villain 7', sin: 'Sin 7' },
        { key: '8', name: 'Villain 8', sin: 'Sin 8' },
        { key: '9', name: 'Villain 9', sin: 'Sin 9' },
        { key: '10', name: 'Villain 10', sin: 'Sin 10' },
      ],
    };
    return entities;
  }

  function createTestChangeSet() {
    const changeSet: ChangeSet = {
      changes: [
        {
          entityName: 'Hero',
          op: ChangeSetOperation.Add,
          entities: [
            { id: 42, name: 'Hero 42' },
            { id: 43, name: 'Hero 43', power: 'Power 43' },
          ] as Hero[],
        },
        { entityName: 'Hero', op: ChangeSetOperation.Delete, entities: [3, 5] },
        {
          entityName: 'Villain',
          op: ChangeSetOperation.Delete,
          entities: ['9'],
        },
        {
          entityName: 'Villain',
          op: ChangeSetOperation.Add,
          entities: [
            { key: '44', name: 'Villain 44' },
            { key: '45', name: 'Villain 45', sin: 'Sin 45' },
          ] as Villain[],
        },
        {
          entityName: 'Fool',
          op: ChangeSetOperation.Update,
          entities: [{ id: 1, changes: { id: 1, skill: 'Updated Skill 1' } }],
        },
        {
          entityName: 'Knave',
          op: ChangeSetOperation.Upsert,
          entities: [
            { id: 6, name: 'Upsert Update Knave 6' },
            { id: 66, name: 'Upsert Add Knave 66' },
          ],
        },
      ],
    };
    return changeSet;
  }

  /**
   * Expect the loading flags of the named EntityCache collections to be in the `flag` state.
   * @param entityCache cache to check
   * @param flag True if should be loading; false if should not be loading
   * @param entityNames names of collections to check; if undefined, check all collections
   */
  function expectLoadingFlags(
    entityCache: EntityCache,
    flag: boolean,
    entityNames?: string[]
  ) {
    entityNames = entityNames ? [] : Object.keys(entityCache);
    entityNames.forEach(name => {
      expect(entityCache[name].loading).toBe(
        flag,
        `${name}${flag ? '' : ' not'} loading`
      );
    });
  }
  // #endregion helpers
});
