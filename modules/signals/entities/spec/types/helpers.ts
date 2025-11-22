export const compilerOptions = () => ({
  module: 'preserve',
  moduleResolution: 'bundler',
  target: 'ES2022',
  baseUrl: '.',
  experimentalDecorators: true,
  strict: true,
  noImplicitAny: true,
  paths: {
    '@ngrx/signals': ['./modules/signals'],
    '@ngrx/signals/entities': ['./modules/signals/entities'],
  },
});
