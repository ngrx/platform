import { ChangeDetectorRef, NgZone } from '@angular/core';

export interface RenderScheduler {
  schedule(): void;
}

export interface RenderSchedulerConfig {
  ngZone: NgZone;
  cdRef: ChangeDetectorRef;
}

export function createRenderScheduler(
  config: RenderSchedulerConfig
): RenderScheduler {
  function schedule(): void {
    if (hasZone(config.ngZone)) {
      config.cdRef.markForCheck();
    } else {
      config.cdRef.detectChanges();
    }
  }

  return { schedule };
}

/**
 * @description
 * Determines if the application uses `NgZone` or `NgNoopZone` as ngZone service instance.
 */
function hasZone(z: NgZone): boolean {
  return z instanceof NgZone;
}
