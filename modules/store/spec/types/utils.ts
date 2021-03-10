export const compilerOptions = () => ({
  moduleResolution: 'node',
  target: 'es5',
  baseUrl: '.',
  experimentalDecorators: true,
  paths: {
    '@ngrx/store': ['./modules/store'],
  },
});
