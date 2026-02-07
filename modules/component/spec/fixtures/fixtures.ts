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
  markForCheck = vi.fn();
  detectChanges = vi.fn();
  checkNoChanges = vi.fn();
  detach = vi.fn();
  reattach = vi.fn();
  context = { x: 1, y: 2 };
}

export class MockErrorHandler {
  handleError = vi.fn();
}
