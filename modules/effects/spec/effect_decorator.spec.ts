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
        @Effect({ resubscribeOnError: true })
        d: any;
        @Effect({ resubscribeOnError: false })
        e: any;
        @Effect({ dispatch: false, resubscribeOnError: false })
        f: any;
        @Effect({ dispatch: true, resubscribeOnError: false })
        g: any;
      }

      const mock = new Fixture();

      expect(getEffectDecoratorMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true, resubscribeOnError: true },
        { propertyName: 'b', dispatch: true, resubscribeOnError: true },
        { propertyName: 'c', dispatch: false, resubscribeOnError: true },
        { propertyName: 'd', dispatch: true, resubscribeOnError: true },
        { propertyName: 'e', dispatch: true, resubscribeOnError: false },
        { propertyName: 'f', dispatch: false, resubscribeOnError: false },
        { propertyName: 'g', dispatch: true, resubscribeOnError: false },
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
