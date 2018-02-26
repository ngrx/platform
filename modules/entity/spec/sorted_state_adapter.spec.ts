import {
  EntityStateAdapter,
  EntityState,
  Update,
  SelectedId,
  SelectedIds,
} from '../src/models';
import { createEntityAdapter } from '../src/create_adapter';
import {
  BookModel,
  TheGreatGatsby,
  AClockworkOrange,
  AnimalFarm,
} from './fixtures/book';

describe('Sorted State Adapter', () => {
  let adapter: EntityStateAdapter<BookModel>;
  let state: EntityState<BookModel>;

  beforeAll(() => {
    Object.defineProperty(Array.prototype, 'unwantedField', {
      enumerable: true,
      configurable: true,
      value: 'This should not appear anywhere',
    });
  });

  afterAll(() => {
    Object.defineProperty(Array.prototype, 'unwantedField', {
      value: undefined,
    });
  });

  beforeEach(() => {
    adapter = createEntityAdapter({
      selectId: (book: BookModel) => book.id,
      sortComparer: (a, b) => a.title.localeCompare(b.title),
    });

    state = { ids: [], entities: {}, selectedIds: new Set<SelectedId>() };
  });

  it('should let you add one entity to the state', () => {
    const withOneEntity = adapter.addOne(TheGreatGatsby, state);

    expect(withOneEntity).toEqual({
      ids: [TheGreatGatsby.id],
      entities: {
        [TheGreatGatsby.id]: TheGreatGatsby,
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should not change state if you attempt to re-add an entity', () => {
    const withOneEntity = adapter.addOne(TheGreatGatsby, state);

    const readded = adapter.addOne(TheGreatGatsby, withOneEntity);

    expect(readded).toBe(withOneEntity);
  });

  it('should let you add many entities to the state', () => {
    const withOneEntity = adapter.addOne(TheGreatGatsby, state);
    const withManyMore = adapter.addMany(
      [AClockworkOrange, AnimalFarm],
      withOneEntity
    );

    expect(withManyMore).toEqual({
      ids: [AClockworkOrange.id, AnimalFarm.id, TheGreatGatsby.id],
      entities: {
        [TheGreatGatsby.id]: TheGreatGatsby,
        [AClockworkOrange.id]: AClockworkOrange,
        [AnimalFarm.id]: AnimalFarm,
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you add all entities to the state', () => {
    const withOneEntity = adapter.addOne(TheGreatGatsby, state);

    const withAll = adapter.addAll(
      [AClockworkOrange, AnimalFarm],
      withOneEntity
    );

    expect(withAll).toEqual({
      ids: [AClockworkOrange.id, AnimalFarm.id],
      entities: {
        [AClockworkOrange.id]: AClockworkOrange,
        [AnimalFarm.id]: AnimalFarm,
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you add remove an entity from the state', () => {
    const withOneEntity = adapter.addOne(TheGreatGatsby, state);

    const withoutOne = adapter.removeOne(TheGreatGatsby.id, state);

    expect(withoutOne).toEqual({
      ids: [],
      entities: {},
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you remove many entities from the state', () => {
    const withAll = adapter.addAll(
      [TheGreatGatsby, AClockworkOrange, AnimalFarm],
      state
    );

    const withoutMany = adapter.removeMany(
      [TheGreatGatsby.id, AClockworkOrange.id],
      withAll
    );

    expect(withoutMany).toEqual({
      ids: [AnimalFarm.id],
      entities: {
        [AnimalFarm.id]: AnimalFarm,
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you remove all entities from the state', () => {
    const withAll = adapter.addAll(
      [TheGreatGatsby, AClockworkOrange, AnimalFarm],
      state
    );

    const withoutAll = adapter.removeAll(withAll);

    expect(withoutAll).toEqual({
      ids: [],
      entities: {},
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you update an entity in the state', () => {
    const withOne = adapter.addOne(TheGreatGatsby, state);
    const changes = { title: 'A New Hope' };

    const withUpdates = adapter.updateOne(
      {
        id: TheGreatGatsby.id,
        changes,
      },
      withOne
    );

    expect(withUpdates).toEqual({
      ids: [TheGreatGatsby.id],
      entities: {
        [TheGreatGatsby.id]: {
          ...TheGreatGatsby,
          ...changes,
        },
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should not change state if you attempt to update an entity that has not been added', () => {
    const withUpdates = adapter.updateOne(
      {
        id: TheGreatGatsby.id,
        changes: { title: 'A New Title' },
      },
      state
    );

    expect(withUpdates).toBe(state);
  });

  it('should not change ids state if you attempt to update an entity that does not impact sorting', () => {
    const withAll = adapter.addAll(
      [TheGreatGatsby, AClockworkOrange, AnimalFarm],
      state
    );
    const changes = { title: 'The Great Gatsby II' };

    const withUpdates = adapter.updateOne(
      {
        id: TheGreatGatsby.id,
        changes,
      },
      withAll
    );

    expect(withAll.ids).toBe(withUpdates.ids);
  });

  it('should let you update the id of entity', () => {
    const withOne = adapter.addOne(TheGreatGatsby, state);
    const changes = { id: 'A New Id' };

    const withUpdates = adapter.updateOne(
      {
        id: TheGreatGatsby.id,
        changes,
      },
      withOne
    );

    expect(withUpdates).toEqual({
      ids: [changes.id],
      entities: {
        [changes.id]: {
          ...TheGreatGatsby,
          ...changes,
        },
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should resort correctly if same id but sort key update', () => {
    const withAll = adapter.addAll(
      [TheGreatGatsby, AnimalFarm, AClockworkOrange],
      state
    );
    const changes = { title: 'A New Hope' };

    const withUpdates = adapter.updateOne(
      {
        id: TheGreatGatsby.id,
        changes,
      },
      withAll
    );

    expect(withUpdates).toEqual({
      ids: [AClockworkOrange.id, TheGreatGatsby.id, AnimalFarm.id],
      entities: {
        [AClockworkOrange.id]: AClockworkOrange,
        [TheGreatGatsby.id]: {
          ...TheGreatGatsby,
          ...changes,
        },
        [AnimalFarm.id]: AnimalFarm,
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should resort correctly if the id and sort key update', () => {
    const withOne = adapter.addAll(
      [TheGreatGatsby, AnimalFarm, AClockworkOrange],
      state
    );
    const changes = { id: 'A New Id', title: AnimalFarm.title };

    const withUpdates = adapter.updateOne(
      {
        id: TheGreatGatsby.id,
        changes,
      },
      withOne
    );

    expect(withUpdates).toEqual({
      ids: [AClockworkOrange.id, changes.id, AnimalFarm.id],
      entities: {
        [AClockworkOrange.id]: AClockworkOrange,
        [changes.id]: {
          ...TheGreatGatsby,
          ...changes,
        },
        [AnimalFarm.id]: AnimalFarm,
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you update many entities in the state', () => {
    const firstChange = { title: 'Zack' };
    const secondChange = { title: 'Aaron' };
    const withMany = adapter.addAll([TheGreatGatsby, AClockworkOrange], state);

    const withUpdates = adapter.updateMany(
      [
        { id: TheGreatGatsby.id, changes: firstChange },
        { id: AClockworkOrange.id, changes: secondChange },
      ],
      withMany
    );

    expect(withUpdates).toEqual({
      ids: [AClockworkOrange.id, TheGreatGatsby.id],
      entities: {
        [TheGreatGatsby.id]: {
          ...TheGreatGatsby,
          ...firstChange,
        },
        [AClockworkOrange.id]: {
          ...AClockworkOrange,
          ...secondChange,
        },
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you add one entity to the state with upsert()', () => {
    const withOneEntity = adapter.upsertOne(
      {
        id: TheGreatGatsby.id,
        changes: TheGreatGatsby,
      },
      state
    );

    expect(withOneEntity).toEqual({
      ids: [TheGreatGatsby.id],
      entities: {
        [TheGreatGatsby.id]: TheGreatGatsby,
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you update an entity in the state with upsert()', () => {
    const withOne = adapter.addOne(TheGreatGatsby, state);
    const changes = { title: 'A New Hope' };

    const withUpdates = adapter.upsertOne(
      {
        id: TheGreatGatsby.id,
        changes,
      },
      withOne
    );

    expect(withUpdates).toEqual({
      ids: [TheGreatGatsby.id],
      entities: {
        [TheGreatGatsby.id]: {
          ...TheGreatGatsby,
          ...changes,
        },
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you upsert many entities in the state', () => {
    const firstChange = { title: 'Zack' };
    const secondChange = { title: 'Aaron' };
    const withMany = adapter.addAll([TheGreatGatsby], state);

    const withUpserts = adapter.upsertMany(
      [
        { id: TheGreatGatsby.id, changes: firstChange },
        { id: AClockworkOrange.id, changes: secondChange },
      ],
      withMany
    );

    expect(withUpserts).toEqual({
      ids: [AClockworkOrange.id, TheGreatGatsby.id],
      entities: {
        [TheGreatGatsby.id]: {
          ...TheGreatGatsby,
          ...firstChange,
        },
        [AClockworkOrange.id]: {
          ...AClockworkOrange,
          ...secondChange,
        },
      },
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you select all entities in the state', () => {
    const withAddAll = adapter.addAll([TheGreatGatsby], state);
    const withSelectAll = adapter.selectAll(withAddAll);

    expect(withSelectAll).toEqual({
      ...withAddAll,
      selectedIds: new Set<SelectedId>(<string[]>withAddAll.ids),
    });
  });

  it('should let you unSelect all entities in the state', () => {
    const withAddAll = adapter.addAll([TheGreatGatsby], state);
    const withSelectAll = adapter.unSelectAll(withAddAll);

    expect(withSelectAll).toEqual({
      ...withAddAll,
      selectedIds: new Set<SelectedId>(),
    });
  });

  it('should let you select one entity in the state', () => {
    const withAddAll = adapter.addAll([TheGreatGatsby], state);
    const selectedId: SelectedId = withAddAll.ids[0];
    const withSelectOne = adapter.selectOne(selectedId, withAddAll);
    expect(withSelectOne.selectedIds.has(selectedId)).toBeTruthy();
  });

  it('should let you unSelect one entity in the state', () => {
    const withAddAll = adapter.addAll([AnimalFarm, TheGreatGatsby], state);
    const withSelectAll = adapter.selectAll(withAddAll);
    const selectedId: SelectedId = withSelectAll.ids[0];
    const withUnSelectOne = adapter.unSelectOne(selectedId, withAddAll);
    expect(withUnSelectOne.selectedIds.has(selectedId)).toBeFalsy();
  });

  it('should let you select many entities in the state', () => {
    const withAddAll = adapter.addAll(
      [AnimalFarm, TheGreatGatsby, AClockworkOrange],
      state
    );
    const [id1, id2]: SelectedIds = withAddAll.ids;
    const withSelectMany = adapter.selectMany([id1, id2], withAddAll);
    expect(
      withSelectMany.selectedIds.has(id1) && withSelectMany.selectedIds.has(id2)
    ).toBeTruthy();
  });

  it('should let you unSelect many entities in the state', () => {
    const withAddAll = adapter.addAll([AnimalFarm, TheGreatGatsby], state);
    const withSelectAll = adapter.selectAll(withAddAll);
    const [id1, id2]: SelectedIds = withSelectAll.ids;
    const withUnSelectMany = adapter.unSelectMany([id1, id2], withAddAll);
    expect(withUnSelectMany.selectedIds.has(id1)).toBeFalsy();
    expect(withUnSelectMany.selectedIds.has(id2)).toBeFalsy();
  });

  it('should let you SelectOnly entities in the state', () => {
    const withAddAll = adapter.addAll(
      [AnimalFarm, TheGreatGatsby, AClockworkOrange],
      state
    );
    const withSelectAll = adapter.selectAll(withAddAll);
    const [id1, id2]: SelectedIds = withSelectAll.ids;
    const withUnSelectMany = adapter.selectOnly([id2], withSelectAll);
    expect(Array.from(withUnSelectMany.selectedIds.values())).toEqual([id2]);
  });
});
