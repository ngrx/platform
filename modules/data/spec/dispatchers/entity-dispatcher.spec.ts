import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Subject } from 'rxjs';

import {
  EntityDispatcherDefaultOptions,
  CorrelationIdGenerator,
  EntityActionFactory,
  createEntityCacheSelector,
  defaultSelectId,
  EntityDispatcherBase,
  EntityDispatcher,
  EntityAction,
  EntityOp,
  MergeStrategy,
} from '../..';

class Hero {
  id!: number;
  name!: string;
  saying?: string;
}

/** Store stub */
class TestStore {
  // only interested in calls to store.dispatch()
  dispatch() {}
  select() {}
}

const defaultDispatcherOptions = new EntityDispatcherDefaultOptions();

describe('EntityDispatcher', () => {
  commandDispatchTest(entityDispatcherSetup);

  function entityDispatcherSetup() {
    const correlationIdGenerator = new CorrelationIdGenerator();
    const entityActionFactory = new EntityActionFactory();
    const entityCacheSelector = createEntityCacheSelector();
    const scannedActions$ = new Subject<Action>();
    const selectId = defaultSelectId;
    const store: any = new TestStore();

    const dispatcher = new EntityDispatcherBase<Hero>(
      'Hero',
      entityActionFactory,
      store,
      selectId,
      defaultDispatcherOptions,
      scannedActions$, // scannedActions$ not used in these tests
      entityCacheSelector, // entityCacheSelector not used in these tests
      correlationIdGenerator
    );
    return { dispatcher, store };
  }
});

///// Tests /////

/**
 * Test that implementer of EntityCommands dispatches properly
 * @param setup Function that sets up the EntityDispatcher before each test (called in a BeforeEach()).
 */
