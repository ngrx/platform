import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  createEntityDefinition,
  EntityDefinitionService,
  EntityMetadataMap,
  ENTITY_METADATA_TOKEN,
} from '../..';

@NgModule({})
class LazyModule {
  lazyMetadataMap = {
    Sidekick: {},
  };

  constructor(entityDefinitionService: EntityDefinitionService) {
    entityDefinitionService.registerMetadataMap(this.lazyMetadataMap);
  }
}

describe('EntityDefinitionService', () => {
  let service: EntityDefinitionService;
  let metadataMap: EntityMetadataMap;

  beforeEach(() => {
    metadataMap = {
      Hero: {},
      Villain: {},
    };

    TestBed.configureTestingModule({
      // Not actually lazy but demonstrates a module that registers metadata
      imports: [LazyModule],
      providers: [
        EntityDefinitionService,
        { provide: ENTITY_METADATA_TOKEN, multi: true, useValue: metadataMap },
      ],
    });
    service = TestBed.inject(EntityDefinitionService);
  });

  describe('#getDefinition', () => {
    it('returns definition for known entity', () => {
      const def = service.getDefinition('Hero');
      expect(def).toBeDefined();
    });

    it('throws if request definition for unknown entity', () => {
      expect(() => service.getDefinition('Foo')).toThrowError(/no entity/i);
    });

    it('returns undefined if request definition for unknown entity and `shouldThrow` is false', () => {
      const def = service.getDefinition('foo', /* shouldThrow */ false);
      expect(def).not.toBeDefined();
    });
  });

  describe('#registerMetadata(Map)', () => {
    it('can register a new definition by metadata', () => {
      service.registerMetadata({ entityName: 'Foo' });

      let def = service.getDefinition('Foo');
      expect(def).toBeDefined();
      // Hero is still defined after registering Foo
      def = service.getDefinition('Hero');
      expect(def).toBeDefined();
    });

    it('can register new definitions by metadata map', () => {
      service.registerMetadataMap({
        Foo: {},
        Bar: {},
      });

      let def = service.getDefinition('Foo');
      expect(def).toBeDefined();
      def = service.getDefinition('Bar');
      expect(def).toBeDefined();
      def = service.getDefinition('Hero');
      expect(def).toBeDefined();
    });

    it('entityName property should trump map key', () => {
      service.registerMetadataMap({
        1: { entityName: 'Foo' }, // key and entityName differ
      });

      let def = service.getDefinition('Foo');
      expect(def).toBeDefined();
      def = service.getDefinition('Hero');
      expect(def).toBeDefined();
    });

    it('a (lazy-loaded) module can register metadata with its constructor', () => {
      // The `Sidekick` metadata are registered by LazyModule's ctor
      // Although LazyModule is actually eagerly-loaded in this test,
      // the registration technique is the important thing.
      const def = service.getDefinition('Sidekick');
      expect(def).toBeDefined();
    });
  });

  describe('#registerDefinition(s)', () => {
    it('can register a new definition', () => {
      const newDef = createEntityDefinition({ entityName: 'Foo' });
      service.registerDefinition(newDef);

      let def = service.getDefinition('Foo');
      expect(def).toBeDefined();
      // Hero is still defined after registering Foo
      def = service.getDefinition('Hero');
      expect(def).toBeDefined();
    });

    it('can register a map of several definitions', () => {
      const newDefMap = {
        Foo: createEntityDefinition({ entityName: 'Foo' }),
        Bar: createEntityDefinition({ entityName: 'Bar' }),
      };
      service.registerDefinitions(newDefMap);

      let def = service.getDefinition('Foo');
      expect(def).toBeDefined();
      def = service.getDefinition('Bar');
      expect(def).toBeDefined();
      def = service.getDefinition('Hero');
      expect(def).toBeDefined();
    });

    it('can re-register an existing definition', () => {
      const testSelectId = (entity: any) => 'test-id';
      const newDef = createEntityDefinition({
        entityName: 'Hero',
        selectId: testSelectId,
      });
      service.registerDefinition(newDef);

      const def = service.getDefinition('Hero');
      expect(def).toBeDefined();
      expect(def.selectId).toBe(testSelectId);
    });
  });
});
