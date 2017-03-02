import {TestBed} from '@angular/core/testing';
import {platformBrowserDynamicTesting, BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
declare var System;
declare var __karma__;

__karma__.loaded = function () {
};

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

System.import('./modules/store/test/store.spec.ts')
  .then(() => {
	  __karma__.start();
  })
  .catch(err => {
	  __karma__.error(err);
  })
