import {
  Directive,
  ErrorHandler,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PotentialObservableResult } from '../core/potential-observable';
import { RenderScheduler } from '../core/render-scheduler';
import { createRenderEventManager } from '../core/render-event/manager';

type LetViewContextValue<PO> = PotentialObservableResult<PO>;

export interface LetViewContext<PO> {
  /**
   * using `$implicit` to enable `let` syntax: `*ngrxLet="obs$; let o"`
   */
  $implicit: LetViewContextValue<PO>;
  /**
   * using `ngrxLet` to enable `as` syntax: `*ngrxLet="obs$ as o"`
   */
  ngrxLet: LetViewContextValue<PO>;
  /**
   * `*ngrxLet="obs$; let e = error"` or `*ngrxLet="obs$; error as e"`
   */
  error: any;
  /**
   * `*ngrxLet="obs$; let c = complete"` or `*ngrxLet="obs$; complete as c"`
   */
  complete: boolean;
  /**
   * `*ngrxLet="obs$; let s = suspense"` or `*ngrxLet="obs$; suspense as s"`
   */
  suspense: boolean;
}

/**
 * @ngModule LetModule
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
 * <ng-container *ngrxLet="number$ as n; error as e; complete as c">
 *   <app-number [number]="n" *ngIf="!e && !c">
 *   </app-number>
 *
 *   <p *ngIf="e">There is an error: {{ e }}</p>
 *   <p *ngIf="c">Observable is completed.</p>
 * </ng-container>
 * ```
 *
 * ### Combining Multiple Observables
 *
 * ```html
 * <ng-container *ngrxLet="{ users: users$, query: query$ } as vm">
 *   <app-search-bar [query]="vm.query"></app-search-bar>
 *   <app-user-list [users]="vm.users"></app-user-list>
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
 * ### Using Aliases for Non-Observable Values
 *
 * ```html
 * <ng-container *ngrxLet="userForm.controls.email as email">
 *   <input type="text" [formControl]="email" />
 *
 *   <ng-container *ngIf="email.errors && (email.touched || email.dirty)">
 *     <p *ngIf="email.errors.required">This field is required.</p>
 *     <p *ngIf="email.errors.email">This field must be an email.</p>
 *   </ng-container>
 * </ng-container>
 * ```
 *
 * @publicApi
 */
@Directive({
  selector: '[ngrxLet]',
  providers: [RenderScheduler],
})
export class LetDirective<PO> implements OnInit, OnDestroy {
  private isMainViewCreated = false;
  private isSuspenseViewCreated = false;
  private readonly viewContext: LetViewContext<PO | undefined> = {
    $implicit: undefined,
    ngrxLet: undefined,
    error: undefined,
    complete: false,
    suspense: true,
  };
  private readonly renderEventManager = createRenderEventManager<PO>({
    suspense: () => {
      this.viewContext.$implicit = undefined;
      this.viewContext.ngrxLet = undefined;
      this.viewContext.error = undefined;
      this.viewContext.complete = false;
      this.viewContext.suspense = true;

      this.renderSuspenseView();
    },
    next: (event) => {
      this.viewContext.$implicit = event.value;
      this.viewContext.ngrxLet = event.value;
      this.viewContext.suspense = false;

      if (event.reset) {
        this.viewContext.error = undefined;
        this.viewContext.complete = false;
      }

      this.renderMainView(event.synchronous);
    },
    error: (event) => {
      this.viewContext.error = event.error;
      this.viewContext.suspense = false;

      if (event.reset) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.complete = false;
      }

      this.renderMainView(event.synchronous);
      this.errorHandler.handleError(event.error);
    },
    complete: (event) => {
      this.viewContext.complete = true;
      this.viewContext.suspense = false;

      if (event.reset) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.error = undefined;
      }

      this.renderMainView(event.synchronous);
    },
  });
  private readonly subscription = new Subscription();

  @Input()
  set ngrxLet(potentialObservable: PO) {
    this.renderEventManager.nextPotentialObservable(potentialObservable);
  }

  @Input('ngrxLetSuspenseTpl') suspenseTemplateRef?: TemplateRef<unknown>;

  constructor(
    private readonly mainTemplateRef: TemplateRef<
      LetViewContext<PO | undefined>
    >,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly errorHandler: ErrorHandler,
    private readonly renderScheduler: RenderScheduler
  ) {}

  static ngTemplateContextGuard<PO>(
    dir: LetDirective<PO>,
    ctx: unknown
  ): ctx is LetViewContext<PO> {
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

  private renderMainView(isSyncEvent: boolean): void {
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

    if (!isSyncEvent) {
      this.renderScheduler.schedule();
    }
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
  }
}
