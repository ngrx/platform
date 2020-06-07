export default {
  entry: './dist/store/@ngrx/store.es5.js',
  dest: './dist/store/bundles/store.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.store',
  globals: {
    '@angular/core': 'ng.core',
    rxjs: 'Rx',
  },
};
