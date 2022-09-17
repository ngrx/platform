import { ErrorHandler, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { ObservableOrPromise } from '../core/potential-observable';
import { createRenderScheduler } from '../core/render-scheduler';
import { createRenderEventManager } from '../core/render-event/manager';

type PushPipeResult<PO> = PO extends ObservableOrPromise<infer R>
  ? R | undefined
  : PO;

/**
 * @ngModule PushModule
 *
 * @description
 *
 * The `ngrxPush` pipe serves as a drop-in replacement for the `async` pipe.
 * It contains intelligent handling of change detection to enable us
 * running in zone-full as well as zone-less mode without any changes to the code.
 *
 * @usageNotes
 *
 * ```html
 * <p>{{ number$ | ngrxPush }}</p>
 *
 * <ng-container *ngIf="number$ | ngrxPush as n">{{ n }}</ng-container>
 *
 * <app-number [number]="number$ | ngrxPush"></app-number>
 * ```
 *
 * @publicApi
 */
@Pipe({ name: 'ngrxPush', pure: false })
export class PushPipe implements PipeTransform, OnDestroy {
  private renderedValue: unknown;
  private readonly renderScheduler = createRenderScheduler();
  private readonly renderEventManager = createRenderEventManager({
    suspense: (event) => this.setRenderedValue(undefined, event.synchronous),
    next: (event) => this.setRenderedValue(event.value, event.synchronous),
    error: (event) => {
      if (event.reset) {
        this.setRenderedValue(undefined, event.synchronous);
      }
      this.errorHandler.handleError(event.error);
    },
    complete: (event) => {
      if (event.reset) {
        this.setRenderedValue(undefined, event.synchronous);
      }
    },
  });
  private readonly subscription: Unsubscribable;

  constructor(private readonly errorHandler: ErrorHandler) {
    this.subscription = this.renderEventManager
      .handlePotentialObservableChanges()
      .subscribe();
  }

  transform<PO>(potentialObservable: PO): PushPipeResult<PO> {
    this.renderEventManager.nextPotentialObservable(potentialObservable);
    return this.renderedValue as PushPipeResult<PO>;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setRenderedValue(value: unknown, isSyncEvent: boolean): void {
    if (value !== this.renderedValue) {
      this.renderedValue = value;

      if (!isSyncEvent) {
        this.renderScheduler.schedule();
      }
    }
  }
}
