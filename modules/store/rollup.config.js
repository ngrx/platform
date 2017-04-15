
export default {
  entry: './dist/store/@ngrx/store.es5.js',
  dest: './dist/store/bundles/store.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.store',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Observable': 'Rx',
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/Subscriber': 'Rx',
    'rxjs/scheduler/queue': 'Rx.Scheduler',
    'rxjs/operator/map': 'Rx.Observable.prototype',
    'rxjs/operator/pluck': 'Rx.Observable.prototype',
    'rxjs/operator/distinctUntilChanged': 'Rx.Observable.prototype',
    'rxjs/operator/observeOn': 'Rx.Observable.prototype',
    'rxjs/operator/scan': 'Rx.Observable.prototype',
    'rxjs/operator/withLatestFrom': 'Rx.Observable'
  }
}
