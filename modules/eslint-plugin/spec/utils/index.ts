import { TSESLint } from '@typescript-eslint/experimental-utils';
import { resolve } from 'path';
import { clearCache, setNgrxVersion } from '../../src/utils';

export function ruleTester(environment?: {
  ngrxModule: string;
  version: string;
}) {
  clearCache();

  if (environment) {
    setNgrxVersion(environment.ngrxModule, environment.version);
  }

  return new TSESLint.RuleTester({
    parser: resolve('./node_modules/@typescript-eslint/parser'),
    parserOptions: {
      project: resolve('./modules/eslint-plugin/spec/tsconfig.json'),
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  });
}
