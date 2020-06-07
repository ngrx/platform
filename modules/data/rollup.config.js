export default {
  entry: './dist/data/@ngrx/data.es5.js',
  dest: './dist/data/bundles/data.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.data',
  globals: {
    '@ngrx/store': 'ngrx.store',
    '@ngrx/effects': 'ngrx.effects',
    '@ngrx/entity': 'ngrx.entity',
  },
};
