import { Effect, getEffectDecoratorMetadata } from '../src/effect_decorator';

describe('@Effect()', () => {
  describe('getEffectDecoratorMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        @Effect() a: any;
        @Effect() b: any;
        @Effect({ dispatch: false })
        c: any;
      }

      const mock = new Fixture();

      expect(getEffectDecoratorMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
      ]);
    });

    it('should return an empty array if the class has not been decorated', () => {
      class Fixture {
        a: any;
      }

      const mock = new Fixture();

      expect(getEffectDecoratorMetadata(mock)).toEqual([]);
    });
  });
});
