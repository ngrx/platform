import 'core-js';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/jasmine-patch';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var System: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};


Promise.all([
  System.import('@angular/core/testing'),
  System.import('@angular/platform-browser-dynamic/testing')
])
// First, initialize the Angular testing environment.
.then(([testing, testingBrowser]: any) => {
  testing.getTestBed().initTestEnvironment(
    testingBrowser.BrowserDynamicTestingModule,
    testingBrowser.platformBrowserDynamicTesting()
  );
})
// Then we find all the tests.
.then<any>((): any => (<any>require).context('./spec', true, /\.spec\.ts/))
// And load the modules.
.then((context: any) => context.keys().map(context))
// Finally, start Karma to run the tests.
.then(__karma__.start, __karma__.error);