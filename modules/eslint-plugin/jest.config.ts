/* eslint-disable */
export default {
  displayName: 'eslint-plugin',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/esling-plugin',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: { '^.+\\.(ts|js|mjs|html)$': 'jest-preset-angular' },
  transformIgnorePatterns: ['node_modules/(?!@angular|tslib)'],
  moduleNameMapper: {
    tslib: '<rootDir>../../node_modules/tslib/tslib.es6.js',
  },
};
