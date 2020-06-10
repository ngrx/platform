export default {
  entry: './dist/effects/@ngrx/effects/testing.es5.js',
  dest: './dist/effects/bundles/effects-testing.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.effects.testing',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/effects': 'ngrx.effects',
    rxjs: 'Rx',
  },
};
