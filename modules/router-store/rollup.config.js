export default {
  entry: './release/src/index.js',
  dest: './release/bundles/router-store.umd.js',
  format: 'umd',
  moduleName: 'ngrx.routerStore',
  globals: {
    'rxjs/Observable': 'Rx',
    'rxjs/observable/of': 'Rx.Observable'
  }
}