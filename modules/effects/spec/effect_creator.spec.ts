import { of } from 'rxjs';
import { createEffect, getCreateEffectMetadata } from '../src/effect_creator';

describe('createEffect()', () => {
  it('should flag the variable with a meta tag', () => {
    const effect = createEffect(() => of({ type: 'a' }));

    expect(effect.hasOwnProperty('__@ngrx/effects_create__')).toBe(true);
  });

  it('should dispatch by default', () => {
    const effect: any = createEffect(() => of({ type: 'a' }));

    expect(effect['__@ngrx/effects_create__']).toEqual(
      jasmine.objectContaining({ dispatch: true })
    );
  });

  it('should be possible to explicitly create a dispatching effect', () => {
    const effect: any = createEffect(() => of({ type: 'a' }), {
      dispatch: true,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      jasmine.objectContaining({ dispatch: true })
    );
  });

  it('should be possible to create a non-dispatching effect', () => {
    const effect: any = createEffect(() => of({ type: 'a' }), {
      dispatch: false,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      jasmine.objectContaining({ dispatch: false })
    );
  });

  it('should be possible to create a non-dispatching effect returning a non-action', () => {
    const effect: any = createEffect(() => of('foo'), {
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
        d = createEffect(() => of({ type: 'd' }), { resubscribeOnError: true });
        e = createEffect(() => of({ type: 'd' }), {
          resubscribeOnError: false,
        });
        f = createEffect(() => of({ type: 'e' }), {
          dispatch: false,
          resubscribeOnError: false,
        });
        g = createEffect(() => of({ type: 'e' }), {
          dispatch: true,
          resubscribeOnError: false,
        });
      }

      const mock = new Fixture();

      expect(getCreateEffectMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true, resubscribeOnError: true },
        { propertyName: 'b', dispatch: true, resubscribeOnError: true },
        { propertyName: 'c', dispatch: false, resubscribeOnError: true },
        { propertyName: 'd', dispatch: true, resubscribeOnError: true },
        { propertyName: 'e', dispatch: true, resubscribeOnError: false },
        { propertyName: 'f', dispatch: false, resubscribeOnError: false },
        { propertyName: 'g', dispatch: true, resubscribeOnError: false },
      ]);
    });

    it('should return an empty array if the effect has not been created with createEffect()', () => {
      const fakeCreateEffect: any = () => {};
      class Fixture {
        a = fakeCreateEffect(() => of({ type: 'A' }));
      }

      const mock = new Fixture();

      expect(getCreateEffectMetadata(mock)).toEqual([]);
    });
  });
});
