module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      stringifyContentPathRegex: '\\.html?$',
      astTransformers: [
        require.resolve('jest-preset-angular/build/StripStylesTransformer'),
      ],
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/modules/**/*.spec.ts',
    '<rootDir>/projects/example-app/**/*.spec.ts'
  ],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['html', 'js', 'json', 'ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/modules/*.*/'],
  moduleNameMapper: {
    '^@ngrx/(.*)': '<rootDir>/modules/$1',
    '^@example-app/(.*)': '<rootDir>/projects/example-app/src/app/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  modulePathIgnorePatterns: ['dist'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/projects/example-app-cypress'
  ]
};
