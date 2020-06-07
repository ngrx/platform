export default {
  entry: './dist/router-store/@ngrx/router-store.es5.js',
  dest: './dist/router-store/bundles/router-store.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.routerStore',
  globals: {
    '@ngrx/store': 'ngrx.store',
    '@angular/core': 'ng.core',
    '@angular/router': 'ng.router',
    rxjs: 'Rx',
  },
};
