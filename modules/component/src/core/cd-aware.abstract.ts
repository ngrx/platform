import {
  ChangeDetectorRef,
  EmbeddedViewRef,
  NgZone,
  OnDestroy,
  Type,
} from '@angular/core';
import {
  getChangeDetectionHandler,
  getGlobalThis,
  getRequestAnimationFrameInAngular,
  potentialObservableValue,
  remainHigherOrder,
} from './utils';
import {
  NextObserver,
  Observable,
  PartialObserver,
  Subject,
  Subscription,
} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { processCdAwareObservables } from './operators';

export interface CoalescingConfig {
  optimized: boolean;
}

// This abstract class holds all the shared logic for the push pipe and the let directive
// responsible for change detection
// If you extend this class you need to implement how the update of the rendered value happens.
// Also custom behaviour is something you need to implement in the extending class
export abstract class CdAware implements OnDestroy {
  globalThis = getGlobalThis();
  handleChangeDetection: <T>(component?: T) => void = getChangeDetectionHandler(
    this.ngZone,
    this.cdRef
  );
  protected requestAnimationFrameRef: (
    cb: () => void
  ) => number = getRequestAnimationFrameInAngular().bind(this.globalThis);
  protected subscription = new Subscription();
  protected observablesSubject = new Subject<potentialObservableValue<any>>();
  protected observables$ = this.observablesSubject.pipe(
    processCdAwareObservables(
      this.getResetContextBehaviour(),
      this.getUpdateContextBehaviour(),
      this.getConfigurableBehaviour()
    )
  );

  constructor(
    protected readonly cdRef: ChangeDetectorRef,
    protected readonly ngZone: NgZone
  ) {}

  work(): void {
    // cast is needed to make is work for typescript.
    // cdRef is kinda EmbeddedView
    this.handleChangeDetection(
      (this.cdRef as EmbeddedViewRef<Type<any>>).context
    );
  }

  // The side effect for when a new potential observable enters
  // Only the NextObserver is needed as we handle error and complete somewhere else
  abstract getResetContextObserver<T>(): NextObserver<T>;

  // The side effect for when a new value is emitted from the passed observable
  // Here we can use the next, error and complete channels for side-effects
  // We dont handle the error here
  abstract getUpdateViewContextObserver<T>(): PartialObserver<T>;

  // The custom behaviour of the observable carrying the values to render
  // Here we apply potential configurations as well as behaviour for different implementers ob this abstract calss
  abstract getConfigurableBehaviour<T>(): remainHigherOrder<T>;

  getUpdateContextBehaviour<T>(): remainHigherOrder<T> {
    return map(value$ =>
      value$.pipe(tap<T>(this.getUpdateViewContextObserver()))
    );
  }

  getResetContextBehaviour<T>(): remainHigherOrder<T> {
    return tap<Observable<T>>(this.getResetContextObserver());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
