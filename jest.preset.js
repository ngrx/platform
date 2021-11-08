const nxPreset = require('@nrwl/jest/preset');
module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  // resolver: '@nrwl/jest/plugins/resolver',
  resolver: '<rootDir>/../../resolver.js',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    '<rootDir>/../../ng-snapshot.js',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testRunner: 'jest-jasmine2'
};
