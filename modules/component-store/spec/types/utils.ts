export const compilerOptions = () => ({
  module: 'preserve',
  moduleResolution: 'bundler',
  target: 'ES2022',
  baseUrl: '.',
  experimentalDecorators: true,
  paths: {
    '@ngrx/component-store': ['./modules/component-store'],
    '@ngrx/operators': ['./modules/operators'],
  },
});
