import { Selector } from './models';

export type AnyFn = (...args: any[]) => any;

export type MemoizedProjection = { memoized: AnyFn; reset: () => void };

export type MemoizeFn = (t: AnyFn) => MemoizedProjection;

export interface MemoizedSelector<State, Result>
  extends Selector<State, Result> {
  release(): void;
  projector: AnyFn;
}

export function isEqualCheck(a: any, b: any): boolean {
  return a === b;
}

export function defaultMemoize(
  t: AnyFn,
  isEqual = isEqualCheck
): MemoizedProjection {
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
      if (!isEqual(arguments[i], lastArguments[i])) {
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
export function createSelector<State, S1, Result>(
  selectors: [Selector<State, S1>],
  projector: (s1: S1) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  projector: (s1: S1, s2: S2) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, Result>(
  selectors: [Selector<State, S1>, Selector<State, S2>],
  projector: (s1: S1, s2: S2) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  projector: (s1: S1, s2: S2, s3: S3) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, Result>(
  selectors: [Selector<State, S1>, Selector<State, S2>, Selector<State, S3>],
  projector: (s1: S1, s2: S2, s3: S3) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, S4, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
): MemoizedSelector<State, Result>;
export function createSelector<State, S1, S2, S3, S4, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>
  ],
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
export function createSelector<State, S1, S2, S3, S4, S5, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>,
    Selector<State, S5>
  ],
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
export function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>,
    Selector<State, S5>,
    Selector<State, S6>
  ],
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
export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>,
    Selector<State, S5>,
    Selector<State, S6>,
    Selector<State, S7>
  ],
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
export function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>,
    Selector<State, S5>,
    Selector<State, S6>,
    Selector<State, S7>,
    Selector<State, S8>
  ],
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
export function createSelector(...input: any[]) {
  return createSelectorFactory(defaultMemoize)(...input);
}

export function defaultStateFn(
  state: any,
  selectors: Selector<any, any>[],
  memoizedProjector: MemoizedProjection
): any {
  const args = selectors.map(fn => fn(state));

  return memoizedProjector.memoized.apply(null, args);
}

export type SelectorFactoryConfig<T = any, V = any> = {
  stateFn: (
    state: T,
    selectors: Selector<any, any>[],
    memoizedProjector: MemoizedProjection
  ) => V;
};

export function createSelectorFactory<T = any, V = any>(
  memoize: MemoizeFn
): (...input: any[]) => Selector<T, V>;
export function createSelectorFactory<T = any, V = any>(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<T, V>
): (...input: any[]) => Selector<T, V>;
export function createSelectorFactory(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<any, any> = {
    stateFn: defaultStateFn,
  }
) {
  return function(...input: any[]): Selector<any, any> {
    let args = input;
    if (Array.isArray(args[0])) {
      const [head, ...tail] = args;
      args = [...head, ...tail];
    }

    const selectors = args.slice(0, args.length - 1);
    const projector = args[args.length - 1];
    const memoizedSelectors = selectors.filter(
      (selector: any) =>
        selector.release && typeof selector.release === 'function'
    );

    const memoizedProjector = memoize(function(...selectors: any[]) {
      return projector.apply(null, selectors);
    });

    const memoizedState = defaultMemoize(function(state: any) {
      return options.stateFn.apply(null, [state, selectors, memoizedProjector]);
    });

    function release() {
      memoizedState.reset();
      memoizedProjector.reset();

      memoizedSelectors.forEach(selector => selector.release());
    }

    return Object.assign(memoizedState.memoized, {
      release,
      projector: memoizedProjector.memoized,
    });
  };
}

export function createFeatureSelector<T>(
  featureName: string
): MemoizedSelector<object, T> {
  return createSelector(
    (state: any) => state[featureName],
    (featureState: any) => featureState
  );
}
