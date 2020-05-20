import {
  isObservable,
  Observable,
  of,
  ReplaySubject,
  Subscription,
  throwError,
} from 'rxjs';
import { concatMap, takeUntil, withLatestFrom } from 'rxjs/operators';

export class ComponentStore<T extends object> {
  private readonly stateSubject$ = new ReplaySubject<T>(1);
  private isInitialized = false;
  readonly state$: Observable<T> = this.stateSubject$.asObservable();

  // Should be used only in ngOnDestroy.
  private readonly destroySubject$ = new ReplaySubject<void>(1);
  // Exposed to any extending Store to be used for the teardowns.
  readonly destroy$ = this.destroySubject$.asObservable();

  constructor(defaultState?: T) {
    // State can be initialized either through constructor, or initState or
    // setState.
    if (defaultState) {
      this.initState(defaultState);
    }
  }

  /** Completes all relevant Observable streams. */
  ngOnDestroy() {
    this.stateSubject$.complete();
    this.destroySubject$.next();
  }

  /**
   * Creates an updater.
   *
   * Throws an error if updater is called with synchronous values (either
   * imperative value or Observable that is synchronous) before ComponentStore
   * is initialized. If called with async Observable before initialization then
   * state will not be updated and subscription would be closed.
   *
   * @param updaterFn A static updater function that takes 2 parameters (the
   * current state and an argument object) and returns a new instance of the
   * state.
   * @return A function that accepts one argument which is forwarded as the
   *     second argument to `updaterFn`. Everytime this function is called
   *     subscribers will be notified of the state change.
   */
  updater<V>(
    updaterFn: (state: T, value: V) => T
  ): unknown extends V ? () => void : (t: V | Observable<V>) => Subscription {
    return ((observableOrValue?: V | Observable<V>): Subscription => {
      let initializationError: Error | undefined;
      // We can receive either the value or an observable. In case it's a
      // simple value, we'll wrap it with `of` operator to turn it into
      // Observable.
      const observable$ = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue);
      const subscription = observable$
        .pipe(
          concatMap(
            value =>
              this.isInitialized
                ? of(value).pipe(withLatestFrom(this.stateSubject$))
                : // If state was not initialized, we'll throw an error.
                  throwError(
                    Error(`${this.constructor.name} has not been initialized`)
                  )
          ),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: ([value, currentState]) => {
            this.stateSubject$.next(updaterFn(currentState, value!));
          },
          error: error => {
            initializationError = error;
            this.stateSubject$.error(error);
          },
        });

      if (initializationError) {
        throw initializationError;
      }
      return subscription;
    }) as unknown extends V
      ? () => void
      : (t: V | Observable<V>) => Subscription;
  }

  /**
   * Initializes state. If it was already initialized then it resets the
   * state.
   */
  private initState(state: T): void {
    this.isInitialized = true;
    this.stateSubject$.next(state);
  }

  /**
   * Sets the state specific value.
   * @param stateOrUpdaterFn object of the same type as the state or an
   * updaterFn, returning such object.
   */
  setState(stateOrUpdaterFn: T | ((state: T) => T)): void {
    if (typeof stateOrUpdaterFn !== 'function') {
      this.initState(stateOrUpdaterFn);
    } else {
      this.updater(stateOrUpdaterFn as (state: T) => T)();
    }
  }
}
