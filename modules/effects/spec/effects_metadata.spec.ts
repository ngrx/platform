import {
  Effect,
  getEffectsMetadata,
  getSourceMetadata,
  getSourceForInstance,
} from '../src/effects_metadata';

describe('Effect Metadata', () => {
  describe('getSourceMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        @Effect() a: any;
        @Effect() b: any;
        @Effect({ dispatch: false })
        c: any;
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
      ]);
    });

    it('should return an empty array if the class has not been decorated', () => {
      class Fixture {
        a: any;
        b: any;
        c: any;
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([]);
    });

    it('should get the effects metadata for class instance including metadata from parent classes', () => {
      class AbstractFixture {
        @Effect() a: any;
        @Effect() b: any;
        @Effect({ dispatch: false })
        c: any;
      }
      class Fixture extends AbstractFixture {
        d: any;
        e: any;
      }
      class SubFixture extends Fixture {
        @Effect() f: any;
        @Effect({ dispatch: false })
        g: any;
      }

      const mock1 = new AbstractFixture();
      const mock2 = new Fixture();
      const mock3 = new SubFixture();

      expect(getSourceMetadata(mock1)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
      ]);
      expect(getSourceMetadata(mock2)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
      ]);
      expect(getSourceMetadata(mock3)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
        { propertyName: 'f', dispatch: true },
        { propertyName: 'g', dispatch: false },
      ]);
    });
  });

  describe('getSourceProto', () => {
    it('should get the prototype for an instance of a source', () => {
      class Fixture {}
      const instance = new Fixture();

      const proto = getSourceForInstance(instance);

      expect(proto).toBe(Fixture.prototype);
    });
  });

  describe('getEffectsMetadata', () => {
    it('should get map of metadata for all decorated effects in a class instance', () => {
      class Fixture {
        @Effect() a: any;
        @Effect({ dispatch: true })
        b: any;
        @Effect({ dispatch: false })
        c: any;
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        a: { dispatch: true },
        b: { dispatch: true },
        c: { dispatch: false },
      });
    });

    it('should return an empty map if the class has not been decorated', () => {
      class Fixture {
        a: any;
        b: any;
        c: any;
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({});
    });
  });
});
