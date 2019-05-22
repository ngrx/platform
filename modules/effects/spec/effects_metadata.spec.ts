import { getEffectsMetadata, getSourceMetadata } from '../src/effects_metadata';
import { of } from 'rxjs';
import { Effect, createEffect } from '..';
import { EffectMetadata } from '../src/models';

describe('Effects metadata', () => {
  describe('getSourceMetadata', () => {
    it('should combine effects created by the effect decorator and by createEffect', () => {
      class Fixture {
        @Effect() a: any;
        b = createEffect(() => of({ type: 'a' }));
        @Effect({ dispatch: false })
        c: any;
        d = createEffect(() => of({ type: 'a' }), { dispatch: false });
        @Effect({ dispatch: false, resubscribeOnError: false })
        e: any;
        z: any;
      }

      const mock = new Fixture();
      const expected: EffectMetadata<Fixture>[] = [
        { propertyName: 'a', dispatch: true, resubscribeOnError: true },
        { propertyName: 'c', dispatch: false, resubscribeOnError: true },
        { propertyName: 'b', dispatch: true, resubscribeOnError: true },
        { propertyName: 'd', dispatch: false, resubscribeOnError: true },
        { propertyName: 'e', dispatch: false, resubscribeOnError: false },
      ];

      expect(getSourceMetadata(mock)).toEqual(
        jasmine.arrayContaining(expected)
      );
      expect(getSourceMetadata(mock).length).toEqual(expected.length);
    });
  });

  describe('getEffectsMetadata', () => {
    it('should get map of metadata for all effects created', () => {
      class Fixture {
        @Effect() a: any;
        b = createEffect(() => of({ type: 'd' }));
        @Effect({ dispatch: true })
        c: any;
        d = createEffect(() => of({ type: 'e' }), { dispatch: true });
        @Effect({ dispatch: false })
        e: any;
        f = createEffect(() => of({ type: 'f' }), { dispatch: false });
        g = createEffect(() => of({ type: 'g' }), {
          resubscribeOnError: false,
        });
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        a: { dispatch: true, resubscribeOnError: true },
        c: { dispatch: true, resubscribeOnError: true },
        e: { dispatch: false, resubscribeOnError: true },
        b: { dispatch: true, resubscribeOnError: true },
        d: { dispatch: true, resubscribeOnError: true },
        f: { dispatch: false, resubscribeOnError: true },
        g: { dispatch: true, resubscribeOnError: false },
      });
    });

    it('should return an empty map if the class does not have effects', () => {
      const fakeCreateEffect: any = () => {};
      class Fixture {
        a: any;
        b = fakeCreateEffect(() => of({ type: 'a' }));
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({});
    });
  });
});
