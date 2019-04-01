require('ts-node/register');
const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

const baseUrl = './';

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

require('core-js/es7/reflect');
require('zone.js/dist/zone-node.js');
require('zone.js/dist/long-stack-trace-zone.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test.js');
require('zone.js/dist/async-test.js');
require('zone.js/dist/fake-async-test.js');

const Jasmine = require('jasmine');

const runner = new Jasmine();

global.jasmine = runner.jasmine;

require('zone.js/dist/jasmine-patch.js');

// Override console.warn, otherwise we log too much to the console
// This is because of the `runtimeChecks` warning when no runtime config is provided
console.warn = () => {};

const { getTestBed } = require('@angular/core/testing');
const {
  ServerTestingModule,
  platformServerTesting,
} = require('@angular/platform-server/testing');

getTestBed().initTestEnvironment(ServerTestingModule, platformServerTesting());

runner.loadConfig({
  spec_dir: 'modules',
  spec_files: ['**/*.spec.ts'],
});

runner.execute();
