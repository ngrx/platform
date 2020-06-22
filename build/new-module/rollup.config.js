export default {
  entry: './dist/{{MODULE_NAME_KEBAB}}/@ngrx/{{MODULE_NAME_KEBAB}}.es5.js',
  dest: './dist/{{MODULE_NAME_KEBAB}}/bundles/{{MODULE_NAME_KEBAB}}.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.{{MODULE_NAME_KEBAB}}',
  globals: {},
};
