import {
  isObservable,
  Observable,
  of,
  ReplaySubject,
  Subscription,
  throwError,
  combineLatest,
  Subject,
} from 'rxjs';
import {
  concatMap,
  takeUntil,
  withLatestFrom,
  map,
  distinctUntilChanged,
  shareReplay,
} from 'rxjs/operators';
import { debounceSync } from './debounceSync';

/**
 * Return type of the effect, that behaves differently based on whether the
 * argument is passed to the callback.
 */
export interface EffectReturnFn<T> {
  (): void;
  (t: T | Observable<T>): Subscription;
}

export class ComponentStore<T extends object> {
  // Should be used only in ngOnDestroy.
  private readonly destroySubject$ = new ReplaySubject<void>(1);
  // Exposed to any extending Store to be used for the teardowns.
  readonly destroy$ = this.destroySubject$.asObservable();

  private readonly stateSubject$ = new ReplaySubject<T>(1);
  private isInitialized = false;
  // Needs to be after destroy$ is declared because it's used in select.
  readonly state$: Observable<T> = this.select((s) => s);

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
          concatMap((value) =>
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
          error: (error: Error) => {
            initializationError = error;
            this.stateSubject$.error(error);
          },
        });

      if (initializationError) {
        // prettier-ignore
        throw /** @type {!Error} */ (initializationError);
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

  /**
   * Creates a selector.
   *
   * This supports chaining up to 4 selectors. More could be added as needed.
   *
   * @param projector A pure projection function that takes the current state and
   *   returns some new slice/projection of that state.
   * @return An observable of the projector results.
   */
  select<R>(projector: (s: T) => R): Observable<R>;
  select<R, S1>(s1: Observable<S1>, projector: (s1: S1) => R): Observable<R>;
  select<R, S1, S2>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    projector: (s1: S1, s2: S2) => R
  ): Observable<R>;
  select<R, S1, S2, S3>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    projector: (s1: S1, s2: S2, s3: S3) => R
  ): Observable<R>;
  select<R, S1, S2, S3, S4>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    s4: Observable<S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => R
  ): Observable<R>;
  select<R>(...args: any[]): Observable<R> {
    let observable$: Observable<R>;
    // project is always the last argument, so `pop` it from args.
    const projector: (...args: any[]) => R = args.pop();
    if (args.length === 0) {
      // If projector was the only argument then we'll use map operator.
      observable$ = this.stateSubject$.pipe(map(projector));
    } else {
      // If there are multiple arguments, we're chaining selectors, so we need
      // to take the combineLatest of them before calling the map function.
      observable$ = combineLatest(args).pipe(
        // The most performant way to combine Observables avoiding unnecessary
        // emissions and projector calls.
        debounceSync(),
        map((args: any[]) => projector(...args))
      );
    }
    const distinctSharedObservable$ = observable$.pipe(
      distinctUntilChanged(),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      }),
      takeUntil(this.destroy$)
    );
    return distinctSharedObservable$;
  }

  /**
   * Creates an effect.
   *
   * This effect is subscribed to for the life of the @Component.
   * @param generator A function that takes an origin Observable input and
   *     returns an Observable. The Observable that is returned will be
   *     subscribed to for the life of the component.
   * @return A function that, when called, will trigger the origin Observable.
   */
  effect<V, R = unknown>(
    generator: (origin$: Observable<V>) => Observable<R>
  ): EffectReturnFn<V> {
    const origin$ = new Subject<V>();
    generator(origin$)
      // tied to the lifecycle 👇 of ComponentStore
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    return (observableOrValue?: V | Observable<V>): Subscription => {
      const observable$ = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue);
      return observable$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        // any new 👇 value is pushed into a stream
        origin$.next(value);
      });
    };
  }
}
