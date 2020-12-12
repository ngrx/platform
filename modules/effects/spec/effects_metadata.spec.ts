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
        @Effect({ dispatch: false, useEffectsErrorHandler: false })
        e: any;
        z: any;
        f = createEffect(() => () => of({ type: 'a' }));
        g = createEffect(() => () => of({ type: 'a' }), { dispatch: false });
        h = createEffect(() => () => of({ type: 'a' }), {
          dispatch: true,
          useEffectsErrorHandler: false,
        });
      }

      const mock = new Fixture();
      const expected: EffectMetadata<Fixture>[] = [
        { propertyName: 'a', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'c', dispatch: false, useEffectsErrorHandler: true },
        { propertyName: 'b', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'd', dispatch: false, useEffectsErrorHandler: true },
        { propertyName: 'e', dispatch: false, useEffectsErrorHandler: false },
        { propertyName: 'f', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'g', dispatch: false, useEffectsErrorHandler: true },
        { propertyName: 'h', dispatch: true, useEffectsErrorHandler: false },
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
          useEffectsErrorHandler: false,
        });
        h = createEffect(() => () => of({ type: 'a' }));
        j = createEffect(() => () => of({ type: 'a' }), { dispatch: false });
        k = createEffect(() => () => of({ type: 'a' }), {
          dispatch: true,
          useEffectsErrorHandler: false,
        });
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        a: { dispatch: true, useEffectsErrorHandler: true },
        c: { dispatch: true, useEffectsErrorHandler: true },
        e: { dispatch: false, useEffectsErrorHandler: true },
        b: { dispatch: true, useEffectsErrorHandler: true },
        d: { dispatch: true, useEffectsErrorHandler: true },
        f: { dispatch: false, useEffectsErrorHandler: true },
        g: { dispatch: true, useEffectsErrorHandler: false },
        h: { dispatch: true, useEffectsErrorHandler: true },
        j: { dispatch: false, useEffectsErrorHandler: true },
        k: { dispatch: true, useEffectsErrorHandler: false },
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
