import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('EntitySelectors', () => {
  const expectSnippet = expecter(
    (code) => `
        import { Selector } from '@ngrx/store';
        import { EntitySelectors } from './modules/entity/src/models';

        ${code}
      `,
    compilerOptions()
  );

  it('is compatible with a dictionary of selectors', () => {
    expectSnippet(`
      type SelectorsDictionary = Record<
        string,
        | Selector<Record<string, any>, unknown>
        | ((...args: any[]) => Selector<Record<string, any>, unknown>)
      >;
      type ExtendsSelectorsDictionary<T> = T extends SelectorsDictionary
        ? true
        : false;

      let result: ExtendsSelectorsDictionary<
        EntitySelectors<unknown, Record<string, any>>
      >;
    `).toInfer('result', 'true');
  });
}, 8_000);
