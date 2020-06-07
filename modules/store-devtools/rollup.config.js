export default {
  entry: './dist/store-devtools/@ngrx/store-devtools.es5.js',
  dest: './dist/store-devtools/bundles/store-devtools.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.storeDevtools',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/store': 'ngrx.store',

    rxjs: 'Rx',
  },
};
