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
    it('accepts Action return value', () => {
      expectSnippet(`
        const effect = createEffect(() => of({ type: 'a' }));
      `).toSucceed();
    });

    it('rejects non-Action return value', () => {
      expectSnippet(`
        const effect = createEffect(() => of({ foo: 'a' }));
      `).toFail(
        /Type 'Observable<{ foo: string; }>' is not assignable to type 'EffectResult<Action<string>>'./
      );
    });

    it('accepts called action creator', () => {
      expectSnippet(`
      const action = createAction('action without props');
      const effect = createEffect(() => of(action()));
      `).toSucceed();
    });

    it('rejects uncalled action creator', () => {
      expectSnippet(`
      const action = createAction('action without props');
      const effect = createEffect(() => of(action));
      `).toFail(
        /ActionCreator cannot be dispatched. Did you forget to call the action creator function/
      );
    });

    it('accepts Action return value when dispatch is provided', () => {
      expectSnippet(`
        const effect = createEffect(() => of({ type: 'a' }), { dispatch: true });
      `).toSucceed();
    });

    it('rejects non-Action return value when dispatch is provided', () => {
      expectSnippet(`
        const effect = createEffect(() => of({ foo: 'a' }), { dispatch: true });
      `).toFail(
        /Type 'Observable<{ foo: string; }>' is not assignable to type 'EffectResult<Action<string>>'./
      );
    });

    it('creates non-functional effect when functional is false', () => {
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
    it('accepts Observable return value', () => {
      expectSnippet(`
        const effect = createEffect(() => of({ foo: 'a' }), { dispatch: false });
      `).toSucceed();
    });

    it('rejects non-Observable return value', () => {
      expectSnippet(`
        const effect = createEffect(() => ({ foo: 'a' }), { dispatch: false });
      `).toFail(
        /Type '{ foo: string; }' is not assignable to type 'EffectResult<unknown>'./
      );
    });

    it('allows uncalled action creator', () => {
      expectSnippet(`
      const action = createAction('action without props');
      const effect = createEffect(() => of(action), { dispatch: false });
      `).toSucceed();
    });

    it('creates non-functional effect when functional is false', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of('a'),
          { functional: false, dispatch: false }
        );
      `).toInfer('effect', 'Observable<string> & CreateEffectMetadata');
    });
  });

  describe('functional: true', () => {
    it('creates dispatching effect without args', () => {
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

    it('creates dispatching effect with args', () => {
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

    it('creates dispatching effect when dispatch is true', () => {
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

    it('creates non-dispatching effect that returns action', () => {
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

    it('creates non-dispatching effect that returns any observable', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of('ngrx'),
          { functional: true, dispatch: false }
        );
      `).toInfer('effect', 'FunctionalEffect<() => Observable<string>>');
    });

    it('creates non-dispatching effect that returns action creator', () => {
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

    it('invokes dispatching effect without args as function', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of({ type: 'a' }),
          { functional: true }
        );
        effect();

        let effectArgs: Parameters<typeof effect>;
      `).toInfer('effectArgs', '[]');
    });

    it('invokes dispatching effect with args as function', () => {
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

    it('invokes non-dispatching effect without args as function', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of('a'),
          { functional: true, dispatch: false }
        );
        effect();

        let effectArgs: Parameters<typeof effect>;
      `).toInfer('effectArgs', '[]');
    });

    it('invokes non-dispatching effect with args as function', () => {
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

    it('fails when dispatching effect arguments do not have default values', () => {
      expectSnippet(`
        const effect = createEffect(
          (type: string) => of({ type }),
          { functional: true }
        );
      `).toFail();
    });

    it('fails when non-dispatching effect arguments do not have default values', () => {
      expectSnippet(`
        const effect = createEffect(
          (x: number, y: number) => of([x, y]),
          { functional: true, dispatch: false }
        );
      `).toFail();
    });

    it('fails when additional properties are added to effect config', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of({ type: 'a' }),
          { functional: true, x: 1, y: 2 }
        );
      `).toFail();
    });

    it('fails when Observable<Action> is not returned with type as number', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of({ type: 123 }),
          { functional: true }
        );
      `).toFail();
    });

    it('fails when Observable<Action> is not returned with number value', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of(123),
          { functional: true, dispatch: true }
        );
      `).toFail();
    });

    it('fails when non-Observable is returned', () => {
      expectSnippet(`
        const effect = createEffect(
          () => 123,
          { functional: true }
        );
      `).toFail();
    });

    it('fails when action creator is returned without dispatch config', () => {
      expectSnippet(`
        const effect = createEffect(
          () => of(createAction('a')),
          { functional: true }
        );
      `).toFail(
        /ActionCreator cannot be dispatched. Did you forget to call the action creator function/
      );
    });

    it('fails when action creator is returned with dispatch true', () => {
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
}, 8_000);
