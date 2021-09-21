module.exports = {
  displayName: 'Component',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/component',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],

  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
