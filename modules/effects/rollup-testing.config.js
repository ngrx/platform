export default {
  entry: './release/testing/index.js',
  dest: './release/bundles/effects-testing.umd.js',
  format: 'umd',
  moduleName: 'ngrx.effects.testing',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/store': 'ngrx.store',
    '@ngrx/effects': 'ngrx.effects',
    'rxjs/ReplaySubject': 'Rx'
  }
}
