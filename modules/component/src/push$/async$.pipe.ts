import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
  WrappedValue,
  ɵisObservable,
  ɵisPromise,
  ɵlooseIdentical,
} from '@angular/core';
import { from, Observable, Subject, throwError } from 'rxjs';
import {
  distinctUntilChanged,
  switchAll,
  takeUntil,
  tap,
} from 'rxjs/operators';

// import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

@Pipe({ name: 'async$', pure: false })
export class Async$Pipe implements OnDestroy, PipeTransform {
  private value: any = null;

  ngOnDestroy$$ = new Subject<boolean>();

  observablesToSubscribe$$ = new Subject<Observable<any>>();
  obs$ = this.observablesToSubscribe$$.pipe(distinctUntilChanged());

  handleIncomingObservables$ = this.obs$.pipe(
    distinctUntilChanged(ɵlooseIdentical),
    switchAll(),
    tap(v => (this.value = v)),
    tap(_ => this.ref.markForCheck())
  );

  constructor(private ref: ChangeDetectorRef) {
    this.handleIncomingObservables$
      .pipe(takeUntil(this.ngOnDestroy$$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$$.next(true);
  }

  transform<T>(obj: null): null;
  transform<T>(obj: undefined): undefined;
  transform<T>(obj: Observable<T> | null | undefined): T | null;
  transform<T>(obj: Promise<T> | null | undefined): T | null;
  transform(obj: Observable<any> | Promise<any> | null | undefined): any {
    this.observablesToSubscribe$$.next(toObservable(obj));
    return WrappedValue.wrap(this.value);

    function toObservable(obj: any) {
      if (ɵisObservable(obj) || ɵisPromise(obj)) return from(obj);
      else throwError(new Error('invalidPipeArgumentError'));
    }
  }
}
