import {
  isObservable,
  Observable,
  of,
  ReplaySubject,
  Subscription,
  throwError,
  combineLatest,
  Subject,
  queueScheduler,
  scheduled,
} from 'rxjs';
import {
  concatMap,
  takeUntil,
  withLatestFrom,
  map,
  distinctUntilChanged,
  shareReplay,
  take,
} from 'rxjs/operators';
import { debounceSync } from './debounce-sync';
import {
  Injectable,
  OnDestroy,
  Optional,
  InjectionToken,
  Inject,
} from '@angular/core';

/**
 * Return type of the effect, that behaves differently based on whether the
 * argument is passed to the callback.
 */
export interface EffectReturnFn<T> {
  (): void;
  (t: T | Observable<T>): Subscription;
}

export interface SelectConfig {
  debounce?: boolean;
}

export const initialStateToken = new InjectionToken('ComponentStore InitState');

@Injectable()
export class ComponentStore<T extends object> implements OnDestroy {
  // Should be used only in ngOnDestroy.
  private readonly destroySubject$ = new ReplaySubject<void>(1);
  // Exposed to any extending Store to be used for the teardowns.
  readonly destroy$ = this.destroySubject$.asObservable();

  private readonly stateSubject$ = new ReplaySubject<T>(1);
  private isInitialized = false;
  private notInitializedErrorMessage = `${this.constructor.name} has not been initialized`;
  // Needs to be after destroy$ is declared because it's used in select.
  readonly state$: Observable<T> = this.select((s) => s);

  constructor(@Optional() @Inject(initialStateToken) defaultState?: T) {
    // State can be initialized either through constructor or setState.
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
              ? // Push the value into queueScheduler
                scheduled([value], queueScheduler).pipe(
                  withLatestFrom(this.stateSubject$)
                )
              : // If state was not initialized, we'll throw an error.
                throwError(new Error(this.notInitializedErrorMessage))
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
    scheduled([state], queueScheduler).subscribe((s) => {
      this.isInitialized = true;
      this.stateSubject$.next(s);
    });
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

  protected get<R>(projector: (s: T) => R): R {
    if (!this.isInitialized) {
      throw new Error(this.notInitializedErrorMessage);
    }
    let value: R;
    this.stateSubject$.pipe(take(1)).subscribe((state) => {
      value = projector(state);
    });
    return value!;
  }

  /**
   * Creates a selector.
   *
   * This supports combining up to 4 selectors. More could be added as needed.
   *
   * @param projector A pure projection function that takes the current state and
   *   returns some new slice/projection of that state.
   * @param config SelectConfig that changes the behavoir of selector, including
   *   the debouncing of the values until the state is settled.
   * @return An observable of the projector results.
   */
  select<R>(projector: (s: T) => R, config?: SelectConfig): Observable<R>;
  select<R, S1>(
    s1: Observable<S1>,
    projector: (s1: S1) => R,
    config?: SelectConfig
  ): Observable<R>;
  select<R, S1, S2>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    projector: (s1: S1, s2: S2) => R,
    config?: SelectConfig
  ): Observable<R>;
  select<R, S1, S2, S3>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    projector: (s1: S1, s2: S2, s3: S3) => R,
    config?: SelectConfig
  ): Observable<R>;
  select<R, S1, S2, S3, S4>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    s4: Observable<S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => R,
    config?: SelectConfig
  ): Observable<R>;
  select<
    O extends Array<Observable<unknown> | SelectConfig | ProjectorFn>,
    R,
    ProjectorFn = (...a: unknown[]) => R
  >(...args: O): Observable<R> {
    const { observables, projector, config } = processSelectorArgs(args);

    let observable$: Observable<unknown>;
    // If there are no Observables to combine, then we'll just map the value.
    if (observables.length === 0) {
      observable$ = this.stateSubject$.pipe(
        config.debounce ? debounceSync() : (source$) => source$,
        map(projector)
      );
    } else {
      // If there are multiple arguments, then we're aggregating selectors, so we need
      // to take the combineLatest of them before calling the map function.
      observable$ = combineLatest(observables).pipe(
        config.debounce ? debounceSync() : (source$) => source$,
        map((projectorArgs) => projector(...projectorArgs))
      );
    }
    return (observable$ as Observable<R>).pipe(
      distinctUntilChanged(),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      }),
      takeUntil(this.destroy$)
    );
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

function processSelectorArgs<
  O extends Array<Observable<unknown> | SelectConfig | ProjectorFn>,
  R,
  ProjectorFn = (...a: unknown[]) => R
>(
  args: O
): {
  observables: Observable<unknown>[];
  projector: ProjectorFn;
  config: Required<SelectConfig>;
} {
  const selectorArgs = Array.from(args);
  // Assign default values.
  let config: Required<SelectConfig> = { debounce: false };
  let projector: ProjectorFn;
  // Last argument is either projector or config
  const projectorOrConfig = selectorArgs.pop() as ProjectorFn | SelectConfig;

  if (typeof projectorOrConfig !== 'function') {
    // We got the config as the last argument, replace any default values with it.
    config = { ...config, ...projectorOrConfig };
    // Pop the next args, which would be the projector fn.
    projector = selectorArgs.pop() as ProjectorFn;
  } else {
    projector = projectorOrConfig;
  }
  // The Observables to combine, if there are any.
  const observables = selectorArgs as Observable<unknown>[];
  return {
    observables,
    projector,
    config,
  };
}
