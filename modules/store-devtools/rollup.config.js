export default {
  entry: './dist/store-devtools/@ngrx/store-devtools.es5.js',
  dest: './dist/store-devtools/bundles/store-devtools.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.storeDevtools',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/store': 'ngrx.store',
    
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/Subscriber': 'Rx',
    'rxjs/Subscription': 'Rx',
    
    'rxjs/scheduler/queue': 'Rx.Scheduler',

    'rxjs/observable/empty': 'Rx.Observable',

    'rxjs/operator/filter': 'Rx.Observable.prototype',
    'rxjs/operator/map': 'Rx.Observable.prototype',
    'rxjs/operator/merge': 'Rx.Observable.prototype',
    'rxjs/operator/observeOn': 'Rx.Observable.prototype',
    'rxjs/operator/publishReplay': 'Rx.Observable.prototype',
    'rxjs/operator/scan': 'Rx.Observable.prototype',
    'rxjs/operator/share': 'Rx.Observable.prototype',
    'rxjs/operator/skip': 'Rx.Observable.prototype',
    'rxjs/operator/switchMap': 'Rx.Observable.prototype',
    'rxjs/operator/takeUntil': 'Rx.Observable.prototype',
    'rxjs/operator/withLatestFrom': 'Rx.Observable.prototype'
  }
}
