/* eslint-disable */
export default {
  displayName: 'Schematics',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/schematics',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testEnvironment: 'node',
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
};
