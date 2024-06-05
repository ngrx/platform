import { clearCache, setNgrxVersion } from '../../src/utils';
import { RuleTester } from '@angular-eslint/test-utils';
import { resolve } from 'path';

export function ruleTester(environment?: {
  ngrxModule: string;
  version: string;
}) {
  clearCache();

  if (environment) {
    setNgrxVersion(environment.ngrxModule, environment.version);
  }

  return new RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      tsconfigRootDir: resolve('./modules/eslint-plugin/spec/fixtures'),
      project: './tsconfig.json',
    },
  });
}
