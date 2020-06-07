export default {
  entry: './dist/effects/@ngrx/effects.es5.js',
  dest: './dist/effects/bundles/effects.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.effects',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/store': 'ngrx.store',
    rxjs: 'Rx',
  },
};
