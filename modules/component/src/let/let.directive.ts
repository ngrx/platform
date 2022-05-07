import {
  ChangeDetectorRef,
  Directive,
  ErrorHandler,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PotentialObservable } from '../core/potential-observable';
import { createRenderScheduler } from '../core/render-scheduler';
import { createRenderEventManager } from '../core/render-event/manager';

export interface LetViewContext<T> {
  // to enable `let` syntax we have to use $implicit (var; let v = var)
  $implicit: T;
  // to enable `as` syntax we have to assign the directives selector (var as v)
  ngrxLet: T;
  // set context var complete to true (var$; let e = $error)
  $error: boolean;
  // set context var complete to true (var$; let c = $complete)
  $complete: boolean;
}

/**
 * @ngModule ReactiveComponentModule
 *
 * @description
 *
 * The `*ngrxLet` directive serves a convenient way of binding observables to a view context (a dom element scope).
 * It also helps with several internal processing under the hood.
 *
 * The current way of binding an observable to the view looks like that:
 * ```html
 * <ng-container *ngIf="observableNumber$ | async as n">
 * <app-number [number]="n">
 * </app-number>
 * <app-number-special [number]="n">
 * </app-number-special>
 * </ng-container>
 *  ```
 *
 *  The problem is `*ngIf` is also interfering with rendering and in case of a `0` the component would be hidden
 *
 * Included Features:
 * - binding is always present. (`*ngIf="truthy$ | async"`)
 * - it takes away the multiple usages of the `async` or `ngrxPush` pipe
 * - a unified/structured way of handling null and undefined
 * - triggers change-detection differently if `zone.js` is present or not (`ChangeDetectorRef.detectChanges` or `ChangeDetectorRef.markForCheck`)
 * - triggers change-detection differently if ViewEngine or Ivy is present (`ChangeDetectorRef.detectChanges` or `ɵdetectChanges`)
 * - distinct same values in a row (distinctUntilChanged operator)
 *
 * @usageNotes
 *
 * The `*ngrxLet` directive take over several things and makes it more convenient and save to work with streams in the template
 * `<ng-container *ngrxLet="observableNumber$ as c"></ng-container>`
 *
 * ```html
 * <ng-container *ngrxLet="observableNumber$ as n">
 * <app-number [number]="n">
 * </app-number>
 * </ng-container>
 *
 * <ng-container *ngrxLet="observableNumber$; let n">
 * <app-number [number]="n">
 * </app-number>
 * </ng-container>
 * ```
 *
 * In addition to that it provides us information from the whole observable context.
 * We can track the observables:
 * - next value
 * - error value
 * - complete state
 *
 * ```html
 * <ng-container *ngrxLet="observableNumber$; let n; let e = $error, let c = $complete">
 * <app-number [number]="n"  *ngIf="!e && !c">
 * </app-number>
 * <ng-container *ngIf="e">
 * There is an error: {{e}}
 * </ng-container>
 * <ng-container *ngIf="c">
 * Observable completed: {{c}}
 * </ng-container>
 * </ng-container>
 * ```
 *
 * @publicApi
 */
@Directive({ selector: '[ngrxLet]' })
export class LetDirective<U> implements OnInit, OnDestroy {
  static ngTemplateGuard_ngrxLet: 'binding';

  private isEmbeddedViewCreated = false;
  private readonly viewContext: LetViewContext<U | null | undefined> = {
    $implicit: undefined,
    ngrxLet: undefined,
    $error: false,
    $complete: false,
  };
  private readonly renderScheduler = createRenderScheduler({
    ngZone: this.ngZone,
    cdRef: this.cdRef,
  });
  private readonly renderEventManager = createRenderEventManager<U>({
    reset: () => {
      if (this.isEmbeddedViewCreated) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.$error = false;
        this.viewContext.$complete = false;

        this.renderScheduler.schedule();
      }
    },
    next: (event) => {
      this.viewContext.$implicit = event.value;
      this.viewContext.ngrxLet = event.value;

      if (event.reset) {
        this.viewContext.$error = false;
        this.viewContext.$complete = false;
      }

      this.renderEmbeddedView();
    },
    error: (event) => {
      this.viewContext.$error = true;

      if (event.reset) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.$complete = false;
      }

      this.renderEmbeddedView();
      this.errorHandler.handleError(event.error);
    },
    complete: (event) => {
      this.viewContext.$complete = true;

      if (event.reset) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.$error = false;
      }

      this.renderEmbeddedView();
    },
  });
  private readonly subscription = new Subscription();

  static ngTemplateContextGuard<U>(
    dir: LetDirective<U>,
    ctx: unknown | null | undefined
  ): ctx is LetViewContext<U> {
    return true;
  }

  @Input()
  set ngrxLet(potentialObservable: PotentialObservable<U>) {
    this.renderEventManager.nextPotentialObservable(potentialObservable);
  }

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    private readonly templateRef: TemplateRef<LetViewContext<U>>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly errorHandler: ErrorHandler
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.renderEventManager.handlePotentialObservableChanges().subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private renderEmbeddedView(): void {
    if (!this.isEmbeddedViewCreated) {
      this.isEmbeddedViewCreated = true;
      this.viewContainerRef.createEmbeddedView(
        this.templateRef,
        this.viewContext
      );
    }

    this.renderScheduler.schedule();
  }
}
