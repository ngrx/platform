export default {
  entry: './dist/entity/@ngrx/entity.es5.js',
  dest: './dist/entity/bundles/entity.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.entity',
  globals: {
    '@ngrx/store': 'ngrx.store',
  },
};
