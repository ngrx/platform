import { clearCache, setNgrxVersion } from '../../src/utils';
import { RuleTester } from '@typescript-eslint/rule-tester';
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
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: resolve('./modules/eslint-plugin/spec/fixtures'),
        project: './tsconfig.json',
      },
    },
  });
}
