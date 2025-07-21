import { ApplicationRef, inject, Injectable, NgZone } from '@angular/core';
import { isNgZone } from './zone-helpers';

@Injectable({
  providedIn: 'root',
  useFactory: () => {
    const zone = inject(NgZone);
    return isNgZone(zone)
      ? new NoopTickScheduler()
      : inject(AnimationFrameTickScheduler);
  },
})
export abstract class TickScheduler {
  abstract schedule(): void;
}

@Injectable({
  providedIn: 'root',
})
/**
 * An animation frame-based tick scheduler that uses requestAnimationFrame.
 *
 * @public
 */
export class AnimationFrameTickScheduler extends TickScheduler {
  private isScheduled = false;

  constructor(private readonly appRef: ApplicationRef) {
    super();
  }

  schedule(): void {
    if (!this.isScheduled) {
      this.isScheduled = true;
      requestAnimationFrame(() => {
        this.appRef.tick();
        this.isScheduled = false;
      });
    }
  }
}

/**
 * A no-operation tick scheduler that does nothing when scheduled.
 *
 * @public
 */
export class NoopTickScheduler extends TickScheduler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  schedule(): void {}
}
