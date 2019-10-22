export const compilerOptions = () => ({
  moduleResolution: 'node',
  target: 'es2015',
  baseUrl: '.',
  paths: {
    '@ngrx/store': ['./modules/store'],
  },
});
