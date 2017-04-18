export default {
  entry: './dist/effects/@ngrx/effects.es5.js',
  dest: './dist/effects/bundles/effects.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.effects',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/store': 'ngrx.store',
    'rxjs/Observable': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/operator/filter': 'Rx.Observable.prototype',
    'rxjs/operator/ignoreElements': 'Rx.Observable.prototype',
    'rxjs/observable/merge': 'Rx.Observable'
  }
}
