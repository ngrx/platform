import { of } from 'rxjs';
import { createEffect, getCreateEffectMetadata } from '../src/effect_creator';

describe('createEffect()', () => {
  it('should flag the variable with a meta tag', () => {
    const effect = createEffect(() => of({ type: 'a' }));

    expect(effect.hasOwnProperty('__@ngrx/effects_create__')).toBe(true);
  });

  it('should dispatch by default', () => {
    const effect: any = createEffect(() => of({ type: 'a' }));

    expect(effect['__@ngrx/effects_create__']).toEqual({ dispatch: true });
  });

  it('should be possible to explicitly create a dispatching effect', () => {
    const effect: any = createEffect(() => of({ type: 'a' }), {
      dispatch: true,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual({ dispatch: true });
  });

  it('should be possible to create a non-dispatching effect', () => {
    const effect: any = createEffect(() => of({ type: 'a' }), {
      dispatch: false,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual({ dispatch: false });
  });

  describe('getCreateEffectMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        a = createEffect(() => of({ type: 'a' }));
        b = createEffect(() => of({ type: 'b' }), { dispatch: true });
        c = createEffect(() => of({ type: 'c' }), { dispatch: false });
      }

      const mock = new Fixture();

      expect(getCreateEffectMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
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
