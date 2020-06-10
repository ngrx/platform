import 'core-js/es7/reflect';
import 'zone.js/dist/zone-node.js';
import 'zone.js/dist/long-stack-trace-zone.js';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test.js';
import 'zone.js/dist/async-test.js';
import 'zone.js/dist/fake-async-test.js';

// Initialize jasmine with @bazel/jasmine boot() function. This will initialize
// global.jasmine so that it can be patched by zone.js jasmine-patch.js.
require('@bazel/jasmine').boot();

import 'zone.js/dist/jasmine-patch.js';

import { TestBed } from '@angular/core/testing';
import {
  ServerTestingModule,
  platformServerTesting,
} from '@angular/platform-server/testing';

const originalConfigureTestingModule = TestBed.configureTestingModule;

TestBed.configureTestingModule = function () {
  TestBed.resetTestingModule();

  return originalConfigureTestingModule.apply(null, arguments as any);
};

TestBed.initTestEnvironment(ServerTestingModule, platformServerTesting());
