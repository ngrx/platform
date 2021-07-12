import { Expect, expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('tapResponse types', () => {
  const snippetFactory = (code: string): string => `
    import { tapResponse } from '@ngrx/component-store';
    import { noop, of } from 'rxjs';

    ${code}
  `;

  function testWith(expectSnippet: (code: string) => Expect): void {
    it('should infer next type', () => {
      expectSnippet(`
        of(1).pipe(
          tapResponse((next) => {
            const num = next;
          }, noop)
        );
      `).toInfer('num', 'number');
    });

    it('should accept error type', () => {
      expectSnippet(`
        of(true).pipe(
          tapResponse(noop, (error: { message: string }) => {
            const err = error;
          })
        );
      `).toInfer('err', '{ message: string; }');
    });

    it('should use unknown as default error type', () => {
      expectSnippet(`
        of(true).pipe(
          tapResponse(noop, (error) => {
            const err = error;
          })
        );
      `).toInfer('err', 'unknown');
    });
  }

  describe('strict mode', () => {
    const expectSnippet = expecter(snippetFactory, {
      ...compilerOptions(),
      strict: true,
    });

    testWith(expectSnippet);
  });

  describe('non-strict mode', () => {
    const expectSnippet = expecter(snippetFactory, {
      ...compilerOptions(),
      strict: false,
    });

    testWith(expectSnippet);
  });

  describe('non-strict mode with strict generic checks', () => {
    const expectSnippet = expecter(snippetFactory, {
      ...compilerOptions(),
      strict: false,
      noStrictGenericChecks: false,
    });

    testWith(expectSnippet);
  });
});
