import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from 'util';

// Only assign if not already defined, using type assertion to satisfy TypeScript
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = NodeTextEncoder as unknown as {
    new (): TextEncoder;
    prototype: TextEncoder;
  };
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = NodeTextDecoder as unknown as {
    new (): TextDecoder;
    prototype: TextDecoder;
  };
}

import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';

import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { getTestBed } from '@angular/core/testing';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);

(global as any)['CSS'] = null;

/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

// // Register custom snapshot serializer for Angular component fixtures
// import { expect } from 'vitest';
// import ngSnapshot from './ng-snapshot';
// expect.addSnapshotSerializer(ngSnapshot);
