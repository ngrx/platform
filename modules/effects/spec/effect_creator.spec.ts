import { of } from 'rxjs';
import { expecter } from 'ts-snippet';
import { createEffect, getCreateEffectMetadata } from '../src/effect_creator';

describe('createEffect()', () => {
  describe('types', () => {
    const expectSnippet = expecter(
      code => `
        import { Action } from '@ngrx/store';
        import { createEffect } from '@ngrx/effects';
        import { of } from 'rxjs';
        ${code}`,
      {
        moduleResolution: 'node',
        target: 'es2015',
        baseUrl: '.',
        experimentalDecorators: true,
        paths: {
          '@ngrx/store': ['./modules/store'],
          '@ngrx/effects': ['./modules/effects'],
          rxjs: ['../npm/node_modules/rxjs', './node_modules/rxjs'],
        },
      }
    );

    describe('dispatch: true', () => {
      it('should enforce an Action return value', () => {
        expectSnippet(`
          const effect = createEffect(() => of({ type: 'a' }));
        `).toSucceed();

        expectSnippet(`
          const effect = createEffect(() => of({ foo: 'a' }));
        `).toFail(
          /Type 'Observable<{ foo: string; }>' is not assignable to type 'Observable<Action> | ((...args: any[]) => Observable<Action>)'./
        );
      });

      it('should enforce an Action return value when dispatch is provided', () => {
        expectSnippet(`
          const effect = createEffect(() => of({ type: 'a' }), { dispatch: true });
        `).toSucceed();

        expectSnippet(`
          const effect = createEffect(() => of({ foo: 'a' }), { dispatch: true });
        `).toFail(
          /Type 'Observable<{ foo: string; }>' is not assignable to type 'Observable<Action> | ((...args: any[]) => Observable<Action>)'./
        );
      });
    });

    describe('dispatch: false', () => {
      it('should enforce an Observable return value', () => {
        expectSnippet(`
          const effect = createEffect(() => of({ foo: 'a' }), { dispatch: false });
        `).toSucceed();

        expectSnippet(`
          const effect = createEffect(() => ({ foo: 'a' }), { dispatch: false });
        `).toFail(
          /Type '{ foo: string; }' is not assignable to type 'Observable<unknown> | ((...args: any[]) => Observable<unknown>)'./
        );
      });
    });
  });

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
