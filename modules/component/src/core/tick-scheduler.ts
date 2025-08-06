import {
  ApplicationRef,
  inject,
  Injectable,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { isNgZone } from './zone-helpers';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
  useFactory: () => {
    const zone = inject(NgZone);
    return isNgZone(zone)
      ? new NoopTickScheduler()
      : inject(ZonelessTickScheduler);
  },
})
export abstract class TickScheduler {
  abstract schedule(): void;
}

@Injectable({
  providedIn: 'root',
})
export class ZonelessTickScheduler extends TickScheduler {
  private isScheduled = false;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isServer = isPlatformServer(this.platformId);
  private readonly appRef = inject(ApplicationRef);
  private readonly scheduleFn = this.isServer
    ? setTimeout
    : requestAnimationFrame;

  schedule(): void {
    if (!this.isScheduled) {
      this.isScheduled = true;
      this.scheduleFn(() => {
        this.appRef.tick();
        this.isScheduled = false;
      });
    }
  }
}

export class NoopTickScheduler extends TickScheduler {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  schedule(): void {}
}
