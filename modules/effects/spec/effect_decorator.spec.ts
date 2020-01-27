import { Effect, getEffectDecoratorMetadata } from '../src/effect_decorator';

describe('@Effect()', () => {
  describe('getEffectDecoratorMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        @Effect() a: any;
        @Effect({ dispatch: true })
        b: any;
        @Effect({ dispatch: false })
        c: any;
        @Effect({ useEffectsErrorHandler: true })
        d: any;
        @Effect({ useEffectsErrorHandler: false })
        e: any;
        @Effect({ dispatch: false, useEffectsErrorHandler: false })
        f: any;
        @Effect({ dispatch: true, useEffectsErrorHandler: false })
        g: any;
      }

      const mock = new Fixture();

      expect(getEffectDecoratorMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'b', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'c', dispatch: false, useEffectsErrorHandler: true },
        { propertyName: 'd', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'e', dispatch: true, useEffectsErrorHandler: false },
        { propertyName: 'f', dispatch: false, useEffectsErrorHandler: false },
        { propertyName: 'g', dispatch: true, useEffectsErrorHandler: false },
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
