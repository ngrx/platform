module.exports = {
  name: 'router-store',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/router-store',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
