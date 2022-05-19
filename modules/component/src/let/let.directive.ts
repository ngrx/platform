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
  /**
   * using `$implicit` to enable `let` syntax: `*ngrxLet="obs$; let o"`
   */
  $implicit: T;
  /**
   * using `ngrxLet` to enable `as` syntax: `*ngrxLet="obs$ as o"`
   */
  ngrxLet: T;
  /**
   * `*ngrxLet="obs$; let e = $error"` or `*ngrxLet="obs$; $error as e"`
   */
  $error: any;
  /**
   * `*ngrxLet="obs$; let c = $complete"` or `*ngrxLet="obs$; $complete as c"`
   */
  $complete: boolean;
  /**
   * `*ngrxLet="obs$; let s = $suspense"` or `*ngrxLet="obs$; $suspense as s"`
   */
  $suspense: boolean;
}

/**
 * @ngModule ReactiveComponentModule
 *
 * @description
 *
 * The `*ngrxLet` directive serves a convenient way of binding observables to a view context
 * (DOM element's scope). It also helps with several internal processing under the hood.
 *
 * @usageNotes
 *
 * ### Displaying Observable Values
 *
 * ```html
 * <ng-container *ngrxLet="number$ as n">
 *   <app-number [number]="n"></app-number>
 * </ng-container>
 *
 * <ng-container *ngrxLet="number$; let n">
 *   <app-number [number]="n"></app-number>
 * </ng-container>
 * ```
 *
 * ### Tracking Different Observable Events
 *
 * ```html
 * <ng-container *ngrxLet="number$ as n; let e = $error; let c = $complete">
 *   <app-number [number]="n" *ngIf="!e && !c">
 *   </app-number>
 *
 *   <p *ngIf="e">There is an error: {{ e }}</p>
 *   <p *ngIf="c">Observable is completed.</p>
 * </ng-container>
 * ```
 *
 * ### Using Suspense Template
 *
 * ```html
 * <ng-container *ngrxLet="number$ as n; suspenseTpl: loading">
 *   <app-number [number]="n"></app-number>
 * </ng-container>
 *
 * <ng-template #loading>
 *   <p>Loading...</p>
 * </ng-template>
 * ```
 *
 * @publicApi
 */
@Directive({ selector: '[ngrxLet]' })
export class LetDirective<U> implements OnInit, OnDestroy {
  static ngTemplateGuard_ngrxLet: 'binding';

  private isMainViewCreated = false;
  private isSuspenseViewCreated = false;
  private readonly viewContext: LetViewContext<U | null | undefined> = {
    $implicit: undefined,
    ngrxLet: undefined,
    $error: undefined,
    $complete: false,
    $suspense: true,
  };
  private readonly renderScheduler = createRenderScheduler({
    ngZone: this.ngZone,
    cdRef: this.cdRef,
  });
  private readonly renderEventManager = createRenderEventManager<U>({
    reset: () => {
      this.viewContext.$implicit = undefined;
      this.viewContext.ngrxLet = undefined;
      this.viewContext.$error = undefined;
      this.viewContext.$complete = false;
      this.viewContext.$suspense = true;

      this.renderSuspenseView();
    },
    next: (event) => {
      this.viewContext.$implicit = event.value;
      this.viewContext.ngrxLet = event.value;
      this.viewContext.$suspense = false;

      if (event.reset) {
        this.viewContext.$error = undefined;
        this.viewContext.$complete = false;
      }

      this.renderMainView();
    },
    error: (event) => {
      this.viewContext.$error = event.error;
      this.viewContext.$suspense = false;

      if (event.reset) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.$complete = false;
      }

      this.renderMainView();
      this.errorHandler.handleError(event.error);
    },
    complete: (event) => {
      this.viewContext.$complete = true;
      this.viewContext.$suspense = false;

      if (event.reset) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.$error = undefined;
      }

      this.renderMainView();
    },
  });
  private readonly subscription = new Subscription();

  @Input()
  set ngrxLet(potentialObservable: PotentialObservable<U>) {
    this.renderEventManager.nextPotentialObservable(potentialObservable);
  }

  @Input('ngrxLetSuspenseTpl') suspenseTemplateRef?: TemplateRef<
    LetViewContext<U | null | undefined>
  >;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    private readonly mainTemplateRef: TemplateRef<LetViewContext<U>>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly errorHandler: ErrorHandler
  ) {}

  static ngTemplateContextGuard<U>(
    dir: LetDirective<U>,
    ctx: unknown | null | undefined
  ): ctx is LetViewContext<U> {
    return true;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.renderEventManager.handlePotentialObservableChanges().subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private renderMainView(): void {
    if (this.isSuspenseViewCreated) {
      this.isSuspenseViewCreated = false;
      this.viewContainerRef.clear();
    }

    if (!this.isMainViewCreated) {
      this.isMainViewCreated = true;
      this.viewContainerRef.createEmbeddedView(
        this.mainTemplateRef,
        this.viewContext
      );
    }

    this.renderScheduler.schedule();
  }

  private renderSuspenseView(): void {
    if (this.suspenseTemplateRef && this.isMainViewCreated) {
      this.isMainViewCreated = false;
      this.viewContainerRef.clear();
    }

    if (this.suspenseTemplateRef && !this.isSuspenseViewCreated) {
      this.isSuspenseViewCreated = true;
      this.viewContainerRef.createEmbeddedView(this.suspenseTemplateRef);
    }

    if (this.isMainViewCreated || this.isSuspenseViewCreated) {
      this.renderScheduler.schedule();
    }
  }
}
