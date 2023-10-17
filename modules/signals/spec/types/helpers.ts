export const compilerOptions = () => ({
  moduleResolution: 'node',
  target: 'ES2022',
  baseUrl: '.',
  experimentalDecorators: true,
  strict: true,
  noImplicitAny: true,
  paths: {
    '@ngrx/signals': ['./modules/signals'],
  },
});
