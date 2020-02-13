module.exports = {
  name: 'store-devtools',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/store-devtools',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
