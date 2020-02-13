module.exports = {
  name: 'component',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/modules/component',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
