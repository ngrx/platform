import { TestBed } from '@angular/core/testing';
import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { IdSelector } from '@ngrx/entity';

import {
  EntityMetadataMap,
  EntityCollectionCreator,
  EntityActionFactory,
  EntityCache,
  EntityCollectionReducerRegistry,
  EntityCacheReducerFactory,
  EntityCollectionReducerMethodsFactory,
  EntityCollectionReducerFactory,
  EntityDefinitionService,
  ENTITY_METADATA_TOKEN,
  EntityOp,
  EntityCollectionReducers,
  EntityCollection,
  EntityAction,
  ENTITY_COLLECTION_META_REDUCERS,
  Logger,
} from '../..';

class Bar {
  id!: number;
  bar!: string;
}
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
describe('EntityCollectionReducerRegistry', () => {
  let collectionCreator: EntityCollectionCreator;
  let entityActionFactory: EntityActionFactory;
  let entityCacheReducer: ActionReducer<EntityCache, Action>;
  let entityCollectionReducerRegistry: EntityCollectionReducerRegistry;
  let logger: jasmine.Spy;

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
  });

  /** Sets the test variables with injected values. Closes TestBed configuration. */
  function setup() {
    collectionCreator = TestBed.inject(EntityCollectionCreator);
    const entityCacheReducerFactory = TestBed.inject(EntityCacheReducerFactory);
    entityCacheReducer = entityCacheReducerFactory.create();
    entityCollectionReducerRegistry = TestBed.inject(
      EntityCollectionReducerRegistry
    );
  }

  describe('#registerReducer', () => {
    beforeEach(setup);

    it('can register a new reducer', () => {
      const reducer = createNoopReducer();
      entityCollectionReducerRegistry.registerReducer('Foo', reducer);
      const action = entityActionFactory.create<Foo>('Foo', EntityOp.ADD_ONE, {
        id: 'forty-two',
        foo: 'fooz',
      });
      // Must initialize the state by hand
      const state = entityCacheReducer({}, action);
      const collection = state['Foo'];
      expect(collection.ids.length).toBe(0);
    });

    it('can replace existing reducer by registering with same name', () => {
      // Just like ADD_ONE test above with default reducer
      // but this time should not add the hero.
      const hero: Hero = { id: 42, name: 'Bobby' };
      const reducer = createNoopReducer();
      entityCollectionReducerRegistry.registerReducer('Hero', reducer);
      const action = entityActionFactory.create<Hero>(
        'Hero',
        EntityOp.ADD_ONE,
        hero
      );
      const state = entityCacheReducer({}, action);
      const collection = state['Hero'];
      expect(collection.ids.length).toBe(0);
    });
  });

  describe('#registerReducers', () => {
    beforeEach(setup);

    it('can register several reducers at the same time.', () => {
      const reducer = createNoopReducer();
      const reducers: EntityCollectionReducers = {
        Foo: reducer,
        Bar: reducer,
      };
      entityCollectionReducerRegistry.registerReducers(reducers);

      const fooAction = entityActionFactory.create<Foo>(
        'Foo',
        EntityOp.ADD_ONE,
        { id: 'forty-two', foo: 'fooz' }
      );
      const barAction = entityActionFactory.create<Bar>(
        'Bar',
        EntityOp.ADD_ONE,
        { id: 84, bar: 'baz' }
      );

      let state = entityCacheReducer({}, fooAction);
      state = entityCacheReducer(state, barAction);

      expect(state['Foo'].ids.length).toBe(0);
      expect(state['Bar'].ids.length).toBe(0);
    });

    it('can register several reducers that may override.', () => {
      const reducer = createNoopReducer();
      const reducers: EntityCollectionReducers = {
        Foo: reducer,
        Hero: reducer,
      };
      entityCollectionReducerRegistry.registerReducers(reducers);

      const fooAction = entityActionFactory.create<Foo>(
        'Foo',
        EntityOp.ADD_ONE,
        { id: 'forty-two', foo: 'fooz' }
      );
      const heroAction = entityActionFactory.create<Hero>(
        'Hero',
        EntityOp.ADD_ONE,
        { id: 84, name: 'Alex' }
      );

      let state = entityCacheReducer({}, fooAction);
      state = entityCacheReducer(state, heroAction);

      expect(state['Foo'].ids.length).toBe(0);
      expect(state['Hero'].ids.length).toBe(0);
    });
  });

  describe('with EntityCollectionMetadataReducers', () => {
    let metaReducerA: MetaReducer<EntityCollection, EntityAction>;
    let metaReducerB: MetaReducer<EntityCollection, EntityAction>;
    let metaReducerOutput: any[];

    // Create MetaReducer that reports how it was called on the way in and out
    function testMetadataReducerFactory(name: string) {
      // Return the MetaReducer
      return (r: ActionReducer<EntityCollection, EntityAction>) => {
        // Return the wrapped reducer
        return (state: EntityCollection, action: EntityAction) => {
          // entered
          metaReducerOutput.push({ metaReducer: name, inOut: 'in', action });
          // called reducer
          const newState = r(state, action);
          // exited
          metaReducerOutput.push({ metaReducer: name, inOut: 'out', action });
          return newState;
        };
      };
    }

    let addOneAction: EntityAction<Hero>;
    let hero: Hero;

    beforeEach(() => {
      metaReducerOutput = [];
      metaReducerA = jasmine
        .createSpy('metaReducerA')
        .and.callFake(testMetadataReducerFactory('A'));
      metaReducerB = jasmine
        .createSpy('metaReducerA')
        .and.callFake(testMetadataReducerFactory('B'));
      const metaReducers = [metaReducerA, metaReducerB];

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
          { provide: ENTITY_COLLECTION_META_REDUCERS, useValue: metaReducers },
          { provide: Logger, useValue: logger },
        ],
      });

      setup();

      hero = { id: 42, name: 'Bobby' };
      addOneAction = entityActionFactory.create<Hero>(
        'Hero',
        EntityOp.ADD_ONE,
        hero
      );
    });

    it('should run inner default reducer as expected', () => {
      const state = entityCacheReducer({}, addOneAction);

      // inner default reducer worked as expected
      const collection = state['Hero'];
      expect(collection.ids.length).toBe(1);
      expect(collection.entities[42]).toEqual(hero);
    });

    it('should call meta reducers for inner default reducer as expected', () => {
      const expected = [
        { metaReducer: 'A', inOut: 'in', action: addOneAction },
        { metaReducer: 'B', inOut: 'in', action: addOneAction },
        { metaReducer: 'B', inOut: 'out', action: addOneAction },
        { metaReducer: 'A', inOut: 'out', action: addOneAction },
      ];

      const state = entityCacheReducer({}, addOneAction);
      expect(metaReducerA).toHaveBeenCalled();
      expect(metaReducerB).toHaveBeenCalled();
      expect(metaReducerOutput).toEqual(expected);
    });

    it('should call meta reducers for custom registered reducer', () => {
      const reducer = createNoopReducer();
      entityCollectionReducerRegistry.registerReducer('Foo', reducer);
      const action = entityActionFactory.create<Foo>('Foo', EntityOp.ADD_ONE, {
        id: 'forty-two',
        foo: 'fooz',
      });

      const state = entityCacheReducer({}, action);
      expect(metaReducerA).toHaveBeenCalled();
      expect(metaReducerB).toHaveBeenCalled();
    });

    it('should call meta reducers for multiple registered reducers', () => {
      const reducer = createNoopReducer();
      const reducers: EntityCollectionReducers = {
        Foo: reducer,
        Hero: reducer,
      };
      entityCollectionReducerRegistry.registerReducers(reducers);

      const fooAction = entityActionFactory.create<Foo>(
        'Foo',
        EntityOp.ADD_ONE,
        { id: 'forty-two', foo: 'fooz' }
      );

      entityCacheReducer({}, fooAction);
      expect(metaReducerA).toHaveBeenCalled();
      expect(metaReducerB).toHaveBeenCalled();

      const heroAction = entityActionFactory.create<Hero>(
        'Hero',
        EntityOp.ADD_ONE,
        { id: 84, name: 'Alex' }
      );

      entityCacheReducer({}, heroAction);
      expect(metaReducerA).toHaveBeenCalledTimes(2);
      expect(metaReducerB).toHaveBeenCalledTimes(2);
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

  function createNoopReducer<T>() {
    return function NoopReducer(
      collection: EntityCollection<T>,
      action: EntityAction
    ): EntityCollection<T> {
      return collection;
    };
  }
  // #endregion helpers
});
