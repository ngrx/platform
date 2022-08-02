import { NgZone } from '@angular/core';
import { MockNoopNgZone } from './mock-noop-ng-zone';

export const ngZoneMock = new NgZone({
  enableLongStackTrace: false,
  shouldCoalesceEventChangeDetection: false,
});
export const noopNgZoneMock = new MockNoopNgZone({
  enableLongStackTrace: false,
  shouldCoalesceEventChangeDetection: false,
});

export class MockChangeDetectorRef {
  markForCheck = jest.fn();
  detectChanges = jest.fn();
  checkNoChanges = jest.fn();
  detach = jest.fn();
  reattach = jest.fn();
  context = { x: 1, y: 2 };
}

export class MockErrorHandler {
  handleError = jest.fn();
}
