import {
  getChangeDetectionHandler,
  getGlobalThis,
} from '../../../src/core/utils';
import { Injector } from '@angular/core';

class NgZone {}
class NoopNgZone {}
class ChangeDetectorRef {
  public markForCheck(): void {}
  public detectChanges(): void {}
}

let noopNgZone: any;
let ngZone: any;
let changeDetectorRef: any;

beforeAll(() => {
  const injector = Injector.create([
    { provide: NgZone, useClass: NgZone, deps: [] },
    { provide: NoopNgZone, useClass: NoopNgZone, deps: [] },
    { provide: ChangeDetectorRef, useClass: ChangeDetectorRef, deps: [] },
  ]);
  noopNgZone = injector.get(NoopNgZone) as NgZone;
  ngZone = injector.get(NgZone);
  changeDetectorRef = injector.get(ChangeDetectorRef);
});

describe('getChangeDetectionHandler', () => {
  describe('in ViewEngine', () => {
    beforeAll(() => {
      getGlobalThis().ng = { probe: true };
    });

    it('should return markForCheck in zone-full mode', () => {
      const markForCheckSpy = jasmine.createSpy('markForCheck');
      changeDetectorRef.markForCheck = markForCheckSpy;
      getChangeDetectionHandler(ngZone, changeDetectorRef)();
      expect(markForCheckSpy).toHaveBeenCalled();
    });

    it('should return detectChanges in zone-less mode', () => {
      const detectChangesSpy = jasmine.createSpy('detectChanges');
      changeDetectorRef.detectChanges = detectChangesSpy;
      getChangeDetectionHandler(noopNgZone, changeDetectorRef)();
      expect(detectChangesSpy).toHaveBeenCalled();
    });
  });

  describe('in Ivy', () => {
    beforeEach(() => {
      getGlobalThis().ng = undefined;
    });

    it('should return markDirty in zone-full mode', () => {
      expect(getChangeDetectionHandler(ngZone, changeDetectorRef).name).toBe(
        'markDirty'
      );
    });

    it('should return detectChanges in zone-less mode', () => {
      expect(
        getChangeDetectionHandler(noopNgZone, changeDetectorRef).name
      ).toBe('detectChanges');
    });
  });
});
