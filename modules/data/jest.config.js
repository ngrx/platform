module.exports = {
  name: 'data',
  displayName: 'Data',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/data',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
