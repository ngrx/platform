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
        /Type 'Observable<{ foo: string; }>' is not assignable to type 'EffectResult<Action>'./
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
        /Type 'Observable<{ foo: string; }>' is not assignable to type 'EffectResult<Action>'./
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
  });
});
