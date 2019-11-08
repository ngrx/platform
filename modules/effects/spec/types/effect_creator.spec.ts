import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('createEffect()', () => {
  const expectSnippet = expecter(
    code => `
      import { Action } from '@ngrx/store';
      import { createEffect } from '@ngrx/effects';
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
