export default {
  entry: './dist/component/@ngrx/component.es5.js',
  dest: './dist/component/bundles/component.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.component',
  globals: {
    // TODO: @ngrx/component - add ngrx deps, also add it to tsconfig-build.json as path
    // '@ngrx/store': 'ngrx.store',
  },
};
