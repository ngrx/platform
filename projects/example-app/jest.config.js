module.exports = {
  name: 'example-app',
  displayName: 'Example App',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/example-app',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
