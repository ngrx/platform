module.exports = {
  name: 'schematics',
  displayName: 'Schematics',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/schematics',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};
