import {
  Effect,
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

    it('should get the effects metadata for a downleveled class instance', () => {
      class Fixture {
        static get propDecorators() {
          return {
            a: [{ type: Effect, args: [{ dispatch: false }] }],
            b: [{ type: Effect, args: [] }],
          };
        }
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: false },
        { propertyName: 'b', dispatch: true },
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
});
