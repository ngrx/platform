import {
  ChangeDetectorRef,
  ErrorHandler,
  NgZone,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ObservableInput, Unsubscribable } from 'rxjs';
import { PotentialObservable } from '../core/potential-observable';
import { createRenderScheduler } from '../core/render-scheduler';
import { createRenderEventManager } from '../core/render-event/manager';

/**
 * @ngModule ReactiveComponentModule
 *
 * @description
 *
 * The `ngrxPush` pipe serves as a drop-in replacement for the `async` pipe.
 * It contains intelligent handling of change detection to enable us
 * running in zone-full as well as zone-less mode without any changes to the code.
 *
 * The current way of binding an observable to the view looks like that:
 *  ```html
 *  {{observable$ | async}}
 * <ng-container *ngIf="observable$ | async as o">{{o}}</ng-container>
 * <component [value]="observable$ | async"></component>
 * ```
 *
 * The problem is `async` pipe just marks the component and all its ancestors as dirty.
 * It needs zone.js microtask queue to exhaust until `ApplicationRef.tick` is called to render all dirty marked
 *     components.
 *
 * Heavy dynamic and interactive UIs suffer from zones change detection a lot and can
 * lean to bad performance or even unusable applications, but the `async` pipe does not work in zone-less mode.
 *
 * `ngrxPush` pipe solves that problem.
 *
 * Included Features:
 *  - Take observables or promises, retrieve their values and render the value to the template
 *  - Handling null and undefined values in a clean unified/structured way
 *  - Triggers the change detection differently if `zone.js` is present or not
 *    using `ChangeDetectorRef.markForCheck` or `ɵmarkDirty`
 *  - Distinct the same values in a row for better performance
 *
 * @usageNotes
 *
 * `ngrxPush` pipe solves that problem. It can be used like shown here:
 * ```html
 * {{observable$ | ngrxPush}}
 * <ng-container *ngIf="observable$ | ngrxPush as o">{{o}}</ng-container>
 * <component [value]="observable$ | ngrxPush"></component>
 * ```
 *
 * @publicApi
 */
@Pipe({ name: 'ngrxPush', pure: false })
export class PushPipe implements PipeTransform, OnDestroy {
  private renderedValue: unknown;
  private readonly renderScheduler = createRenderScheduler({
    ngZone: this.ngZone,
    cdRef: this.cdRef,
  });
  private readonly renderEventManager = createRenderEventManager({
    reset: () => this.setRenderedValue(undefined),
    next: (event) => this.setRenderedValue(event.value),
    error: (event) => {
      if (event.reset) {
        this.setRenderedValue(undefined);
      }
      this.errorHandler.handleError(event.error);
    },
    complete: (event) => {
      if (event.reset) {
        this.setRenderedValue(undefined);
      }
    },
  });
  private readonly subscription: Unsubscribable;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    private readonly errorHandler: ErrorHandler
  ) {
    this.subscription = this.renderEventManager
      .handlePotentialObservableChanges()
      .subscribe();
  }

  transform<T>(potentialObservable: null): null;
  transform<T>(potentialObservable: undefined): undefined;
  transform<T>(potentialObservable: ObservableInput<T>): T | undefined;
  transform<T>(
    potentialObservable: PotentialObservable<T>
  ): T | null | undefined {
    this.renderEventManager.nextPotentialObservable(potentialObservable);
    return this.renderedValue as T | null | undefined;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setRenderedValue(value: unknown): void {
    if (value !== this.renderedValue) {
      this.renderedValue = value;
      this.renderScheduler.schedule();
    }
  }
}
