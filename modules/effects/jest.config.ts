/* eslint-disable */
export default {
  displayName: 'Effects',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/effects',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {},
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@angular|tslib)'],
  moduleNameMapper: {
    tslib: '<rootDir>../../node_modules/tslib/tslib.es6.js',
  },
};
