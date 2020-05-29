module.exports = {
  name: 'store',
  displayName: 'Store',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/store',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
