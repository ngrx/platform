import { forkJoin, of, firstValueFrom } from 'rxjs';
import { createEffect, getCreateEffectMetadata } from '../src/effect_creator';

describe('createEffect()', () => {
  it('should flag the variable with a meta tag', () => {
    const effect = createEffect(() => of({ type: 'a' }));

    expect(effect.hasOwnProperty('__@ngrx/effects_create__')).toBe(true);
  });

  it('should dispatch by default', () => {
    const effect = createEffect(() => of({ type: 'a' }));

    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ dispatch: true })
    );
  });

  it('should be possible to explicitly create a dispatching effect', () => {
    const effect = createEffect(() => of({ type: 'a' }), {
      dispatch: true,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ dispatch: true })
    );
  });

  it('should be possible to create a non-dispatching effect', () => {
    const effect = createEffect(() => of({ someProp: 'a' }), {
      dispatch: false,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ dispatch: false })
    );
  });

  it('should be possible to create a non-dispatching effect returning a non-action', () => {
    const effect = createEffect(() => of('foo'), {
      dispatch: false,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ dispatch: false })
    );
  });

  it('should create a non-functional effect by default', () => {
    const obs$ = of({ type: 'a' });
    const effect = createEffect(() => obs$);

    expect(effect).toBe(obs$);
    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ functional: false })
    );
  });

  it('should be possible to explicitly create a non-functional effect', () => {
    const obs$ = of({ type: 'a' });
    const effect = createEffect(() => obs$, { functional: false });

    expect(effect).toBe(obs$);
    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ functional: false })
    );
  });

  it('should be possible to create a functional effect', () => {
    const source = () => of({ type: 'a' });
    const effect = createEffect(source, { functional: true });

    expect(effect).toBe(source);
    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ functional: true })
    );
  });

  it('should be possible to invoke functional effect as function', async () => {
    const sum = createEffect((x = 10, y = 20) => of(x + y), {
      functional: true,
      dispatch: false,
    });

    const [defaultResult, result] = await firstValueFrom(
      forkJoin([sum(), sum(100, 200)])
    );

    expect(defaultResult).toBe(30);
    expect(result).toBe(300);
  });

  it('should use effects error handler by default', () => {
    const effect = createEffect(() => of({ type: 'a' }));

    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ useEffectsErrorHandler: true })
    );
  });

  it('should be possible to explicitly create an effect with error handler', () => {
    const effect = createEffect(() => of({ type: 'a' }), {
      useEffectsErrorHandler: true,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ useEffectsErrorHandler: true })
    );
  });

  it('should be possible to create an effect without error handler', () => {
    const effect = createEffect(() => of({ type: 'a' }), {
      useEffectsErrorHandler: false,
    });

    expect(effect['__@ngrx/effects_create__']).toEqual(
      expect.objectContaining({ useEffectsErrorHandler: false })
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
          functional: false,
        });
        e = createEffect(() => of({ type: 'd' }), {
          useEffectsErrorHandler: false,
          functional: true,
        });
        f = createEffect(() => of({ type: 'e' }), {
          dispatch: false,
          functional: true,
          useEffectsErrorHandler: false,
        });
        g = createEffect(() => of({ type: 'e' }), {
          dispatch: true,
          useEffectsErrorHandler: false,
        });
      }

      const mock = new Fixture();

      expect(getCreateEffectMetadata(mock)).toEqual([
        {
          propertyName: 'a',
          dispatch: true,
          functional: false,
          useEffectsErrorHandler: true,
        },
        {
          propertyName: 'b',
          dispatch: true,
          functional: false,
          useEffectsErrorHandler: true,
        },
        {
          propertyName: 'c',
          dispatch: false,
          functional: false,
          useEffectsErrorHandler: true,
        },
        {
          propertyName: 'd',
          dispatch: true,
          functional: false,
          useEffectsErrorHandler: true,
        },
        {
          propertyName: 'e',
          dispatch: true,
          functional: true,
          useEffectsErrorHandler: false,
        },
        {
          propertyName: 'f',
          dispatch: false,
          functional: true,
          useEffectsErrorHandler: false,
        },
        {
          propertyName: 'g',
          dispatch: true,
          functional: false,
          useEffectsErrorHandler: false,
        },
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
