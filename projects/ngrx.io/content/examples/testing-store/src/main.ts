import './global-jasmine';
import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot.js';

import './polyfills';

// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';

// Requires 'zone.js/dist/proxy.js' and 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import './app/state/books.reducer.spec.ts';
import './app/state/collection.reducer.spec.ts';
import './app/state/books.selectors.spec.ts';
import './app/app.component.spec.ts';
import './app/integration.spec.ts';

jasmine.getEnv().configure({ random: false });
bootstrap();

function bootstrap() {
  if (window.jasmineRef) {
    location.reload();
    return;
  } else {
    window.onload();
    window.jasmineRef = jasmine.getEnv();
  }

  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
}
