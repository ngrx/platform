import { getEffectsMetadata, getSourceMetadata } from '../src/effects_metadata';
import { of } from 'rxjs';
import { createEffect } from '..';
import { EffectMetadata } from '../src/models';

describe('Effects metadata', () => {
  describe('getSourceMetadata', () => {
    it('should create metadata for createEffect', () => {
      class Fixture {
        effectSimple = createEffect(() => of({ type: 'a' }));
        effectNoDispatch = createEffect(() => of({ type: 'a' }), {
          dispatch: false,
        });
        noEffect: any;
        effectWithMethod = createEffect(() => () => of({ type: 'a' }));
        effectWithUseEffectsErrorHandler = createEffect(
          () => () => of({ type: 'a' }),
          {
            dispatch: true,
            useEffectsErrorHandler: false,
          }
        );
      }

      const mock = new Fixture();
      const expected: EffectMetadata<Fixture>[] = [
        {
          propertyName: 'effectSimple',
          dispatch: true,
          useEffectsErrorHandler: true,
        },
        {
          propertyName: 'effectNoDispatch',
          dispatch: false,
          useEffectsErrorHandler: true,
        },
        {
          propertyName: 'effectWithMethod',
          dispatch: true,
          useEffectsErrorHandler: true,
        },
        {
          propertyName: 'effectWithUseEffectsErrorHandler',
          dispatch: true,
          useEffectsErrorHandler: false,
        },
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
        effectSimple = createEffect(() => of({ type: 'a' }));
        effectNoDispatch = createEffect(() => of({ type: 'a' }), {
          dispatch: false,
        });
        noEffect: any;
        effectWithMethod = createEffect(() => () => of({ type: 'a' }));
        effectWithUseEffectsErrorHandler = createEffect(
          () => () => of({ type: 'a' }),
          {
            dispatch: true,
            useEffectsErrorHandler: false,
          }
        );
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        effectSimple: {
          dispatch: true,
          useEffectsErrorHandler: true,
        },
        effectNoDispatch: {
          dispatch: false,
          useEffectsErrorHandler: true,
        },
        effectWithMethod: {
          dispatch: true,
          useEffectsErrorHandler: true,
        },
        effectWithUseEffectsErrorHandler: {
          dispatch: true,
          useEffectsErrorHandler: false,
        },
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
