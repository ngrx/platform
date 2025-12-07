export const compilerOptions = () => ({
  module: 'preserve',
  moduleResolution: 'bundler',
  target: 'ES2022',
  baseUrl: '.',
  experimentalDecorators: true,
  strict: true,
  paths: {
    '@ngrx/entity': ['./modules/entity'],
    '@ngrx/store': ['./modules/store'],
  },
});
