import { createRenderScheduler } from '../../src/core/render-scheduler';
import { NoopTickScheduler } from '../../src/core/tick-scheduler';
import { MockChangeDetectorRef } from '../fixtures/fixtures';

describe('createRenderScheduler', () => {
  function setup() {
    const cdRef = new MockChangeDetectorRef();
    const tickScheduler = new NoopTickScheduler();
    jest.spyOn(tickScheduler, 'schedule');
    const renderScheduler = createRenderScheduler({ cdRef, tickScheduler });

    return { cdRef, renderScheduler, tickScheduler };
  }

  describe('schedule', () => {
    it('should call cdRef.markForCheck and tickScheduler.schedule', () => {
      const { cdRef, renderScheduler, tickScheduler } = setup();
      renderScheduler.schedule();

      expect(cdRef.markForCheck).toHaveBeenCalledTimes(1);
      expect(tickScheduler.schedule).toHaveBeenCalledTimes(1);
    });
  });
});
