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
    eds = new EntityDefinitionService(null);
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
    hdef.initialState = undefined; // ZAP!
    const collection = creator.create<Hero, HeroCollection>('Hero');
    expect(collection.foo).toBeUndefined('foo');
    expect(collection.ids).toBeDefined('ids');
  });

  it('should create empty collection even when no def for entity type', () => {
    const collection = creator.create('Bazinga');
    expect(collection.ids).toBeDefined('ids');
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
