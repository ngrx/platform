module.exports = {
  name: 'schematics',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/schematics',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
