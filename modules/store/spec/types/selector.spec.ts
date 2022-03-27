import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('createSelector()', () => {
  const expectSnippet = expecter(
    (code) => `
      import {createSelector} from '@ngrx/store';
      import { MemoizedSelector, DefaultProjectorFn } from '@ngrx/store';

      ${code}
    `,
    compilerOptions()
  );

  describe('projector', () => {
    it('should require parameters when strictness enabled', () => {
      expectSnippet(`
        const selectTest = createSelector(
            () => 'one',
            () => 2,
            (one, two) => 3
        );
        selectTest.projector<'strict'>();
      `).toFail(/Expected 2 arguments, but got 0./);
    });
    it('should not require parameters when strictness not enabled', () => {
      expectSnippet(`
        const selectTest = createSelector(
            () => 'one',
            () => 2,
            (one, two) => 3
        );
        selectTest.projector();
      `).toSucceed();
    });
    it('should succeed for existing explicitly typed selectors', () => {
      expectSnippet(`
        const selectTest: MemoizedSelector<
          unknown,
          number,
          DefaultProjectorFn<number>
        > = createSelector(
          () => 'one',
          () => 2,
          (one, two) => 3
        );
        selectTest.projector();
      `).toSucceed();
    });
  });
});
