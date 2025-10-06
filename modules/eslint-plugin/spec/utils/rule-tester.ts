import { RuleTester } from '@typescript-eslint/rule-tester';
import { resolve } from 'path';

export function ruleTester() {
  return new RuleTester({
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: resolve('./modules/eslint-plugin/spec/fixtures'),
        project: './tsconfig.json',
      },
    },
  });
}
