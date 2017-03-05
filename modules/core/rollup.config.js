export default {
  entry: './release/index.js',
  dest: './release/bundles/core.umd.js',
  format: 'umd',
  moduleName: 'ngrx.core',
  globals: {
    'rxjs/Observable': 'Rx',
    'rxjs/Subscriber': 'Rx',
    'rxjs/operator/map': 'Rx.Observable.prototype',
    'rxjs/operator/pluck': 'Rx.Observable.prototype',
    'rxjs/operator/distinctUntilChanged': 'Rx.Observable.prototype'
  }
}