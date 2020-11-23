module.exports = {
  name: 'selectors',
  displayName: 'selectors',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/selectors',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
