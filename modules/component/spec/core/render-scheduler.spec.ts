import * as angular from '@angular/core';
import { noop } from 'rxjs';
import { createRenderScheduler } from '../../src/core/render-scheduler';
import {
  manualInstanceNgZone,
  manualInstanceNoopNgZone,
  MockChangeDetectorRef,
} from '../fixtures/fixtures';

describe('createRenderScheduler', () => {
  function setup(ngZone: angular.NgZone) {
    const cdRef = new MockChangeDetectorRef();
    const renderScheduler = createRenderScheduler({ ngZone, cdRef });
    jest.spyOn(angular, 'ɵmarkDirty').mockImplementation(noop);

    return { cdRef, renderScheduler, markDirty: angular.ɵmarkDirty };
  }

  describe('schedule', () => {
    it('should call markForCheck in zone-full mode', () => {
      const { cdRef, renderScheduler, markDirty } = setup(manualInstanceNgZone);
      renderScheduler.schedule();

      expect(markDirty).toHaveBeenCalledTimes(0);
      expect(cdRef.markForCheck).toHaveBeenCalledTimes(1);
    });

    it('should call markDirty in zone-less mode', () => {
      const { cdRef, renderScheduler, markDirty } = setup(
        manualInstanceNoopNgZone
      );
      renderScheduler.schedule();

      expect(markDirty).toHaveBeenCalledWith(
        (cdRef as unknown as { context: object }).context
      );
      expect(cdRef.markForCheck).toHaveBeenCalledTimes(0);
    });
  });
});
