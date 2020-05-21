module.exports = {
  name: 'entity',
  displayName: 'Entity',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/entity',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
