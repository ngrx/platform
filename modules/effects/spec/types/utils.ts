export const compilerOptions = () => ({
  module: 'preserve',
  moduleResolution: 'bundler',
  target: 'ES2022',
  baseUrl: '.',
  ignoreDeprecations: '6.0',
  experimentalDecorators: true,
  paths: {
    '@ngrx/store': ['./modules/store'],
    '@ngrx/effects': ['./modules/effects'],
    '@ngrx/operators': ['./modules/operators'],
    rxjs: ['../npm/node_modules/rxjs', './node_modules/rxjs'],
  },
});
