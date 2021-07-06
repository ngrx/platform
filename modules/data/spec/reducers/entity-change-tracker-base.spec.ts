/* eslint-disable prefer-const */
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  EntityCollection,
  EntityChangeTracker,
  createEmptyEntityCollection,
  EntityChangeTrackerBase,
  defaultSelectId,
  ChangeType,
  ChangeState,
  MergeStrategy,
} from '../..';

interface Hero {
  id: number;
  name: string;
  power?: string;
}

function sortByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

/** Test version of toUpdate that assumes entity has key named 'id' */
function toUpdate(entity: any) {
  return { id: entity.id, changes: entity };
}

const adapter: EntityAdapter<Hero> = createEntityAdapter<Hero>({
  sortComparer: sortByName,
});

describe('EntityChangeTrackerBase', () => {
  let origCollection: EntityCollection<Hero>;
  let tracker: EntityChangeTracker<Hero>;

  beforeEach(() => {
    origCollection = createEmptyEntityCollection<Hero>('Hero');
    origCollection.entities = {
      1: { id: 1, name: 'Alice', power: 'Strong' },
      2: { id: 2, name: 'Gail', power: 'Loud' },
      7: { id: 7, name: 'Bob', power: 'Swift' },
    };
    origCollection.ids = [1, 7, 2];
    tracker = new EntityChangeTrackerBase(adapter, defaultSelectId);
  });

  describe('#commitAll', () => {
    it('should clear all tracked changes', () => {
      let { collection } = createTestTrackedEntities();
      expect(Object.keys(collection.changeState).length).toBe(3);

      collection = tracker.commitAll(collection);
      expect(Object.keys(collection.changeState).length).toBe(0);
    });
  });

  describe('#commitOne', () => {
    it('should clear current tracking of the given entity', () => {
      let {
        collection,
        deletedEntity,
        addedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      collection = tracker.commitMany([updatedEntity], collection);
      expect(collection.changeState[updatedEntity.id]).toBeUndefined();
      expect(collection.changeState[deletedEntity!.id]).toBeDefined();
      expect(collection.changeState[addedEntity.id]).toBeDefined();
    });
  });

  describe('#commitMany', () => {
    it('should clear current tracking of the given entities', () => {
      let {
        collection,
        deletedEntity,
        addedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      collection = tracker.commitMany([addedEntity, updatedEntity], collection);
      expect(collection.changeState[addedEntity.id]).toBeUndefined();
      expect(collection.changeState[updatedEntity.id]).toBeUndefined();
      expect(collection.changeState[deletedEntity!.id]).toBeDefined();
    });
  });

  describe('#mergeQueryResults', () => {
    it('should use default preserve changes strategy', () => {
      let {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        locallyUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();
      const collection = tracker.mergeQueryResults(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.entities[updatedHero.id]).toEqual(locallyUpdatedHero);
      expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
        serverUpdatedHero
      );
    });

    it('should be able to use ignore changes strategy', () => {
      const {
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeQueryResults(
        [serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.IgnoreChanges // manually provide strategy
      );

      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
        updatedHero
      );
    });

    it('should be able to use preserve changes strategy', () => {
      const {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        locallyUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeQueryResults(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.PreserveChanges // manually provide strategy
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.entities[updatedHero.id]).toEqual(locallyUpdatedHero);
      expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
        serverUpdatedHero
      );
    });

    it('should be able to use overwrite changes strategy', () => {
      const {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeQueryResults(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.OverwriteChanges // manually provide strategy
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.changeState[unchangedHero.id]).toBeUndefined();
      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]).toBeUndefined();
    });
  });

  describe('#mergeSaveAdds', () => {
    it('should use default overwrite changes strategy', () => {
      let {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();
      const collection = tracker.mergeSaveAdds(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.changeState[unchangedHero.id]).toBeUndefined();
      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]).toBeUndefined();
    });

    it('should be able to use ignore changes strategy', () => {
      const {
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeSaveAdds(
        [serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.IgnoreChanges // manually provide strategy
      );

      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
        updatedHero
      );
    });

    it('should be able to use preserve changes strategy', () => {
      const {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        locallyUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeSaveAdds(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.PreserveChanges // manually provide strategy
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.entities[updatedHero.id]).toEqual(locallyUpdatedHero);
      expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
        serverUpdatedHero
      );
    });

    it('should be able to use overwrite changes strategy', () => {
      const {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeSaveAdds(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.OverwriteChanges // manually provide strategy
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.changeState[unchangedHero.id]).toBeUndefined();
      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]).toBeUndefined();
    });
  });

  describe('#mergeSaveDeletes', () => {
    // TODO: add some tests
  });

  describe('#mergeSaveUpdates', () => {
    // TODO: add some tests
  });

  describe('#mergeSaveUpserts', () => {
    it('should use default overwrite changes strategy', () => {
      let {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();
      const collection = tracker.mergeSaveUpserts(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.changeState[unchangedHero.id]).toBeUndefined();
      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]).toBeUndefined();
    });

    it('should be able to use ignore changes strategy', () => {
      const {
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeSaveUpserts(
        [serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.IgnoreChanges // manually provide strategy
      );

      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
        updatedHero
      );
    });

    it('should be able to use preserve changes strategy', () => {
      const {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        locallyUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeSaveUpserts(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.PreserveChanges // manually provide strategy
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.entities[updatedHero.id]).toEqual(locallyUpdatedHero);
      expect(collection.changeState[updatedHero.id]!.originalValue).toEqual(
        serverUpdatedHero
      );
    });

    it('should be able to use overwrite changes strategy', () => {
      const {
        unchangedHero,
        unchangedHeroServerUpdated,
        updatedHero,
        serverUpdatedHero,
        initialCache,
      } = createInitialCacheForMerges();

      const collection = tracker.mergeSaveUpserts(
        [unchangedHeroServerUpdated, serverUpdatedHero],
        initialCache.Hero,
        MergeStrategy.OverwriteChanges // manually provide strategy
      );

      expect(collection.entities[unchangedHero.id]).toEqual(
        unchangedHeroServerUpdated
      );
      expect(collection.changeState[unchangedHero.id]).toBeUndefined();
      expect(collection.entities[updatedHero.id]).toEqual(serverUpdatedHero);
      expect(collection.changeState[updatedHero.id]).toBeUndefined();
    });
  });

  describe('#trackAddOne', () => {
    it('should return a new collection with tracked new entity', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      const collection = tracker.trackAddOne(addedEntity, origCollection);

      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[addedEntity.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Added);
      expect(change!.originalValue).toBeUndefined();
    });

    it('should leave added entity tracked as added when entity is updated', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      let collection = tracker.trackAddOne(addedEntity, origCollection);

      const updatedEntity = { ...addedEntity, name: 'Double Test' };
      collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);
      // simulate the collection update
      collection.entities[addedEntity.id] = updatedEntity;

      const change = collection.changeState[updatedEntity.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Added);
      expect(change!.originalValue).toBeUndefined();
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackAddOne(null as any, origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return the same collection if MergeStrategy.IgnoreChanges', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      const collection = tracker.trackAddOne(
        addedEntity,
        origCollection,
        MergeStrategy.IgnoreChanges
      );

      expect(collection).toBe(origCollection);
      const change = collection.changeState[addedEntity.id];
      expect(change).toBeUndefined();
    });
  });

  describe('#trackAddMany', () => {
    const newEntities = [
      { id: 42, name: 'Ted', power: 'Chatty' },
      { id: 84, name: 'Sally', power: 'Laughter' },
    ];

    it('should return a new collection with tracked new entities', () => {
      const collection = tracker.trackAddMany(newEntities, origCollection);
      expect(collection).not.toBe(origCollection);
      const trackKeys = Object.keys(collection.changeState);
      expect(trackKeys).toEqual(['42', '84']);

      trackKeys.forEach((key, ix) => {
        const change = collection.changeState[key];
        expect(change).toBeDefined();
        expectChangeType(
          change,
          ChangeType.Added,
          `tracking ${key} as a new entity`
        );
        expect(change!.originalValue).toBeUndefined();
      });
    });

    it('should return same collection if called with empty array', () => {
      const collection = tracker.trackAddMany([] as any, origCollection);
      expect(collection).toBe(origCollection);
    });
  });

  describe('#trackDeleteOne', () => {
    it('should return a new collection with tracked "deleted" entity', () => {
      const existingEntity = getFirstExistingEntity();
      const collection = tracker.trackDeleteOne(
        existingEntity!.id,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Deleted);
      expect(change!.originalValue).toBe(existingEntity);
    });

    it('should return a new collection with tracked "deleted" entity, deleted by key', () => {
      const existingEntity = getFirstExistingEntity();
      const collection = tracker.trackDeleteOne(
        existingEntity!.id,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Deleted);
      expect(change!.originalValue).toBe(existingEntity);
    });

    it('should untrack (commit) an added entity when it is removed', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      let collection = tracker.trackAddOne(addedEntity, origCollection);

      // Add it to the collection as the reducer would
      collection = {
        ...collection,
        entities: { ...collection.entities, 42: addedEntity },
        ids: (collection.ids as number[]).concat(42),
      };

      let change = collection.changeState[addedEntity.id];
      expect(change).toBeDefined();

      collection = tracker.trackDeleteOne(addedEntity.id, collection);
      change = collection.changeState[addedEntity.id];
      expect(change).not.toBeDefined();
    });

    it('should switch an updated entity to a deleted entity when it is removed', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });

      let collection = tracker.trackUpdateOne(
        toUpdate(updatedEntity),
        origCollection
      );

      let change = collection.changeState[updatedEntity.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated, 'updated at first');

      collection = tracker.trackDeleteOne(updatedEntity.id, collection);
      change = collection.changeState[updatedEntity.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Deleted, 'after delete');
      expect(change!.originalValue).toEqual(existingEntity);
    });

    it('should leave deleted entity tracked as deleted when try to update', () => {
      const existingEntity = getFirstExistingEntity();
      let collection = tracker.trackDeleteOne(
        existingEntity!.id,
        origCollection
      );

      let change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Deleted);

      // This shouldn't be possible but let's try it.
      const updatedEntity: any = { ...existingEntity, name: 'Double Test' };
      collection.entities[existingEntity!.id] = updatedEntity;

      collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);
      change = collection.changeState[updatedEntity.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Deleted);
      expect(change!.originalValue).toEqual(existingEntity);
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackDeleteOne(null as any, origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if called with a key not found', () => {
      const collection = tracker.trackDeleteOne('1234', origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if MergeStrategy.IgnoreChanges', () => {
      const existingEntity = getFirstExistingEntity();
      const collection = tracker.trackDeleteOne(
        existingEntity!.id,
        origCollection,
        MergeStrategy.IgnoreChanges
      );
      expect(collection).toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeUndefined();
    });
  });

  describe('#trackDeleteMany', () => {
    it('should return a new collection with tracked "deleted" entities', () => {
      const existingEntities = getSomeExistingEntities(2);
      const collection = tracker.trackDeleteMany(
        existingEntities.map((e) => e!.id),
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      existingEntities.forEach((entity, ix) => {
        const change = collection.changeState[existingEntities[ix]!.id];
        expect(change).toBeDefined();
        expectChangeType(change, ChangeType.Deleted, `entity #${ix}`);
        expect(change!.originalValue).toBe(existingEntities[ix]);
      });
    });

    it('should return same collection if called with empty array', () => {
      const collection = tracker.trackDeleteMany([], origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if called with a key not found', () => {
      const collection = tracker.trackDeleteMany(['1234', 456], origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should not mutate changeState when called on a tracked "updated" entity', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });
      const collection = tracker.trackUpdateOne(updatedEntity, origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated);
      Object.freeze(change);
      expect(() => {
        tracker.trackDeleteMany([existingEntity!.id], collection);
      }).not.toThrowError();
    });
  });

  describe('#trackUpdateOne', () => {
    it('should return a new collection with tracked updated entity', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });
      const collection = tracker.trackUpdateOne(updatedEntity, origCollection);
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated);
      expect(change!.originalValue).toBe(existingEntity);
    });

    it('should return a new collection with tracked updated entity, updated by key', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });
      const collection = tracker.trackUpdateOne(updatedEntity, origCollection);
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated);
      expect(change!.originalValue).toBe(existingEntity);
    });

    it('should leave updated entity tracked as updated if try to add', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });
      let collection = tracker.trackUpdateOne(updatedEntity, origCollection);

      let change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated);

      // This shouldn't be possible but let's try it.
      const addedEntity: any = { ...existingEntity, name: 'Double Test' };
      collection.entities[existingEntity!.id] = addedEntity;

      collection = tracker.trackAddOne(addedEntity, collection);
      change = collection.changeState[addedEntity.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated);
      expect(change!.originalValue).toEqual(existingEntity);
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackUpdateOne(null as any, origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if called with a key not found', () => {
      const updateEntity = toUpdate({ id: '1234', name: 'Mr. 404' });
      const collection = tracker.trackUpdateOne(updateEntity, origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if MergeStrategy.IgnoreChanges', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });
      const collection = tracker.trackUpdateOne(
        updatedEntity,
        origCollection,
        MergeStrategy.IgnoreChanges
      );
      expect(collection).toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeUndefined();
    });
  });

  describe('#trackUpdateMany', () => {
    it('should return a new collection with tracked updated entities', () => {
      const existingEntities = getSomeExistingEntities(2);
      const updateEntities = existingEntities.map((e) =>
        toUpdate({ ...e, name: e!.name + ' updated' })
      );
      const collection = tracker.trackUpdateMany(
        updateEntities,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      existingEntities.forEach((entity, ix) => {
        const change = collection.changeState[existingEntities[ix]!.id];
        expect(change).toBeDefined();
        expectChangeType(change, ChangeType.Updated, `entity #${ix}`);
        expect(change!.originalValue).toBe(existingEntities[ix]);
      });
    });

    it('should return same collection if called with empty array', () => {
      const collection = tracker.trackUpdateMany([], origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if called with entities whose keys are not found', () => {
      const updateEntities = [
        toUpdate({ id: '1234', name: 'Mr. 404' }),
        toUpdate({ id: 456, name: 'Ms. 404' }),
      ];
      const collection = tracker.trackUpdateMany(
        updateEntities,
        origCollection
      );
      expect(collection).toBe(origCollection);
    });
  });

  describe('#trackUpsertOne', () => {
    it('should return a new collection with tracked added entity', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      const collection = tracker.trackUpsertOne(addedEntity, origCollection);
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[addedEntity.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Added);
      expect(change!.originalValue).toBeUndefined();
    });

    it('should return a new collection with tracked updated entity', () => {
      const existingEntity = getFirstExistingEntity();
      const collection = tracker.trackUpsertOne(
        existingEntity as Hero,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated);
      expect(change!.originalValue).toBe(existingEntity);
    });

    it('should not change orig value of updated entity that is updated again', () => {
      const existingEntity = getFirstExistingEntity();
      let collection = tracker.trackUpsertOne(
        existingEntity as Hero,
        origCollection
      );

      let change = collection.changeState[existingEntity!.id];
      expect(change).toBeDefined();
      expectChangeType(change, ChangeType.Updated, 'first updated');

      const updatedAgainEntity = {
        ...existingEntity,
        name: 'Double Test',
      } as Hero;

      collection = tracker.trackUpsertOne(
        updatedAgainEntity as Hero,
        collection
      );
      change = collection.changeState[updatedAgainEntity.id];
      expect(change).toBeDefined();
      expectChangeType(
        change,
        ChangeType.Updated,
        'still updated after attempted add'
      );
      expect(change!.originalValue).toEqual(existingEntity);
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackUpsertOne(null as any, origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if MergeStrategy.IgnoreChanges', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = { ...existingEntity, name: 'test update' };
      const collection = tracker.trackUpsertOne(
        updatedEntity as Hero,
        origCollection,
        MergeStrategy.IgnoreChanges
      );
      expect(collection).toBe(origCollection);
      const change = collection.changeState[existingEntity!.id];
      expect(change).toBeUndefined();
    });
  });

  describe('#trackUpsertMany', () => {
    it('should return a new collection with tracked upserted entities', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      const exitingEntities = getSomeExistingEntities(2);
      const updatedEntities = exitingEntities.map((e) => ({
        ...e,
        name: e!.name + 'test',
      }));
      const upsertEntities = updatedEntities.concat(addedEntity);
      const collection = tracker.trackUpsertMany(
        upsertEntities as Hero[],
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      updatedEntities.forEach((entity, ix) => {
        const change = collection.changeState[(updatedEntities[ix] as Hero).id];
        expect(change).toBeDefined();
        // first two should be updated, the 3rd is added
        expectChangeType(
          change,
          ix === 2 ? ChangeType.Added : ChangeType.Updated,
          `entity #${ix}`
        );
        if (change!.changeType === ChangeType.Updated) {
          expect(change!.originalValue).toBe(exitingEntities[ix]);
        } else {
          expect(change!.originalValue).toBeUndefined();
        }
      });
    });

    it('should return same collection if called with empty array', () => {
      const collection = tracker.trackUpsertMany([], origCollection);
      expect(collection).toBe(origCollection);
    });
  });

  describe('#undoAll', () => {
    it('should clear all tracked changes', () => {
      let { collection } = createTestTrackedEntities();
      expect(Object.keys(collection.changeState).length).toBe(3);

      collection = tracker.undoAll(collection);
      expect(Object.keys(collection.changeState).length).toBe(0);
    });

    it('should restore the collection to the pre-change state', () => {
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      // Before undo
      expect(collection.entities[addedEntity.id]).toBeDefined();
      expect(collection.entities[deletedEntity!.id]).toBeUndefined();
      expect(updatedEntity.name).not.toEqual(preUpdatedEntity!.name);

      collection = tracker.undoAll(collection);

      // After undo
      expect(collection.entities[addedEntity.id]).toBeUndefined();
      expect(collection.entities[deletedEntity!.id]).toBeDefined();
      const revertedUpdate = collection.entities[updatedEntity.id];
      expect(revertedUpdate!.name).toEqual(preUpdatedEntity!.name);
    });
  });

  describe('#undoOne', () => {
    it('should clear one tracked change', () => {
      let { collection, deletedEntity } = createTestTrackedEntities();

      expect(Object.keys(collection.changeState).length).toBe(3);

      collection = tracker.undoOne(deletedEntity as Hero, collection);

      expect(Object.keys(collection.changeState).length).toBe(2);
    });

    it('should restore the collection to the pre-change state for the given entity', () => {
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      collection = tracker.undoOne(deletedEntity as Hero, collection);

      expect(collection.entities[deletedEntity!.id]).toBeDefined();
      expect(collection.entities[addedEntity.id]).toBeDefined();
      expect(updatedEntity.name).not.toEqual(preUpdatedEntity!.name);
    });

    it('should do nothing when the given entity is null', () => {
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      collection = tracker.undoOne(null as any, collection);
      expect(collection.entities[addedEntity.id]).toBeDefined();
      expect(collection.entities[deletedEntity!.id]).toBeUndefined();
      expect(updatedEntity.name).not.toEqual(preUpdatedEntity!.name);
    });
  });

  describe('#undoMany', () => {
    it('should clear many tracked changes', () => {
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      expect(Object.keys(collection.changeState).length).toBe(3);

      collection = tracker.undoMany(
        [addedEntity, deletedEntity, updatedEntity],
        collection
      );

      expect(Object.keys(collection.changeState).length).toBe(0);
    });

    it('should restore the collection to the pre-change state for the given entities', () => {
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      collection = tracker.undoMany(
        [addedEntity, deletedEntity, updatedEntity],
        collection
      );
      expect(collection.entities[addedEntity.id]).toBeUndefined();
      expect(collection.entities[deletedEntity!.id]).toBeDefined();
      const revertedUpdate = collection.entities[updatedEntity.id];
      expect(revertedUpdate!.name).toEqual(preUpdatedEntity!.name);
    });

    it('should do nothing when there are no entities to undo', () => {
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      collection = tracker.undoMany([], collection);
      expect(collection.entities[addedEntity.id]).toBeDefined();
      expect(collection.entities[deletedEntity!.id]).toBeUndefined();
      expect(updatedEntity.name).not.toEqual(preUpdatedEntity!.name);
    });
  });

  /// helpers ///

  /** Simulate the state of the collection after some test changes */
  function createTestTrackedEntities() {
    const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
    const [deletedEntity, preUpdatedEntity] = getSomeExistingEntities(2);
    const updatedEntity: any = { ...preUpdatedEntity, name: 'Test Me' };

    let collection = tracker.trackAddOne(addedEntity, origCollection);
    collection = tracker.trackDeleteOne(deletedEntity!.id, collection);
    collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);

    // Make the collection match these changes
    collection.ids = (collection.ids.slice(
      1,
      collection.ids.length
    ) as number[]).concat(42);
    const entities: { [id: number]: Hero } = {
      ...collection.entities,
      42: addedEntity,
      [updatedEntity.id]: updatedEntity,
    };
    delete entities[deletedEntity!.id];
    collection.entities = entities;
    return {
      collection,
      addedEntity,
      deletedEntity,
      preUpdatedEntity,
      updatedEntity,
    };
  }

  function createInitialCacheForMerges() {
    // general test data for testing mergeStrategy
    const unchangedHero = { id: 1, name: 'Unchanged', power: 'Hammer' };
    const unchangedHeroServerUpdated = {
      id: 1,
      name: 'UnchangedUpdated',
      power: 'Bish',
    };
    const deletedHero = { id: 2, name: 'Deleted', power: 'Bash' };
    const addedHero = { id: 3, name: 'Added', power: 'Tiny' };
    const updatedHero = { id: 4, name: 'Pre Updated', power: 'Tech' };
    const locallyUpdatedHero = {
      id: 4,
      name: 'Locally Updated',
      power: 'Suit',
    };
    const serverUpdatedHero = { id: 4, name: 'Server Updated', power: 'Nano' };
    const ids = [unchangedHero.id, addedHero.id, updatedHero.id];
    const initialCache = {
      Hero: {
        ids,
        entities: {
          [unchangedHero.id]: unchangedHero,
          [addedHero.id]: addedHero,
          [updatedHero.id]: locallyUpdatedHero,
        },
        entityName: 'Hero',
        filter: '',
        loaded: true,
        loading: false,
        changeState: {
          [deletedHero.id]: {
            changeType: ChangeType.Deleted,
            originalValue: deletedHero,
          },
          [updatedHero.id]: {
            changeType: ChangeType.Updated,
            originalValue: updatedHero,
          },
          [addedHero.id]: { changeType: ChangeType.Added },
        },
      },
    };
    return {
      unchangedHero,
      unchangedHeroServerUpdated,
      deletedHero,
      addedHero,
      updatedHero,
      locallyUpdatedHero,
      serverUpdatedHero,
      initialCache,
    };
  }

  /** Test for ChangeState with expected ChangeType */
  function expectChangeType(
    change: ChangeState<any> | undefined,
    expectedChangeType: ChangeType,
    msg?: string
  ) {
    expect(ChangeType[change!.changeType]).toEqual(
      ChangeType[expectedChangeType]
    );
  }

  /** Get the first entity in `originalCollection`  */
  function getFirstExistingEntity() {
    return getExistingEntityById(origCollection.ids[0]);
  }

  /**
   * Get the first 'n' existing entities from `originalCollection`
   * @param n Number of them to get
   */
  function getSomeExistingEntities(n: number) {
    const ids = (origCollection.ids as string[]).slice(0, n);
    return getExistingEntitiesById(ids);
  }

  function getExistingEntityById(id: number | string) {
    return getExistingEntitiesById([id as string])[0];
  }

  function getExistingEntitiesById(ids: string[]) {
    return ids.map((id) => origCollection.entities[id]);
  }
});
