import {
  Effect,
  effectMetadata,
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
  });

  describe('getSourceProto', () => {
    it('should get the prototype for an instance of a source', () => {
      class Fixture {}
      const instance = new Fixture();

      const proto = getSourceForInstance(instance);

      expect(proto).toBe(Fixture.prototype);
    });
  });

  describe('effectMetadata', () => {
    it('should get the effect metadata for a class instance with known effect name', () => {
      class Fixture {
        @Effect() a$: any;
        @Effect({ dispatch: true })
        b$: any;
        @Effect({ dispatch: false })
        c$: any;
      }

      const mock = new Fixture();

      expect(effectMetadata(mock, 'a$')).toEqual({ dispatch: true });
      expect(effectMetadata(mock, 'b$')).toEqual({ dispatch: true });
      expect(effectMetadata(mock, 'c$')).toEqual({ dispatch: false });
    });

    it('should return "undefined" if the effect has not been decorated', () => {
      class Fixture {
        a$: any;
      }

      const mock = new Fixture();

      expect(effectMetadata(mock, 'a$')).toBeUndefined();
    });
  });
});
