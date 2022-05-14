/* eslint-disable */
export default {
  displayName: 'Component',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/component',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  transform: { '^.+\\.(ts|js|mjs|html)$': 'jest-preset-angular' },
  transformIgnorePatterns: ['node_modules/(?!@angular|tslib)'],
  moduleNameMapper: {
    tslib: '<rootDir>../../node_modules/tslib/tslib.es6.js',
  },
};
