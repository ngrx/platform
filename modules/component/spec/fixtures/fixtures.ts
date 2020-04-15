import createSpy = jasmine.createSpy;
import { ChangeDetectorRef } from '@angular/core';

export class MockChangeDetectorRef {
  markForCheck = createSpy('markForCheck');
  detectChanges = createSpy('detectChanges');
}

export const mockPromise = {
  then: () => {},
};

export function getMockNativeStrategyConfig() {
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
