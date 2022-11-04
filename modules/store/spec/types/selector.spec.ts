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
    it('should require correct arguments by default', () => {
      expectSnippet(`
        const selectTest = createSelector(
            () => 'one',
            () => 2,
            (one, two) => 3
        );
        selectTest.projector();
      `).toFail(/Expected 2 arguments, but got 0./);
    });
    it('should not require parameters for existing explicitly loosely typed selectors', () => {
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

describe('createSelector() with props', () => {
  const expectSnippet = expecter(
    (code) => `
      import {createSelector} from '@ngrx/store';
      import { MemoizedSelectorWithProps, DefaultProjectorFn } from '@ngrx/store';

      ${code}
    `,
    compilerOptions()
  );

  describe('projector', () => {
    it('should require correct arguments by default', () => {
      expectSnippet(`
        const selectTest = createSelector(
            () => 'one',
            () => 2,
            (one, two, props) => 3
        );
        selectTest.projector();
      `).toFail(/Expected 3 arguments, but got 0./);
    });
    it('should not require parameters for existing explicitly loosely typed selectors', () => {
      expectSnippet(`
        const selectTest: MemoizedSelectorWithProps<
          unknown,
          number,
          any,
          DefaultProjectorFn<number>
        > = createSelector(
          () => 'one',
          () => 2,
          (one, two, props) => 3
        );
        selectTest.projector();
      `).toSucceed();
    });
  });
});
