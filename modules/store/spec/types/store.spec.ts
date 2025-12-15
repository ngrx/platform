import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('Store', () => {
  const expectSnippet = expecter(
    (code) => `
      import { Store, createAction, props } from '@ngrx/store';
      import { inject, signal } from '@angular/core';

      const load = createAction('load');
      const incrementer = createAction('increment', props<{value: number}>());

      const value = signal(1);

      const store = inject(Store);
      const fooAction = createAction('foo')

      ${code}
    `,
    compilerOptions()
  );

  describe('compilation fails', () => {
    const assertCompilationFailure = (code: string) =>
      expectSnippet(code).toFail(
        /is not assignable to type '"Action creator is not allowed to be dispatched. Did you forget to call it/
      );

    it('does not allow dispatching action creators without props', () => {
      assertCompilationFailure('store.dispatch(load);');
    });

    it('does not allow dispatching action creators with props', () => {
      assertCompilationFailure('store.dispatch(incrementer);');
    });
  });

  describe('compilation succeeds', () => {
    const assertCompilationSuccess = (code: string) =>
      expectSnippet(code).toSucceed();

    it('allows dispatching actions without props', () => {
      assertCompilationSuccess('store.dispatch(load());');
    });

    it('allows dispatching actions with props', () => {
      assertCompilationSuccess('store.dispatch(incrementer({ value: 1 }));');
    });

    it('allows dispatching a function returning an action without props', () => {
      assertCompilationSuccess('store.dispatch(() => load());');
    });

    it('allows dispatching a function returning an action with props ', () => {
      assertCompilationSuccess(
        'store.dispatch(() => incrementer({ value: value() }));'
      );
    });
  });
}, 8_000);
