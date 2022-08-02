import { ChangeDetectorRef } from '@angular/core';
import { TickScheduler } from './tick-scheduler';

export interface RenderScheduler {
  schedule(): void;
}

export interface RenderSchedulerConfig {
  cdRef: ChangeDetectorRef;
  tickScheduler: TickScheduler;
}

export function createRenderScheduler(
  config: RenderSchedulerConfig
): RenderScheduler {
  function schedule(): void {
    config.cdRef.markForCheck();
    config.tickScheduler.schedule();
  }

  return { schedule };
}
