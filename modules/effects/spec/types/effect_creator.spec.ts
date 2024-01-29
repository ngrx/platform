import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('createEffect()', () => {
  const expectSnippet = expecter(
    (code) => `
      import { Action } from '@ngrx/store';
      import { createEffect } from '@ngrx/effects';
      import { createAction } from '@ngrx/store';
      import { of } from 'rxjs';

      ${code}`,
    compilerOptions()
  );

  describe('dispatch: true', () => {
    it('should enforce an Action return value', () => {
      expectSnippet(`
        const effect = createEffect(() => of({ type: 'a' }));
      `).toSucceed();

      expectSnippet(`
        const effect = createEffect(() => of({ foo: 'a' }));
      `).toFail(
        /Type 'Observable<{ foo: string; }>' is not assignable to type 'EffectResult<Action<string>>'./
      );
    });

    it('should help with action creator that is not called', () => {
      // Action creator is called with parentheses.
      expectSnippet(`
      const action = createAction('action without props');
      const effect = createEffect(() => of(action()));
      `).toSucceed();

      // Action creator is not called (no parentheses).
      expectSnippet(`
      const action = createAction('action without props');
      const effect = createEffect(() => of(action));
      `).toFail(
        /ActionCreator cannot be dispatched. Did you forget to call the action creator function/
      );
    });

    it('should enforce an Action return value when dispatch is provided', () => {
      expectSnippet(`
        const effect = createEffect(() => of({ type: 'a' }), { dispatch: true });
      `).toSucceed();

      expectSnippet(`
        const effect = createEffect(() => of({ foo: 'a' }), { dispatch: true });
      `).toFail(
        /Type 'Observable<{ foo: string; }>' is not assignable to type 'EffectResult<Action<string>>'./
      );
    });

    it('should create non-functional effect when functional is set to false', () => {
      const snippet = expectSnippet(`
        const effect1 = createEffect(
          () => of({ type: 'a' }),
          { functional: false }
        );

        const effect2 = createEffect(
          () => of({ type: 'a' }),
          // explicitly set dispatch: true
          { functional: false, dispatch: true }
        );
      `);

      snippet.toInfer(
        'effect1',
        'Observable<{ type: string; }> & CreateEffectMetadata'
      );
      snippet.toInfer(
        'effect2',
        'Observable<{ type: string; }> & CreateEffectMetadata'
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
        /Type '{ foo: string; }' is not assignable to type 'EffectResult<unknown>'./
      );
    });

    it('should allow action creator even if it is not called', () => {
      // Action creator is not called (no parentheses), but we have no-dispatch.
      expectSnippet(`
      const action = createAction('action without props');
      const effect = createEffect(() => of(action), { dispatch: false });
      `).toSucceed();
    });

    it('should create non-functional effect when functional is set to false', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of('a'),
          { functional: false, dispatch: false }
        );
      `).toInfer('effect', 'Observable<string> & CreateEffectMetadata');
    });
  });

  describe('functional: true', () => {
    it('should create dispatching effect without args', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of({ type: 'a' }),
          { functional: true }
        );
      `).toInfer(
        'effect',
        'FunctionalEffect<() => Observable<{ type: string; }>>'
      );
    });

    it('should create dispatching effect with args', () => {
      expectSnippet(`
        const effect = createEffect(
          (type = 'a', x = 1, y = 2) => of({ type, x, y }),
          { functional: true }
        );
      `).toInfer(
        'effect',
        'FunctionalEffect<(type?: string, x?: number, y?: number) => Observable<{ type: string; x: number; y: number; }>>'
      );
    });

    it('should create dispatching effect when dispatch is set to true', () => {
      expectSnippet(`
        const effect = createEffect(
          ({ type = 'a' } = {}) => of({ type }),
          { functional: true, dispatch: true }
        );
      `).toInfer(
        'effect',
        'FunctionalEffect<({ type }?: { type?: string; }) => Observable<{ type: string; }>>'
      );
    });

    it('should create non-dispatching effect that returns action', () => {
      expectSnippet(`
        const effect = createEffect(
          (type = 'a') => of({ type }),
          { functional: true, dispatch: false }
        );
      `).toInfer(
        'effect',
        'FunctionalEffect<(type?: string) => Observable<{ type: string; }>>'
      );
    });

    it('should create non-dispatching effect that returns any observable', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of('ngrx'),
          { functional: true, dispatch: false }
        );
      `).toInfer('effect', 'FunctionalEffect<() => Observable<string>>');
    });

    it('should create non-dispatching effect that returns action creator', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of(createAction('a')),
          { functional: true, dispatch: false }
        );
      `).toInfer(
        'effect',
        'FunctionalEffect<() => Observable<ActionCreator<"a", () => Action<"a">>>>'
      );
    });

    it('should be possible to invoke dispatching effect without args as function', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of({ type: 'a' }),
          { functional: true }
        );
        effect();

        let effectArgs: Parameters<typeof effect>;
      `).toInfer('effectArgs', '[]');
    });

    it('should be possible to invoke dispatching effect with args as function', () => {
      expectSnippet(`
        const effect = createEffect(
          (type = 'a', payload = 'b') => of({ type, payload }),
          { functional: true }
        );
        effect();
        effect('m');
        effect('m', 's');

        let effectArgs: Parameters<typeof effect>;
      `).toInfer('effectArgs', '[type?: string, payload?: string]');
    });

    it('should be possible to invoke non-dispatching effect without args as function', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of('a'),
          { functional: true, dispatch: false }
        );
        effect();

        let effectArgs: Parameters<typeof effect>;
      `).toInfer('effectArgs', '[]');
    });

    it('should be possible to invoke non-dispatching effect with args as function', () => {
      expectSnippet(`
        const effect = createEffect(
          ({ a = 1, b = 2 } = {}) => of([a, b]),
          { functional: true, dispatch: false }
        );
        effect();
        effect({});
        effect({ a: 10 });
        effect({ b: 20 });
        effect({ a: 100, b: 200 });

        let effectArgs: Parameters<typeof effect>;
      `).toInfer('effectArgs', '[{ a?: number; b?: number; }?]');
    });

    it('should fail when dispatching effect arguments do not have default values', () => {
      expectSnippet(`
        const effect = createEffect(
          (type: string) => of({ type }),
          { functional: true }
        );
      `).toFail();
    });

    it('should fail when non-dispatching effect arguments do not have default values', () => {
      expectSnippet(`
        const effect = createEffect(
          (x: number, y: number) => of([x, y]),
          { functional: true, dispatch: false }
        );
      `).toFail();
    });

    it('should fail when additional properties are added to the effect config', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of({ type: 'a' }),
          { functional: true, x: 1, y: 2 }
        );
      `).toFail();
    });

    it('should fail when Observable<Action> is not returned as dispatching effect result', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of({ type: 123 }),
          { functional: true }
        );
      `).toFail();

      expectSnippet(`
        const effect = createEffect(
          () => of(123),
          { functional: true, dispatch: true }
        );
      `).toFail();

      expectSnippet(`
        const effect = createEffect(
          () => 123,
          { functional: true }
        );
      `).toFail();
    });

    it('should fail when action creator is returned as dispatching effect result', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of(createAction('a')),
          { functional: true }
        );
      `).toFail(
        /ActionCreator cannot be dispatched. Did you forget to call the action creator function/
      );

      expectSnippet(`
        const effect = createEffect(
          () => of(createAction('a')),
          { functional: true, dispatch: true }
        );
      `).toFail(
        /ActionCreator cannot be dispatched. Did you forget to call the action creator function/
      );
    });
  });
});
