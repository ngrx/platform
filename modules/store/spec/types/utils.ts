export const compilerOptions = () => ({
  moduleResolution: 'node',
  target: 'es2017',
  baseUrl: '.',
  experimentalDecorators: true,
  paths: {
    '@ngrx/store': ['./modules/store'],
  },
});
