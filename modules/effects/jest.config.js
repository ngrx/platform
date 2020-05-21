module.exports = {
  name: 'effects',
  displayName: 'Effects',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/effects',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
