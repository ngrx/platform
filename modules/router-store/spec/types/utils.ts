export const compilerOptions = () => ({
  moduleResolution: 'node',
  target: 'ES2022',
  baseUrl: '.',
  experimentalDecorators: true,
  paths: {
    '@ngrx/store': ['./modules/store'],
    '@ngrx/router-store': ['./modules/router-store'],
  },
});
