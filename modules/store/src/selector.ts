import { Selector } from './models';

export interface MemoizedSelector<State, Result>
  extends Selector<State, Result> {
  release(): void;
}

export type AnyFn = (...args: any[]) => any;

export function memoize(t: AnyFn): { memoized: AnyFn; reset: () => void } {
  let lastArguments: null | IArguments = null;
  let lastResult: any = null;

  function reset() {
    lastArguments = null;
    lastResult = null;
  }

  function memoized(): any {
    if (!lastArguments) {
      lastResult = t.apply(null, arguments);
      lastArguments = arguments;

      return lastResult;
    }
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i] !== lastArguments[i]) {
        lastResult = t.apply(null, arguments);
        lastArguments = arguments;

        return lastResult;
      }
    }

    return lastResult;
  }

  return { memoized, reset };
}

export function createSelector<State, S1, Result>(
  s1: Selector<State, S1>,
  projector: (S1: S1) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  projector: (s1: S1, s2: S2) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  projector: (s1: S1, s2: S2, s3: S3) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, S4, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, S4, S5, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  s6: Selector<State, S6>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  s6: Selector<State, S6>,
  s7: Selector<State, S7>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  s6: Selector<State, S6>,
  s7: Selector<State, S7>,
  s8: Selector<State, S8>,
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    s7: S7,
    s8: S8
  ) => Result
): MemoizedSelector<State, Result>;
export function createSelector(...args: any[]): Selector<any, any> {
  const selectors = args.slice(0, args.length - 1);
  const projector = args[args.length - 1];
  const memoizedSelectors = selectors.filter(
    (selector: any) =>
      selector.release && typeof selector.release === 'function'
  );

  const memoizedProjector = memoize(function(...selectors: any[]) {
    return projector.apply(null, selectors);
  });

  const memoizedState = memoize(function(state: any) {
    const args = selectors.map(fn => fn(state));

    return memoizedProjector.memoized.apply(null, args);
  });

  function release() {
    memoizedState.reset();
    memoizedProjector.reset();

    memoizedSelectors.forEach(selector => selector.release());
  }

  return Object.assign(memoizedState.memoized, { release });
}

export function createFeatureSelector<T>(
  featureName: string
): MemoizedSelector<object, T> {
  const { memoized, reset } = memoize(function(state: any): any {
    return state[featureName];
  });

  return Object.assign(memoized, { release: reset });
}
