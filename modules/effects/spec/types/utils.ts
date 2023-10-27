export const compilerOptions = () => ({
  moduleResolution: 'node',
  target: 'ES2022',
  baseUrl: '.',
  experimentalDecorators: true,
  paths: {
    '@ngrx/store': ['./modules/store'],
    '@ngrx/effects': ['./modules/effects'],
    '@ngrx/operators': ['./modules/operators'],
    rxjs: ['../npm/node_modules/rxjs', './node_modules/rxjs'],
  },
});
