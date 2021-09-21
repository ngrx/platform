module.exports = {
  displayName: 'Data Example App',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/data-example-app',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
