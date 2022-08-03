import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { TickScheduler } from './tick-scheduler';

@Injectable()
export class RenderScheduler {
  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly tickScheduler: TickScheduler
  ) {}

  schedule(): void {
    this.cdRef.markForCheck();
    this.tickScheduler.schedule();
  }
}

export function createRenderScheduler(): RenderScheduler {
  return new RenderScheduler(inject(ChangeDetectorRef), inject(TickScheduler));
}
