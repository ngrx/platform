module.exports = {
  displayName: 'Schematics',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/modules/schematics',

  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  testEnvironment: 'node',
};
