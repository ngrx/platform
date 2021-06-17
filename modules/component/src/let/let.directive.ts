import {
  ChangeDetectorRef,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { NextObserver, ObservableInput, Observer, Unsubscribable } from 'rxjs';

import { CdAware, createCdAware } from '../core/cd-aware/cd-aware_creator';
import { createRender } from '../core/cd-aware/creator_render';

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
 * @Directive LetDirective
 *
 * @description
 *
 * The `*ngrxLet` directive serves a convenient way of binding observables to a view context (a dom element scope).
 * It also helps with several internal processing under the hood.
 *
 * The current way of binding an observable to the view looks like that:
 * ```html
 * <ng-container *ngIf="observableNumber$ as n">
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
 * - binding is always present. (`*ngIf="truthy$"`)
 * - it takes away the multiple usages of the `async` or `ngrxPush` pipe
 * - a unified/structured way of handling null and undefined
 * - triggers change-detection differently if `zone.js` is present or not (`ChangeDetectorRef.detectChanges` or `ChangeDetectorRef.markForCheck`)
 * - triggers change-detection differently if ViewEngine or Ivy is present (`ChangeDetectorRef.detectChanges` or `ɵdetectChanges`)
 * - distinct same values in a row (distinctUntilChanged operator),
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
export class LetDirective<U> implements OnDestroy {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static ngTemplateGuard_ngrxLet: 'binding';

  private embeddedView: any;
  private readonly viewContext: LetViewContext<U | undefined | null> = {
    $implicit: undefined,
    ngrxLet: undefined,
    $error: false,
    $complete: false,
  };

  protected readonly subscription: Unsubscribable;
  private readonly cdAware: CdAware<U | null | undefined>;
  private readonly resetContextObserver: NextObserver<void> = {
    next: () => {
      // if not initialized no need to set undefined
      if (this.embeddedView) {
        this.viewContext.$implicit = undefined;
        this.viewContext.ngrxLet = undefined;
        this.viewContext.$error = false;
        this.viewContext.$complete = false;
      }
    },
  };
  private readonly updateViewContextObserver: Observer<U | null | undefined> = {
    next: (value: U | null | undefined) => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.viewContext.$implicit = value;
      this.viewContext.ngrxLet = value;
    },
    error: (error: Error) => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.viewContext.$error = true;
    },
    complete: () => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.viewContext.$complete = true;
    },
  };

  static ngTemplateContextGuard<U>(
    dir: LetDirective<U>,
    ctx: unknown | null | undefined
  ): ctx is LetViewContext<U> {
    return true;
  }

  @Input()
  set ngrxLet(potentialObservable: ObservableInput<U> | null | undefined) {
    this.cdAware.nextPotentialObservable(potentialObservable);
  }

  constructor(
    cdRef: ChangeDetectorRef,
    ngZone: NgZone,
    private readonly templateRef: TemplateRef<LetViewContext<U>>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.cdAware = createCdAware<U>({
      render: createRender({ cdRef, ngZone }),
      resetContextObserver: this.resetContextObserver,
      updateViewContextObserver: this.updateViewContextObserver,
    });
    this.subscription = this.cdAware.subscribe();
  }

  createEmbeddedView() {
    this.embeddedView = this.viewContainerRef.createEmbeddedView(
      this.templateRef,
      this.viewContext
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
