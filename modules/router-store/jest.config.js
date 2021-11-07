module.exports = {
  displayName: 'Router Store',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/router-store',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: { '^.+\\.(ts|js|mjs|html)$': 'jest-preset-angular' },
  transformIgnorePatterns: ['node_modules/(?!@angular)']
};
