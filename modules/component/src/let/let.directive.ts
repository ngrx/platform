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
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  CdAware,
  coalesce,
  CoalescingConfig,
  remainHigherOrder,
  STATE_DEFAULT,
} from '../core';

export interface NgRxLetConfig extends CoalescingConfig {}

export interface LetContext {
  // to enable `let` syntax we have to use $implicit (var; let v = var)
  $implicit?: any;
  // to enable `as` syntax we have to assign the directives selector (var as v)
  ngrxLet?: any;
  // set context var complete to true (var$; let v = $error)
  $error?: Error | undefined;
  // set context var complete to true (var$; let v = $complete)
  $complete?: boolean | undefined;
}

function getLetContextObj(): LetContext {
  return {
    $implicit: undefined,
    ngrxLet: undefined,
    $error: undefined,
    $complete: undefined,
  };
}

@Directive({
  selector: '[ngrxLet]',
})
export class LetDirective extends CdAware implements OnInit, OnDestroy {
  private ViewContext = getLetContextObj();
  configSubject = new ReplaySubject<NgRxLetConfig>();
  config$ = this.configSubject.pipe(
    filter(v => v !== undefined),
    distinctUntilChanged()
  );

  @Input()
  set ngrxLet(obs: Observable<any>) {
    this.observablesSubject.next(obs);
  }

  @Input()
  set ngrxLetConfig(config: NgRxLetConfig) {
    this.configSubject.next(config);
  }

  constructor(
    cdRef: ChangeDetectorRef,
    ngZone: NgZone,
    private readonly templateRef: TemplateRef<LetContext>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    super(cdRef, ngZone);
    this.subscription = this.observables$.subscribe();
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
        this.ViewContext.$implicit = STATE_DEFAULT;
        this.ViewContext.ngrxLet = STATE_DEFAULT;
        this.ViewContext.$error = STATE_DEFAULT;
        this.ViewContext.$complete = STATE_DEFAULT;
      },
    };
  }

  getUpdateViewContextObserver<T>(): PartialObserver<T> {
    return {
      next: value => {
        this.ViewContext.$implicit = value;
        this.ViewContext.ngrxLet = value;
      },
      error: error => (this.ViewContext.$error = error),
      complete: () => (this.ViewContext.$complete = true),
    };
  }

  getConfigurableBehaviour<T>(): remainHigherOrder<T> {
    return pipe(
      withLatestFrom(this.config$),
      map(([value$, config]: [Observable<any>, NgRxLetConfig]) => {
        return !config.optimized
          ? value$.pipe(tap(_ => this.work()))
          : value$.pipe(
              coalesce({
                context: (this.cdRef as any)._cdRefInjectingView,
                executionContextRef: this.requestAnimationFrameRef,
              })
            );
      })
    );
  }
}
