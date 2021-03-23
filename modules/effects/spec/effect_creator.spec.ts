import { of } from 'rxjs';
import { createEffect, getCreateEffectMetadata } from '../src/effect_creator';

describe('createEffect()', () => {
  it('should flag the variable with a meta tag', () => {
    const effect = createEffect(() => of({ type: 'a' }));

    expect(effect.hasOwnProperty('__@ngrx/effects_create__')).toBe(true);
  });

  it('should dispatch by default', () => {
    const effect = createEffect(() => of({ type: 'a' }));

    expect(effect['__@ngrx/effects_create__']).toEqual(
      jasmine.objectContaining({ dispatch: true })
    );
  });

  it('should be possible to explicitly create a dispatching effect', () => {
    const effect = createEffect(() => of({ type: 'a' }), {
      dispatch: true,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      jasmine.objectContaining({ dispatch: true })
    );
  });

  it('should be possible to create a non-dispatching effect', () => {
    const effect = createEffect(() => of({ someProp: 'a' }), {
      dispatch: false,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      jasmine.objectContaining({ dispatch: false })
    );
  });

  it('should be possible to create a non-dispatching effect returning a non-action', () => {
    const effect = createEffect(() => of('foo'), {
      dispatch: false,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      jasmine.objectContaining({ dispatch: false })
    );
  });

  describe('getCreateEffectMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        a = createEffect(() => of({ type: 'a' }));
        b = createEffect(() => of({ type: 'b' }), { dispatch: true });
        c = createEffect(() => of({ type: 'c' }), { dispatch: false });
        d = createEffect(() => of({ type: 'd' }), {
          useEffectsErrorHandler: true,
        });
        e = createEffect(() => of({ type: 'd' }), {
          useEffectsErrorHandler: false,
        });
        f = createEffect(() => of({ type: 'e' }), {
          dispatch: false,
          useEffectsErrorHandler: false,
        });
        g = createEffect(() => of({ type: 'e' }), {
          dispatch: true,
          useEffectsErrorHandler: false,
        });
      }

      const mock = new Fixture();

      expect(getCreateEffectMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'b', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'c', dispatch: false, useEffectsErrorHandler: true },
        { propertyName: 'd', dispatch: true, useEffectsErrorHandler: true },
        { propertyName: 'e', dispatch: true, useEffectsErrorHandler: false },
        { propertyName: 'f', dispatch: false, useEffectsErrorHandler: false },
        { propertyName: 'g', dispatch: true, useEffectsErrorHandler: false },
      ]);
    });

    it('should return an empty array if the effect has not been created with createEffect()', () => {
      const fakeCreateEffect: any = () => {};
      class Fixture {
        a = fakeCreateEffect(() => of({ type: 'A' }));
        b = new Proxy(
          {},
          {
            get(_, prop) {
              return () => Promise.resolve('bob');
            },
          }
        );
      }

      const mock = new Fixture();

      expect(getCreateEffectMetadata(mock)).toEqual([]);
    });
  });
});
