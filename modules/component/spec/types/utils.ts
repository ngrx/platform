import { expecter } from 'ts-snippet';

export const compilerOptions = () => ({
  module: 'preserve',
  moduleResolution: 'bundler',
  baseUrl: '.',
  experimentalDecorators: true,
  strict: true,
  paths: {
    '@ngrx/component': ['./modules/component'],
  },
});

export function potentialObservableExpecter(
  snippetFactory: (potentialObservableType: string) => string
) {
  if (!snippetFactory('').includes('const value')) {
    throw new Error('Snippet must include a constant named `value`!');
  }

  return (potentialObservableType: string, typeDefinition = '') => {
    const expectSnippet = expecter(
      () => `${typeDefinition} ${snippetFactory(potentialObservableType)}`,
      compilerOptions()
    );

    return {
      toBeInferredAs(valueType: string): void {
        expectSnippet(potentialObservableType).toInfer('value', valueType);
      },
    };
  };
}
