import { RuleTester } from '@typescript-eslint/rule-tester';
import { resolve } from 'path';

export function ruleTester(requiresTypeChecking?: boolean) {
  const languageOptions =
    (requiresTypeChecking ?? false)
      ? {
          parserOptions: {
            tsconfigRootDir: resolve('./modules/eslint-plugin/spec/fixtures'),
            project: './tsconfig.json',
          },
        }
      : undefined;
  return new RuleTester({
    languageOptions,
  });
}
