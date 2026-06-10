export const compilerOptions = () => ({
  module: 'preserve',
  moduleResolution: 'bundler',
  target: 'ES2022',
  baseUrl: '.',
  ignoreDeprecations: '6.0',
  experimentalDecorators: true,
  paths: {
    '@ngrx/operators': ['./modules/operators'],
  },
});
