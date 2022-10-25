import { getEffectsMetadata, getSourceMetadata } from '../src/effects_metadata';
import { of } from 'rxjs';
import { createEffect } from '..';
import { EffectMetadata } from '../src/models';

describe('Effects metadata', () => {
  describe('getSourceMetadata', () => {
    it('should combine effects created by the effect decorator and by createEffect', () => {
      class Fixture {
        b = createEffect(() => of({ type: 'a' }));
        d = createEffect(() => of({ type: 'a' }), { dispatch: false });
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
        { propertyName: 'b', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'd', dispatch: false, useEffectsErrorHandler: true },
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
        b = createEffect(() => of({ type: 'd' }));
        d = createEffect(() => of({ type: 'e' }), { dispatch: true });
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
