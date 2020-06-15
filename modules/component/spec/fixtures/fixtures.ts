import createSpy = jasmine.createSpy;
import { ChangeDetectorRef, NgZone } from '@angular/core';
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
  markForCheck = createSpy('markForCheck');
  detectChanges = createSpy('detectChanges');
  checkNoChanges = createSpy('checkNoChanges');
  detach = createSpy('detach');
  reattach = createSpy('reattach');
}

export const mockPromise = {
  then: () => {},
};

export function getMockOptimizedStrategyConfig() {
  return {
    component: {},
    cdRef: (new MockChangeDetectorRef() as any) as ChangeDetectorRef,
  };
}

export function getMockNoopStrategyConfig() {
  return {
    component: {},
    cdRef: (new MockChangeDetectorRef() as any) as ChangeDetectorRef,
  };
}
