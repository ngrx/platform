import 'core-js/es7/reflect';
import 'zone.js/dist/zone-node.js';
import 'zone.js/dist/long-stack-trace-zone.js';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test.js';
import 'zone.js/dist/async-test.js';
import 'zone.js/dist/fake-async-test.js';

// We must first initialize jasmine-core before calling
// requiring `zone.js/dist/jasmine-patch.js` which patches
// jasmine ENV with code which understands ProxyZone.
// jasmine_node_test under Bazel will check if `jasmineCore.boot(jasmineCore)`
// has been called and re-use the env if it has.
// See https://github.com/bazelbuild/rules_nodejs/pull/539
const jasmineCore: any = require('jasmine-core');
jasmineCore.boot(jasmineCore);
import 'zone.js/dist/jasmine-patch.js';

import { TestBed } from '@angular/core/testing';
import {
  ServerTestingModule,
  platformServerTesting,
} from '@angular/platform-server/testing';

require('zone.js/dist/jasmine-patch.js');

const originalConfigureTestingModule = TestBed.configureTestingModule;

TestBed.configureTestingModule = function() {
  TestBed.resetTestingModule();

  return originalConfigureTestingModule.apply(null, arguments);
};

TestBed.initTestEnvironment(ServerTestingModule, platformServerTesting());
