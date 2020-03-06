import {
  EntityMetadata,
  EntityCollectionCreator,
  EntityDefinitionService,
  createEntityDefinition,
  EntityCollection,
} from '../..';

/** HeroMetadata identifies extra collection state properties */
const heroMetadata: EntityMetadata<Hero> = {
  entityName: 'Hero',
  additionalCollectionState: {
    foo: 'Foo',
    bar: 3.14,
  },
};

describe('EntityCollectionCreator', () => {
  let creator: EntityCollectionCreator;
  let eds: EntityDefinitionService;

  beforeEach(() => {
    eds = new EntityDefinitionService(null as any);
    const hdef = createEntityDefinition(heroMetadata);
    hdef.initialState.filter = 'super';
    eds.registerDefinition(hdef);

    creator = new EntityCollectionCreator(eds);
  });

  it('should create collection with the definitions initial state', () => {
    const collection = creator.create<Hero, HeroCollection>('Hero');
    expect(collection.foo).toBe('Foo');
    expect(collection.filter).toBe('super');
  });

  it('should create empty collection even when no initial state', () => {
    const hdef = eds.getDefinition('Hero');
    hdef.initialState = undefined as any; // ZAP!
    const collection = creator.create<Hero, HeroCollection>('Hero');
    expect(collection.foo).toBeUndefined();
    expect(collection.ids).toBeDefined();
  });

  it('should create empty collection even when no def for entity type', () => {
    const collection = creator.create('Bazinga');
    expect(collection.ids).toBeDefined();
  });
});

/////// Test values and helpers /////////

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
