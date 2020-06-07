import { MemoizedSelector } from '@ngrx/store';
import {
  EntityMetadata,
  EntitySelectorsFactory,
  EntityCollection,
  createEmptyEntityCollection,
  PropsFilterFnFactory,
  EntitySelectors,
} from '../../';

describe('EntitySelectors', () => {
  /** HeroMetadata identifies the extra collection state properties */
  const heroMetadata: EntityMetadata<Hero> = {
    entityName: 'Hero',
    filterFn: nameFilter,
    additionalCollectionState: {
      foo: 'Foo',
      bar: 3.14,
    },
  };

  const villainMetadata: EntityMetadata<Villain> = {
    entityName: 'Villain',
    selectId: (villain) => villain.key,
  };

  let collectionCreator: any;
  let entitySelectorsFactory: EntitySelectorsFactory;

  beforeEach(() => {
    collectionCreator = {
      create: jasmine.createSpy('create'),
    };
    entitySelectorsFactory = new EntitySelectorsFactory(collectionCreator);
  });

  describe('#createCollectionSelector', () => {
    const initialState = createHeroState({
      ids: [1],
      entities: { 1: { id: 1, name: 'A' } },
      foo: 'foo foo',
      bar: 42,
    });

    it('creates collection selector that defaults to initial state', () => {
      collectionCreator.create.and.returnValue(initialState);
      const selectors = entitySelectorsFactory.createCollectionSelector<
        Hero,
        HeroCollection
      >('Hero');
      const state = { entityCache: {} }; // ngrx store with empty cache
      const collection = selectors(state);
      expect(collection.entities).toEqual(initialState.entities);
      expect(collection.foo).toEqual('foo foo');
      expect(collectionCreator.create).toHaveBeenCalled();
    });

    it('collection selector should return cached collection when it exists', () => {
      // must specify type-args when initialState isn't available for type inference
      const selectors = entitySelectorsFactory.createCollectionSelector<
        Hero,
        HeroCollection
      >('Hero');

      // ngrx store with populated Hero collection
      const state = {
        entityCache: {
          Hero: {
            ids: [42],
            entities: { 42: { id: 42, name: 'The Answer' } },
            filter: '',
            loading: true,
            foo: 'towel',
            bar: 0,
          },
        },
      };

      const collection = selectors(state);
      expect(collection.entities[42]).toEqual({ id: 42, name: 'The Answer' });
      expect(collection.foo).toBe('towel');
      expect(collectionCreator.create).not.toHaveBeenCalled();
    });
  });

  describe('#createEntitySelectors', () => {
    let heroCollection: HeroCollection;
    let heroEntities: Hero[];

    beforeEach(() => {
      heroEntities = [
        { id: 42, name: 'A' },
        { id: 48, name: 'B' },
      ];

      heroCollection = <HeroCollection>(<any>{
        ids: [42, 48],
        entities: {
          42: heroEntities[0],
          48: heroEntities[1],
        },
        filter: 'B',
        foo: 'Foo',
      });
    });

    it('should have expected Hero selectors (a super-set of EntitySelectors)', () => {
      const store = { entityCache: { Hero: heroCollection } };

      const selectors = entitySelectorsFactory.create<Hero, HeroSelectors>(
        heroMetadata
      );

      expect(selectors.selectEntities).toBeDefined();
      expect(selectors.selectEntities(store)).toEqual(heroEntities);

      expect(selectors.selectFilteredEntities(store)).toEqual(
        heroEntities.filter((h) => h.name === 'B')
      );

      expect(selectors.selectFoo).toBeDefined();
      expect(selectors.selectFoo(store)).toBe('Foo');
    });

    it('should have all Hero when create EntitySelectorFactory directly', () => {
      const store = { entityCache: { Hero: heroCollection } };

      // Create EntitySelectorFactory directly rather than injecting it!
      // Works ONLY if have not changed the name of the EntityCache.
      // In this case, where also not supplying the EntityCollectionCreator
      // selector for additional collection properties might fail,
      // but doesn't in this test because the additional Foo property is in the store.

      const eaFactory = new EntitySelectorsFactory();
      const selectors = eaFactory.create<Hero, HeroSelectors>(heroMetadata);

      expect(selectors.selectEntities).toBeDefined();
      expect(selectors.selectEntities(store)).toEqual(heroEntities);

      expect(selectors.selectFilteredEntities(store)).toEqual(
        heroEntities.filter((h) => h.name === 'B')
      );

      expect(selectors.selectFoo).toBeDefined();
      expect(selectors.selectFoo(store)).toBe('Foo');
    });

    it('should create default selectors (no filter, no extras) when create with "Hero" instead of hero metadata', () => {
      const store = { entityCache: { Hero: heroCollection } };

      // const selectors = entitySelectorsFactory.create<Hero, HeroSelectors>('Hero');
      // There won't be extra selectors so type selectors for Hero collection only
      const selectors = entitySelectorsFactory.create<Hero>('Hero');
      expect(selectors.selectEntities).toBeDefined();
      expect(selectors.selectFoo).not.toBeDefined();
      expect(selectors.selectFilteredEntities(store)).toEqual(heroEntities);
    });

    it('should have expected Villain selectors', () => {
      const collection = <EntityCollection<Villain>>(<any>{
        ids: [24],
        entities: { 24: { key: 'evil', name: 'A' } },
        filter: 'B', // doesn't matter because no filter function
      });
      const store = { entityCache: { Villain: collection } };

      const selectors = entitySelectorsFactory.create<Villain>(villainMetadata);
      const expectedEntities: Villain[] = [{ key: 'evil', name: 'A' }];

      expect(selectors.selectEntities).toBeDefined();
      expect(selectors.selectEntities(store)).toEqual(expectedEntities);

      expect(selectors.selectFilteredEntities(store)).toEqual(expectedEntities);
    });
  });
});

/////// Test values and helpers /////////

function createHeroState(state: Partial<HeroCollection>): HeroCollection {
  return {
    ...createEmptyEntityCollection<Hero>('Hero'),
    ...state,
  } as HeroCollection;
}

function nameFilter<T>(entities: T[], pattern: string) {
  return PropsFilterFnFactory<any>(['name'])(entities, pattern);
}

/// Hero
interface Hero {
  id: number;
  name: string;
}

/** HeroCollection is EntityCollection<Hero> with extra collection properties */
interface HeroCollection extends EntityCollection<Hero> {
  foo: string;
  bar: number;
}

/** HeroSelectors identifies the extra selectors for the extra collection properties */
interface HeroSelectors extends EntitySelectors<Hero> {
  selectFoo: MemoizedSelector<Object, string>;
  selectBar: MemoizedSelector<Object, number>;
}

/// Villain
interface Villain {
  key: string;
  name: string;
}
