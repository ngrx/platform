import {
  ChangeDetectorRef,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import {
  NextObserver,
  Observable,
  PartialObserver,
  pipe,
  ReplaySubject,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  CdAware,
  // This will later on replaced by a new NgRxLetConfig interface
  CoalescingConfig as NgRxLetConfig,
  RemainHigherOrder,
} from '../core';

export interface LetContext<T> {
  // to enable `let` syntax we have to use $implicit (var; let v = var)
  $implicit?: T;
  // to enable `as` syntax we have to assign the directives selector (var as v)
  ngrxLet?: T;
  // set context var complete to true (var$; let v = $error)
  $error?: Error | undefined;
  // set context var complete to true (var$; let v = $complete)
  $complete?: boolean | undefined;
}

function getLetContextObj<T>(): LetContext<T> {
  return {
    $implicit: undefined,
    ngrxLet: undefined,
    $error: undefined,
    $complete: undefined,
  };
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
 * `<ng-container *let="observableNumber$ as c"></ng-container>`
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
 ```
 *
 * @publicApi
 */
@Directive({ selector: '[ngrxLet]' })
export class LetDirective<D> extends CdAware implements OnInit, OnDestroy {
  private readonly ViewContext = getLetContextObj<D>();
  private readonly configSubject = new ReplaySubject<NgRxLetConfig>();
  private readonly config$ = this.configSubject.pipe(
    filter(v => v !== undefined),
    distinctUntilChanged(),
    startWith({ optimized: true })
  );

  static ngTemplateContextGuard<R>(
    dir: LetDirective<R>,
    ctx: unknown
  ): ctx is LetContext<R> {
    return true;
  }

  @Input()
  set ngrxLet(potentialObservable: Observable<any>) {
    this.observablesSubject.next(potentialObservable);
  }

  @Input()
  set ngrxLetConfig(config: NgRxLetConfig) {
    this.configSubject.next(config || { optimized: true });
  }

  constructor(
    cdRef: ChangeDetectorRef,
    ngZone: NgZone,
    private readonly templateRef: TemplateRef<LetContext<D>>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    super(cdRef, ngZone);
    this.subscription.add(this.observables$.subscribe());
  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(
      this.templateRef,
      this.ViewContext
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.viewContainerRef.clear();
  }

  getResetContextObserver(): NextObserver<any> {
    return {
      next: _ => {
        this.ViewContext.$implicit = undefined;
        this.ViewContext.ngrxLet = undefined;
        this.ViewContext.$error = undefined;
        this.ViewContext.$complete = undefined;
      },
    };
  }

  getUpdateViewContextObserver(): PartialObserver<D> {
    return {
      next: (value: D) => {
        this.ViewContext.$implicit = value;
        this.ViewContext.ngrxLet = value;
      },
      error: error => (this.ViewContext.$error = error),
      complete: () => (this.ViewContext.$complete = true),
    };
  }

  getConfigurableBehaviour<T>(): RemainHigherOrder<T> {
    return pipe(
      withLatestFrom(this.config$),
      map(([value$, config]: [Observable<any>, NgRxLetConfig]) => {
        // As discussed with Brandon we keep it here because in the beta we implement configuration behavior here
        return !config.optimized
          ? value$.pipe(tap(() => this.work()))
          : value$.pipe(
              // @TODO add coalesce operator here
              tap(() => this.work())
            );
      })
    );
  }
}
