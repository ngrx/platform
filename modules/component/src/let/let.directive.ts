import {
  ChangeDetectorRef,
  Directive,
  EmbeddedViewRef,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';

import {
  EMPTY,
  NextObserver,
  Observable,
  PartialObserver,
  ReplaySubject,
  Unsubscribable,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';
import {
  CdAware,
  CoalescingConfig as NgRxLetConfig,
  createCdAware,
  setUpWork,
} from '../core';

export interface LetViewContext<T> {
  // to enable `let` syntax we have to use $implicit (var; let v = var)
  $implicit?: T;
  // to enable `as` syntax we have to assign the directives selector (var as v)
  ngrxLet?: T;
  // set context var complete to true (var$; let v = $error)
  $error?: boolean;
  // set context var complete to true (var$; let v = $complete)
  $complete?: boolean;
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
 * ### Examples
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
  private embeddedView: any;
  private readonly ViewContext: LetViewContext<U | undefined | null> = {
    $implicit: undefined,
    ngrxLet: undefined,
    $error: false,
    $complete: false,
  };

  private readonly configSubject = new ReplaySubject<NgRxLetConfig>();
  private readonly config$ = this.configSubject.pipe(
    filter(v => v !== undefined && v !== null),
    distinctUntilChanged(),
    startWith({ optimized: true })
  );

  protected readonly subscription: Unsubscribable;
  private readonly cdAware: CdAware<U | null | undefined>;
  private readonly resetContextObserver: NextObserver<unknown> = {
    next: () => {
      // if not initialized no need to set undefined
      if (this.embeddedView) {
        this.ViewContext.$implicit = undefined;
        this.ViewContext.ngrxLet = undefined;
        this.ViewContext.$error = false;
        this.ViewContext.$complete = false;
      }
    },
  };
  private readonly updateViewContextObserver: PartialObserver<
    U | null | undefined
  > = {
    next: (value: U | null | undefined) => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.ViewContext.$implicit = value;
      this.ViewContext.ngrxLet = value;
    },
    error: (error: Error) => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.ViewContext.$error = true;
    },
    complete: () => {
      // to have init lazy
      if (!this.embeddedView) {
        this.createEmbeddedView();
      }
      this.ViewContext.$complete = true;
    },
  };

  static ngTemplateContextGuard<U>(
    dir: LetDirective<U>,
    ctx: unknown
  ): ctx is LetViewContext<U> {
    return true;
  }

  private readonly configurableBehaviour = <T>(
    o$: Observable<Observable<T>>
  ): Observable<Observable<T>> =>
    o$.pipe(
      withLatestFrom(this.config$),
      // @NOTICE: unused config => As discussed with Brandon we keep it here because in the beta release we implement configuration behavior here
      map(([value$, config]) => {
        return value$.pipe(catchError(e => EMPTY));
      })
    );

  @Input()
  set ngrxLet(
    potentialObservable: Observable<U> | Promise<U> | null | undefined
  ) {
    this.cdAware.next(potentialObservable);
  }

  @Input()
  set ngrxLetConfig(config: NgRxLetConfig) {
    this.configSubject.next(config || { optimized: true });
  }

  constructor(
    cdRef: ChangeDetectorRef,
    ngZone: NgZone,
    private readonly templateRef: TemplateRef<LetViewContext<U>>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.cdAware = createCdAware<U>({
      work: setUpWork({
        cdRef,
        ngZone,
        context: (cdRef as EmbeddedViewRef<Type<any>>).context,
      }),
      resetContextObserver: this.resetContextObserver,
      updateViewContextObserver: this.updateViewContextObserver,
      configurableBehaviour: this.configurableBehaviour,
    });
    this.subscription = this.cdAware.subscribe();
  }

  createEmbeddedView() {
    this.embeddedView = this.viewContainerRef.createEmbeddedView(
      this.templateRef,
      this.ViewContext
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.viewContainerRef.clear();
  }
}
