export default {
  entry: './release/index.js',
  dest: './release/bundles/store-devtools.umd.js',
  format: 'umd',
  moduleName: 'ngrx.storeDevtools',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/core/operator/select': 'ngrx.core',
    '@ngrx/store': 'ngrx.store',
    
    'rxjs/Observable': 'Rx',
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/Subscriber': 'Rx',
    
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