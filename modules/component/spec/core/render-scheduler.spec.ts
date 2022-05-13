import { NgZone } from '@angular/core';
import { createRenderScheduler } from '../../src/core/render-scheduler';
import {
  manualInstanceNgZone,
  manualInstanceNoopNgZone,
  MockChangeDetectorRef,
} from '../fixtures/fixtures';

describe('createRenderScheduler', () => {
  function setup(ngZone: NgZone) {
    const cdRef = new MockChangeDetectorRef();
    const renderScheduler = createRenderScheduler({ ngZone, cdRef });

    return { cdRef, renderScheduler };
  }

  describe('schedule', () => {
    it('should call markForCheck in zone-full mode', () => {
      const { cdRef, renderScheduler } = setup(manualInstanceNgZone);
      renderScheduler.schedule();

      expect(cdRef.detectChanges).toHaveBeenCalledTimes(0);
      expect(cdRef.markForCheck).toHaveBeenCalledTimes(1);
    });

    it('should call detectChanges in zone-less mode', () => {
      const { cdRef, renderScheduler } = setup(manualInstanceNoopNgZone);
      renderScheduler.schedule();

      expect(cdRef.detectChanges).toHaveBeenCalledTimes(1);
      expect(cdRef.markForCheck).toHaveBeenCalledTimes(0);
    });
  });
});
