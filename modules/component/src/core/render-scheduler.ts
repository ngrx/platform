import {
  ChangeDetectorRef,
  NgZone,
  ɵmarkDirty as markDirty,
} from '@angular/core';

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
      const context = getCdRefContext(config.cdRef);
      markDirty(context);
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

function getCdRefContext(cdRef: ChangeDetectorRef): object {
  return (cdRef as unknown as { context: object }).context;
}
