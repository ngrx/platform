module.exports = {
  name: '{{MODULE_NAME_KEBAB}}',
  displayName: '{{MODULE_NAME}}',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/{{MODULE_NAME_KEBAB}}',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
