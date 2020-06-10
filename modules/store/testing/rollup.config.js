export default {
  entry: './dist/store/@ngrx/store/testing.es5.js',
  dest: './dist/store/bundles/store-testing.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.store.testing',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/store': 'ngrx.store',
    rxjs: 'Rx',
  },
};
