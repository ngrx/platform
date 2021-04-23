// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// Reflect.metadata polyfill is only needed in the JIT mode which we use only for unit tests
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
