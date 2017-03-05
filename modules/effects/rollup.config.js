export default {
  entry: './release/index.js',
  dest: './release/bundles/effects.umd.js',
  format: 'umd',
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
