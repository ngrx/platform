/* eslint-disable */
export default {
  displayName: 'Store',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/store',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testRunner: 'jest-jasmine2',
  moduleNameMapper: {
    '^rxjs(/operators$)?$':
      '<rootDir>../../node_modules/rxjs/dist/bundles/rxjs.umd.js',
    '^rxjs/testing$':
      '<rootDir>../../node_modules/rxjs/dist/cjs/testing/index.js',
  },
  maxWorkers: 8,
};
