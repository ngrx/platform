module.exports = {
  displayName: 'Store Devtools',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/store-devtools',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
