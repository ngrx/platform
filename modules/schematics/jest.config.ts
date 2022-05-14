/* eslint-disable */
export default {
  displayName: 'Schematics',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/schematics',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@angular|tslib)'],
  moduleNameMapper: {
    tslib: '<rootDir>/../../node_modules/tslib/tslib.js',
  },
};
