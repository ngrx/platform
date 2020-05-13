export const compilerOptions = () => ({
  moduleResolution: 'node',
  target: 'es2017',
  baseUrl: '.',
  experimentalDecorators: true,
  paths: {
    '@ngrx/store': ['./modules/store'],
    '@ngrx/effects': ['./modules/effects'],
    rxjs: ['../npm/node_modules/rxjs', './node_modules/rxjs'],
  },
});