export function commandDispatchTest(
  setup: () => { dispatcher: EntityDispatcher<Hero>; store: any }
) {
  let dispatcher: EntityDispatcher<Hero>;
  let testStore: { dispatch: jasmine.Spy };

  function dispatchedAction() {
    return <EntityAction>testStore.dispatch.calls.argsFor(0)[0];
  }

  beforeEach(() => {
    const s = setup();
    spyOn(s.store, 'dispatch').and.callThrough();
    dispatcher = s.dispatcher;
    testStore = s.store;
  });

  it('#entityName is the expected name of the entity type', () => {
    expect(dispatcher.entityName).toBe('Hero');
  });

  it('#cancel(correlationId) can dispatch CANCEL_PERSIST', () => {
    dispatcher.cancel('CRID007', 'Test cancel');
    const { entityOp, correlationId, data } = dispatchedAction().payload;
    expect(entityOp).toBe(EntityOp.CANCEL_PERSIST);
    expect(correlationId).toBe('CRID007');
    expect(data).toBe('Test cancel');
  });

  describe('Save actions', () => {
    // By default add and update are pessimistic and delete is optimistic.
    // Tests override in the dispatcher method calls as necessary.

    describe('(optimistic)', () => {
      it('#add(hero) can dispatch SAVE_ADD_ONE optimistically', () => {
        const hero: Hero = { id: 42, name: 'test' };
        dispatcher.add(hero, { isOptimistic: true });
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_ADD_ONE);
        expect(isOptimistic).toBe(true);
        expect(data).toBe(hero);
      });

      it('#delete(42) dispatches SAVE_DELETE_ONE optimistically for the id:42', () => {
        dispatcher.delete(42); // optimistic by default
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_DELETE_ONE);
        expect(isOptimistic).toBe(true);
        expect(data).toBe(42);
      });

      it('#delete(hero) dispatches SAVE_DELETE_ONE optimistically for the hero.id', () => {
        const id = 42;
        const hero: Hero = { id, name: 'test' };
        dispatcher.delete(hero); // optimistic by default
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_DELETE_ONE);
        expect(isOptimistic).toBe(true);
        expect(data).toBe(42);
      });

      it('#update(hero) can dispatch SAVE_UPDATE_ONE optimistically with an update payload', () => {
        const hero: Hero = { id: 42, name: 'test' };
        const expectedUpdate: Update<Hero> = { id: 42, changes: hero };

        dispatcher.update(hero, { isOptimistic: true });
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_UPDATE_ONE);
        expect(isOptimistic).toBe(true);
        expect(data).toEqual(expectedUpdate);
      });
    });

    describe('(pessimistic)', () => {
      it('#add(hero) dispatches SAVE_ADD pessimistically', () => {
        const hero: Hero = { id: 42, name: 'test' };
        dispatcher.add(hero); // pessimistic by default
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_ADD_ONE);
        expect(isOptimistic).toBe(false);
        expect(data).toBe(hero);
      });

      it('#delete(42) can dispatch SAVE_DELETE pessimistically for the id:42', () => {
        dispatcher.delete(42, { isOptimistic: false }); // optimistic by default
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_DELETE_ONE);
        expect(isOptimistic).toBe(false);
        expect(data).toBe(42);
      });

      it('#delete(hero) can dispatch SAVE_DELETE pessimistically for the hero.id', () => {
        const id = 42;
        const hero: Hero = { id, name: 'test' };

        dispatcher.delete(hero, { isOptimistic: false }); // optimistic by default
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_DELETE_ONE);
        expect(isOptimistic).toBe(false);
        expect(data).toBe(42);
      });

      it('#update(hero) dispatches SAVE_UPDATE with an update payload', () => {
        const hero: Hero = { id: 42, name: 'test' };
        const expectedUpdate: Update<Hero> = { id: 42, changes: hero };

        dispatcher.update(hero); // pessimistic by default
        const { entityOp, isOptimistic, data } = dispatchedAction().payload;
        expect(entityOp).toBe(EntityOp.SAVE_UPDATE_ONE);
        expect(isOptimistic).toBe(false);
        expect(data).toEqual(expectedUpdate);
      });
    });
  });

  describe('Query actions', () => {
    it('#getAll() dispatches QUERY_ALL', () => {
      dispatcher.getAll();

      const {
        entityOp,
        entityName,
        mergeStrategy,
      } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_ALL);
      expect(entityName).toBe('Hero');
      expect(mergeStrategy).toBeUndefined();
    });

    it('#getAll({mergeStrategy}) dispatches QUERY_ALL with a MergeStrategy', () => {
      dispatcher.getAll({ mergeStrategy: MergeStrategy.PreserveChanges });

      const {
        entityOp,
        entityName,
        mergeStrategy,
      } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_ALL);
      expect(entityName).toBe('Hero');
      expect(mergeStrategy).toBe(MergeStrategy.PreserveChanges);
    });

    it('#getByKey(42) dispatches QUERY_BY_KEY for the id:42', () => {
      dispatcher.getByKey(42);

      const { entityOp, data, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_BY_KEY);
      expect(data).toBe(42);
      expect(mergeStrategy).toBeUndefined();
    });

    it('#getByKey(42, {mergeStrategy}) dispatches QUERY_BY_KEY with a MergeStrategy', () => {
      dispatcher.getByKey(42, {
        mergeStrategy: MergeStrategy.OverwriteChanges,
      });

      const { entityOp, data, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_BY_KEY);
      expect(data).toBe(42);
      expect(mergeStrategy).toBe(MergeStrategy.OverwriteChanges);
    });

    it('#getWithQuery(QueryParams) dispatches QUERY_MANY', () => {
      dispatcher.getWithQuery({ name: 'B' });

      const {
        entityOp,
        data,
        entityName,
        mergeStrategy,
      } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_MANY);
      expect(entityName).toBe('Hero');
      expect(data).toEqual({ name: 'B' });
      expect(mergeStrategy).toBeUndefined();
    });

    it('#getWithQuery(string) dispatches QUERY_MANY', () => {
      dispatcher.getWithQuery('name=B');

      const {
        entityOp,
        data,
        entityName,
        mergeStrategy,
      } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_MANY);
      expect(entityName).toBe('Hero');
      expect(data).toEqual('name=B');
      expect(mergeStrategy).toBeUndefined();
    });

    it('#getWithQuery(string) dispatches QUERY_MANY with a MergeStrategy', () => {
      dispatcher.getWithQuery('name=B', {
        mergeStrategy: MergeStrategy.PreserveChanges,
      });

      const {
        entityOp,
        data,
        entityName,
        mergeStrategy,
      } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_MANY);
      expect(entityName).toBe('Hero');
      expect(data).toEqual('name=B');
      expect(mergeStrategy).toBe(MergeStrategy.PreserveChanges);
    });

    it('#load() dispatches QUERY_LOAD', () => {
      dispatcher.load();

      const {
        entityOp,
        entityName,
        mergeStrategy,
      } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.QUERY_LOAD);
      expect(entityName).toBe('Hero');
      expect(mergeStrategy).toBeUndefined();
    });
  });

  /*** Cache-only operations ***/
  describe('Cache-only actions', () => {
    it('#addAllToCache dispatches ADD_ALL', () => {
      const heroes: Hero[] = [
        { id: 42, name: 'test 42' },
        { id: 84, name: 'test 84', saying: 'howdy' },
      ];
      dispatcher.addAllToCache(heroes);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.ADD_ALL);
      expect(data).toBe(heroes);
    });

    it('#addOneToCache dispatches ADD_ONE', () => {
      const hero: Hero = { id: 42, name: 'test' };
      dispatcher.addOneToCache(hero);
      const { entityOp, data, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.ADD_ONE);
      expect(data).toBe(hero);
      expect(mergeStrategy).toBeUndefined();
    });

    it('#addOneToCache can dispatch ADD_ONE and MergeStrategy.IgnoreChanges', () => {
      const hero: Hero = { id: 42, name: 'test' };
      dispatcher.addOneToCache(hero, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.ADD_ONE);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#addManyToCache dispatches ADD_MANY', () => {
      const heroes: Hero[] = [
        { id: 42, name: 'test 42' },
        { id: 84, name: 'test 84', saying: 'howdy' },
      ];
      dispatcher.addManyToCache(heroes);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.ADD_MANY);
      expect(data).toBe(heroes);
    });

    it('#addManyToCache can dispatch ADD_MANY and MergeStrategy.IgnoreChanges', () => {
      const heroes: Hero[] = [
        { id: 42, name: 'test 42' },
        { id: 84, name: 'test 84', saying: 'howdy' },
      ];
      dispatcher.addManyToCache(heroes, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.ADD_MANY);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#clearCache() dispatches REMOVE_ALL for the Hero collection', () => {
      dispatcher.clearCache();
      const { entityOp, entityName } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.REMOVE_ALL);
      expect(entityName).toBe('Hero');
    });

    it('#clearCache() can dispatch REMOVE_ALL with options', () => {
      dispatcher.clearCache({ mergeStrategy: MergeStrategy.IgnoreChanges });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.REMOVE_ALL);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#removeOneFromCache(key) dispatches REMOVE_ONE', () => {
      const id = 42;
      dispatcher.removeOneFromCache(id);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.REMOVE_ONE);
      expect(data).toBe(id);
    });

    it('#removeOneFromCache(key) can dispatch REMOVE_ONE and MergeStrategy.IgnoreChanges', () => {
      const id = 42;
      dispatcher.removeOneFromCache(id, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.REMOVE_ONE);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#removeManyFromCache(keys) dispatches REMOVE_MANY', () => {
      const keys = [42, 84];
      dispatcher.removeManyFromCache(keys);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.REMOVE_MANY);
      expect(data).toBe(keys);
    });

    it('#removeManyFromCache(keys) can dispatch REMOVE_MANY and MergeStrategy.IgnoreChanges', () => {
      const keys = [42, 84];
      dispatcher.removeManyFromCache(keys, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.REMOVE_MANY);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#removeManyFromCache(entities) dispatches REMOVE_MANY', () => {
      const heroes: Hero[] = [
        { id: 42, name: 'test 42' },
        { id: 84, name: 'test 84', saying: 'howdy' },
      ];
      const keys = heroes.map((h) => h.id);
      dispatcher.removeManyFromCache(heroes);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.REMOVE_MANY);
      expect(data).toEqual(keys);
    });

    it('#toUpdate() helper method creates Update<T>', () => {
      const hero: Partial<Hero> = { id: 42, name: 'test' };
      const expected = { id: 42, changes: hero };
      const update = dispatcher.toUpdate(hero);
      expect(update).toEqual(expected);
    });

    it('#updateOneInCache dispatches UPDATE_ONE', () => {
      const hero: Partial<Hero> = { id: 42, name: 'test' };
      const update = { id: 42, changes: hero };
      dispatcher.updateOneInCache(hero);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPDATE_ONE);
      expect(data).toEqual(update);
    });

    it('#updateOneInCache can dispatch UPDATE_ONE and MergeStrategy.IgnoreChanges', () => {
      const hero: Partial<Hero> = { id: 42, name: 'test' };
      const update = { id: 42, changes: hero };
      dispatcher.updateOneInCache(hero, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPDATE_ONE);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#updateManyInCache dispatches UPDATE_MANY', () => {
      const heroes: Partial<Hero>[] = [
        { id: 42, name: 'test 42' },
        { id: 84, saying: 'ho ho ho' },
      ];
      const updates = [
        { id: 42, changes: heroes[0] },
        { id: 84, changes: heroes[1] },
      ];
      dispatcher.updateManyInCache(heroes);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPDATE_MANY);
      expect(data).toEqual(updates);
    });

    it('#updateManyInCache can dispatch UPDATE_MANY and MergeStrategy.IgnoreChanges', () => {
      const heroes: Partial<Hero>[] = [
        { id: 42, name: 'test 42' },
        { id: 84, saying: 'ho ho ho' },
      ];
      const updates = [
        { id: 42, changes: heroes[0] },
        { id: 84, changes: heroes[1] },
      ];
      dispatcher.updateManyInCache(heroes, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPDATE_MANY);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#upsertOneInCache dispatches UPSERT_ONE', () => {
      const hero = { id: 42, name: 'test' };
      dispatcher.upsertOneInCache(hero);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPSERT_ONE);
      expect(data).toEqual(hero);
    });

    it('#upsertOneInCache can dispatch UPSERT_ONE and MergeStrategy.IgnoreChanges', () => {
      const hero = { id: 42, name: 'test' };
      dispatcher.upsertOneInCache(hero, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPSERT_ONE);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });

    it('#upsertManyInCache dispatches UPSERT_MANY', () => {
      const heroes = [
        { id: 42, name: 'test 42' },
        { id: 84, saying: 'ho ho ho' },
      ];
      dispatcher.upsertManyInCache(heroes);
      const { entityOp, data } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPSERT_MANY);
      expect(data).toEqual(heroes);
    });

    it('#upsertManyInCache can dispatch UPSERT_MANY and MergeStrategy.IgnoreChanges', () => {
      const heroes = [
        { id: 42, name: 'test 42' },
        { id: 84, saying: 'ho ho ho' },
      ];
      dispatcher.upsertManyInCache(heroes, {
        mergeStrategy: MergeStrategy.IgnoreChanges,
      });
      const { entityOp, mergeStrategy } = dispatchedAction().payload;
      expect(entityOp).toBe(EntityOp.UPSERT_MANY);
      expect(mergeStrategy).toBe(MergeStrategy.IgnoreChanges);
    });
  });
}
