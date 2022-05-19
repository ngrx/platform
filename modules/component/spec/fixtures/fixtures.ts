import { NgZone } from '@angular/core';
import { MockNoopNgZone } from './mock-noop-ng-zone';

/**
 * this is not exposed as NgZone should never be exposed to get miss matched with the real one
 */
class NoopNgZone extends MockNoopNgZone {}

export const manualInstanceNgZone = new NgZone({
  enableLongStackTrace: false,
  shouldCoalesceEventChangeDetection: false,
});
export const manualInstanceNoopNgZone = new NoopNgZone({
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
