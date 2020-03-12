import { ChangeDetectorRef, NgZone, Pipe, PipeTransform } from '@angular/core';
import { NextObserver, Observable, PartialObserver, pipe, Subject } from 'rxjs';
import { distinctUntilChanged, map, tap, withLatestFrom } from 'rxjs/operators';
import {
  CdAware,
  // This will later on replaced by a new NgRxPushPipeConfig interface
  CoalescingConfig as NgRxPushPipeConfig,
  RemainHigherOrder,
  STATE_DEFAULT,
} from '../core';

@Pipe({ name: 'ngrxPush', pure: false })
export class PushPipe extends CdAware implements PipeTransform {
  private renderedValue: any | null | undefined = STATE_DEFAULT;

  private readonly configSubject = new Subject<NgRxPushPipeConfig>();
  private readonly config$ = this.configSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(cdRef: ChangeDetectorRef, ngZone: NgZone) {
    super(cdRef, ngZone);
    this.subscription.add(this.observables$.subscribe());
  }

  transform<T>(potentialObservable: null, config?: NgRxPushPipeConfig): null;
  transform<T>(
    potentialObservable: undefined,
    config?: NgRxPushPipeConfig
  ): undefined;
  transform<T>(
    potentialObservable: Observable<T>,
    config?: NgRxPushPipeConfig
  ): T;
  transform<T>(
    potentialObservable: Observable<T> | null | undefined,
    config: NgRxPushPipeConfig = { optimized: true }
  ): T | null | undefined {
    this.configSubject.next(config);
    this.observablesSubject.next(potentialObservable);
    return this.renderedValue;
  }

  getConfigurableBehaviour<T>(): RemainHigherOrder<T> {
    return pipe(
      withLatestFrom(this.config$),
      map(([value$, config]) => {
        // As discussed with Brandon we keep it here because in the beta we implement configuration behavior here
        return !config.optimized
          ? value$.pipe(tap(() => this.work()))
          : value$.pipe(
              // @TODO Add coalesce operator here
              tap(() => this.work())
            );
      })
    );
  }

  getUpdateViewContextObserver(): PartialObserver<any> {
    return {
      // assign value that will get returned from the transform function on the next change detection
      next: (value: any) => (this.renderedValue = value),
      error: (error: Error) => (this.renderedValue = error.message),
    };
  }

  getResetContextObserver(): NextObserver<any> {
    return {
      next: _ => (this.renderedValue = STATE_DEFAULT),
    };
  }
}
