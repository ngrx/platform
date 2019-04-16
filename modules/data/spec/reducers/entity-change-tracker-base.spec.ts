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
} from 'modules/data';

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
      expect(Object.keys(collection.changeState).length).toBe(
        3,
        'tracking 3 entities'
      );

      collection = tracker.commitAll(collection);
      expect(Object.keys(collection.changeState).length).toBe(
        0,
        'tracking zero entities'
      );
    });
  });

  describe('#commitOne', () => {
    it('should clear current tracking of the given entity', () => {
      // tslint:disable-next-line:prefer-const
      let {
        collection,
        deletedEntity,
        addedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      collection = tracker.commitMany([updatedEntity], collection);
      expect(collection.changeState[updatedEntity.id]).toBeUndefined(
        'no changes tracked for updated entity'
      );
      expect(collection.changeState[deletedEntity.id]).toBeDefined(
        'still tracking deleted entity'
      );
      expect(collection.changeState[addedEntity.id]).toBeDefined(
        'still tracking added entity'
      );
    });
  });

  describe('#commitMany', () => {
    it('should clear current tracking of the given entities', () => {
      // tslint:disable-next-line:prefer-const
      let {
        collection,
        deletedEntity,
        addedEntity,
        updatedEntity,
      } = createTestTrackedEntities();
      collection = tracker.commitMany([addedEntity, updatedEntity], collection);
      expect(collection.changeState[addedEntity.id]).toBeUndefined(
        'no changes tracked for added entity'
      );
      expect(collection.changeState[updatedEntity.id]).toBeUndefined(
        'no changes tracked for updated entity'
      );
      expect(collection.changeState[deletedEntity.id]).toBeDefined(
        'still tracking deleted entity'
      );
    });
  });

  describe('#trackAddOne', () => {
    it('should return a new collection with tracked new entity', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      const collection = tracker.trackAddOne(addedEntity, origCollection);

      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[addedEntity.id];
      expect(change).toBeDefined('tracking the entity');
      expectChangeType(change, ChangeType.Added);
      expect(change.originalValue).toBeUndefined(
        'no original value for a new entity'
      );
    });

    it('should leave added entity tracked as added when entity is updated', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      let collection = tracker.trackAddOne(addedEntity, origCollection);

      const updatedEntity = { ...addedEntity, name: 'Double Test' };
      collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);
      // simulate the collection update
      collection.entities[addedEntity.id] = updatedEntity;

      const change = collection.changeState[updatedEntity.id];
      expect(change).toBeDefined('is still tracked as an added entity');
      expectChangeType(change, ChangeType.Added);
      expect(change.originalValue).toBeUndefined(
        'still no original value for added entity'
      );
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackAddOne(null, origCollection);
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
      expect(change).toBeUndefined('not tracking the entity');
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
      expect(trackKeys).toEqual(['42', '84'], 'tracking new entities');

      trackKeys.forEach((key, ix) => {
        const change = collection.changeState[key];
        expect(change).toBeDefined(`tracking the entity ${key}`);
        expectChangeType(
          change,
          ChangeType.Added,
          `tracking ${key} as a new entity`
        );
        expect(change.originalValue).toBeUndefined(
          `no original value for new entity ${key}`
        );
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
        existingEntity.id,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the entity');
      expectChangeType(change, ChangeType.Deleted);
      expect(change.originalValue).toBe(
        existingEntity,
        'originalValue is the existing entity'
      );
    });

    it('should return a new collection with tracked "deleted" entity, deleted by key', () => {
      const existingEntity = getFirstExistingEntity();
      const collection = tracker.trackDeleteOne(
        existingEntity.id,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the entity');
      expectChangeType(change, ChangeType.Deleted);
      expect(change.originalValue).toBe(
        existingEntity,
        'originalValue is the existing entity'
      );
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
      expect(change).toBeDefined('tracking the new entity');

      collection = tracker.trackDeleteOne(addedEntity.id, collection);
      change = collection.changeState[addedEntity.id];
      expect(change).not.toBeDefined('is no longer tracking the new entity');
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
      expect(change).toBeDefined('tracking the updated existing entity');
      expectChangeType(change, ChangeType.Updated, 'updated at first');

      collection = tracker.trackDeleteOne(updatedEntity.id, collection);
      change = collection.changeState[updatedEntity.id];
      expect(change).toBeDefined('tracking the deleted, updated entity');
      expectChangeType(change, ChangeType.Deleted, 'after delete');
      expect(change.originalValue).toEqual(
        existingEntity,
        'tracking original value'
      );
    });

    it('should leave deleted entity tracked as deleted when try to update', () => {
      const existingEntity = getFirstExistingEntity();
      let collection = tracker.trackDeleteOne(
        existingEntity.id,
        origCollection
      );

      let change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the deleted entity');
      expectChangeType(change, ChangeType.Deleted);

      // This shouldn't be possible but let's try it.
      const updatedEntity = { ...existingEntity, name: 'Double Test' };
      collection.entities[existingEntity.id] = updatedEntity;

      collection = tracker.trackUpdateOne(toUpdate(updatedEntity), collection);
      change = collection.changeState[updatedEntity.id];
      expect(change).toBeDefined('is still tracked as a deleted entity');
      expectChangeType(change, ChangeType.Deleted);
      expect(change.originalValue).toEqual(
        existingEntity,
        'still tracking original value'
      );
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackDeleteOne(null, origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if called with a key not found', () => {
      const collection = tracker.trackDeleteOne('1234', origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if MergeStrategy.IgnoreChanges', () => {
      const existingEntity = getFirstExistingEntity();
      const collection = tracker.trackDeleteOne(
        existingEntity.id,
        origCollection,
        MergeStrategy.IgnoreChanges
      );
      expect(collection).toBe(origCollection);
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeUndefined('not tracking the entity');
    });
  });

  describe('#trackDeleteMany', () => {
    it('should return a new collection with tracked "deleted" entities', () => {
      const existingEntities = getSomeExistingEntities(2);
      const collection = tracker.trackDeleteMany(
        existingEntities.map(e => e.id),
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      existingEntities.forEach((entity, ix) => {
        const change = collection.changeState[existingEntities[ix].id];
        expect(change).toBeDefined(`tracking entity #${ix}`);
        expectChangeType(change, ChangeType.Deleted, `entity #${ix}`);
        expect(change.originalValue).toBe(
          existingEntities[ix],
          `entity #${ix} originalValue`
        );
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
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the entity');
      expectChangeType(change, ChangeType.Updated);
      expect(change.originalValue).toBe(
        existingEntity,
        'originalValue is the existing entity'
      );
    });

    it('should return a new collection with tracked updated entity, updated by key', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });
      const collection = tracker.trackUpdateOne(updatedEntity, origCollection);
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the entity');
      expectChangeType(change, ChangeType.Updated);
      expect(change.originalValue).toBe(
        existingEntity,
        'originalValue is the existing entity'
      );
    });

    it('should leave updated entity tracked as updated if try to add', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = toUpdate({
        ...existingEntity,
        name: 'test update',
      });
      let collection = tracker.trackUpdateOne(updatedEntity, origCollection);

      let change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the updated entity');
      expectChangeType(change, ChangeType.Updated);

      // This shouldn't be possible but let's try it.
      const addedEntity = { ...existingEntity, name: 'Double Test' };
      collection.entities[existingEntity.id] = addedEntity;

      collection = tracker.trackAddOne(addedEntity, collection);
      change = collection.changeState[addedEntity.id];
      expect(change).toBeDefined('is still tracked as an updated entity');
      expectChangeType(change, ChangeType.Updated);
      expect(change.originalValue).toEqual(
        existingEntity,
        'still tracking original value'
      );
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackUpdateOne(null, origCollection);
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
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeUndefined('not tracking the entity');
    });
  });

  describe('#trackUpdateMany', () => {
    it('should return a new collection with tracked updated entities', () => {
      const existingEntities = getSomeExistingEntities(2);
      const updateEntities = existingEntities.map(e =>
        toUpdate({ ...e, name: e.name + ' updated' })
      );
      const collection = tracker.trackUpdateMany(
        updateEntities,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      existingEntities.forEach((entity, ix) => {
        const change = collection.changeState[existingEntities[ix].id];
        expect(change).toBeDefined(`tracking entity #${ix}`);
        expectChangeType(change, ChangeType.Updated, `entity #${ix}`);
        expect(change.originalValue).toBe(
          existingEntities[ix],
          `entity #${ix} originalValue`
        );
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
      expect(change).toBeDefined('tracking the entity');
      expectChangeType(change, ChangeType.Added);
      expect(change.originalValue).toBeUndefined(
        'no originalValue for added entity'
      );
    });

    it('should return a new collection with tracked updated entity', () => {
      const existingEntity = getFirstExistingEntity();
      const collection = tracker.trackUpsertOne(existingEntity, origCollection);
      expect(collection).not.toBe(origCollection);
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the entity');
      expectChangeType(change, ChangeType.Updated);
      expect(change.originalValue).toBe(
        existingEntity,
        'originalValue is the existing entity'
      );
    });

    it('should not change orig value of updated entity that is updated again', () => {
      const existingEntity = getFirstExistingEntity();
      let collection = tracker.trackUpsertOne(existingEntity, origCollection);

      let change = collection.changeState[existingEntity.id];
      expect(change).toBeDefined('tracking the updated entity');
      expectChangeType(change, ChangeType.Updated, 'first updated');

      const updatedAgainEntity = { ...existingEntity, name: 'Double Test' };

      collection = tracker.trackUpsertOne(updatedAgainEntity, collection);
      change = collection.changeState[updatedAgainEntity.id];
      expect(change).toBeDefined('is still tracked as an updated entity');
      expectChangeType(
        change,
        ChangeType.Updated,
        'still updated after attempted add'
      );
      expect(change.originalValue).toEqual(
        existingEntity,
        'still tracking original value'
      );
    });

    it('should return same collection if called with null entity', () => {
      const collection = tracker.trackUpsertOne(null, origCollection);
      expect(collection).toBe(origCollection);
    });

    it('should return same collection if MergeStrategy.IgnoreChanges', () => {
      const existingEntity = getFirstExistingEntity();
      const updatedEntity = { ...existingEntity, name: 'test update' };
      const collection = tracker.trackUpsertOne(
        updatedEntity,
        origCollection,
        MergeStrategy.IgnoreChanges
      );
      expect(collection).toBe(origCollection);
      const change = collection.changeState[existingEntity.id];
      expect(change).toBeUndefined('not tracking the entity');
    });
  });

  describe('#trackUpsertMany', () => {
    it('should return a new collection with tracked upserted entities', () => {
      const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
      const exitingEntities = getSomeExistingEntities(2);
      const updatedEntities = exitingEntities.map(e => ({
        ...e,
        name: e.name + 'test',
      }));
      const upsertEntities = updatedEntities.concat(addedEntity);
      const collection = tracker.trackUpsertMany(
        upsertEntities,
        origCollection
      );
      expect(collection).not.toBe(origCollection);
      updatedEntities.forEach((entity, ix) => {
        const change = collection.changeState[updatedEntities[ix].id];
        expect(change).toBeDefined(`tracking entity #${ix}`);
        // first two should be updated, the 3rd is added
        expectChangeType(
          change,
          ix === 2 ? ChangeType.Added : ChangeType.Updated,
          `entity #${ix}`
        );
        if (change.changeType === ChangeType.Updated) {
          expect(change.originalValue).toBe(
            exitingEntities[ix],
            `entity #${ix} originalValue`
          );
        } else {
          expect(change.originalValue).toBeUndefined(
            `no originalValue for added entity #${ix}`
          );
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
      expect(Object.keys(collection.changeState).length).toBe(
        3,
        'tracking 3 entities'
      );

      collection = tracker.undoAll(collection);
      expect(Object.keys(collection.changeState).length).toBe(
        0,
        'tracking zero entities'
      );
    });

    it('should restore the collection to the pre-change state', () => {
      // tslint:disable-next-line:prefer-const
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      // Before undo
      expect(collection.entities[addedEntity.id]).toBeDefined(
        'added entity should be present'
      );
      expect(collection.entities[deletedEntity.id]).toBeUndefined(
        'deleted entity should be missing'
      );
      expect(updatedEntity.name).not.toEqual(
        preUpdatedEntity.name,
        'updated entity should be changed'
      );

      collection = tracker.undoAll(collection);

      // After undo
      expect(collection.entities[addedEntity.id]).toBeUndefined(
        'added entity should be removed'
      );
      expect(collection.entities[deletedEntity.id]).toBeDefined(
        'deleted entity should be restored'
      );
      const revertedUpdate = collection.entities[updatedEntity.id];
      expect(revertedUpdate.name).toEqual(
        preUpdatedEntity.name,
        'updated entity should be restored'
      );
    });
  });

  describe('#undoOne', () => {
    it('should restore the collection to the pre-change state for the given entity', () => {
      // tslint:disable-next-line:prefer-const
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      collection = tracker.undoOne(deletedEntity, collection);

      expect(collection.entities[deletedEntity.id]).toBeDefined(
        'deleted entity should be restored'
      );
      expect(collection.entities[addedEntity.id]).toBeDefined(
        'added entity should still be present'
      );
      expect(updatedEntity.name).not.toEqual(
        preUpdatedEntity.name,
        'updated entity should be changed'
      );
    });

    it('should do nothing when the given entity is null', () => {
      // tslint:disable-next-line:prefer-const
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      collection = tracker.undoOne(null, collection);
      expect(collection.entities[addedEntity.id]).toBeDefined(
        'added entity should be present'
      );
      expect(collection.entities[deletedEntity.id]).toBeUndefined(
        'deleted entity should be missing'
      );
      expect(updatedEntity.name).not.toEqual(
        preUpdatedEntity.name,
        'updated entity should be changed'
      );
    });
  });

  describe('#undoMany', () => {
    it('should restore the collection to the pre-change state for the given entities', () => {
      // tslint:disable-next-line:prefer-const
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
      expect(collection.entities[addedEntity.id]).toBeUndefined(
        'added entity should be removed'
      );
      expect(collection.entities[deletedEntity.id]).toBeDefined(
        'deleted entity should be restored'
      );
      const revertedUpdate = collection.entities[updatedEntity.id];
      expect(revertedUpdate.name).toEqual(
        preUpdatedEntity.name,
        'updated entity should be restored'
      );
    });

    it('should do nothing when there are no entities to undo', () => {
      // tslint:disable-next-line:prefer-const
      let {
        collection,
        addedEntity,
        deletedEntity,
        preUpdatedEntity,
        updatedEntity,
      } = createTestTrackedEntities();

      collection = tracker.undoMany([], collection);
      expect(collection.entities[addedEntity.id]).toBeDefined(
        'added entity should be present'
      );
      expect(collection.entities[deletedEntity.id]).toBeUndefined(
        'deleted entity should be missing'
      );
      expect(updatedEntity.name).not.toEqual(
        preUpdatedEntity.name,
        'updated entity should be changed'
      );
    });
  });

  /// helpers ///

  /** Simulate the state of the collection after some test changes */
  function createTestTrackedEntities() {
    const addedEntity = { id: 42, name: 'Ted', power: 'Chatty' };
    const [deletedEntity, preUpdatedEntity] = getSomeExistingEntities(2);
    const updatedEntity = { ...preUpdatedEntity, name: 'Test Me' };

    let collection = tracker.trackAddOne(addedEntity, origCollection);
    collection = tracker.trackDeleteOne(deletedEntity.id, collection);
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
    delete entities[deletedEntity.id];
    collection.entities = entities;
    return {
      collection,
      addedEntity,
      deletedEntity,
      preUpdatedEntity,
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
      ChangeType[expectedChangeType],
      msg
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
    return ids.map(id => origCollection.entities[id]);
  }
});
