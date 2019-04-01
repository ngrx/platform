module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'projects/example-app/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html?$',
      astTransformers: [
        require.resolve('jest-preset-angular/InlineHtmlStripStylesTransformer'),
      ],
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/**/*.spec.ts'],
  testEnvironment: 'jest-environment-jsdom-thirteen',
  moduleFileExtensions: ['html', 'js', 'json', 'ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/modules/*.*/'],
  moduleNameMapper: {
    '^@ngrx/(.*)': '<rootDir>/../../modules/$1',
    '^@example-app/(.*)': '<rootDir>/src/app/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  modulePathIgnorePatterns: ['dist'],
  preset: 'jest-preset-angular',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
};
