import { Selector, SelectorWithProps } from './models';
import { isDevMode } from '@angular/core';
import { isNgrxMockEnvironment } from './flags';

export type AnyFn = (...args: any[]) => any;

export type MemoizedProjection = {
  memoized: AnyFn;
  reset: () => void;
  setResult: (result?: any) => void;
  clearResult: () => void;
};

export type MemoizeFn = (t: AnyFn) => MemoizedProjection;

export type ComparatorFn = (a: any, b: any) => boolean;

export type DefaultProjectorFn<T> = (...args: any[]) => T;

export interface MemoizedSelector<
  State,
  Result,
  ProjectorFn = DefaultProjectorFn<Result>
> extends Selector<State, Result> {
  release(): void;
  projector: ProjectorFn;
  setResult: (result?: Result) => void;
  clearResult: () => void;
}

export interface MemoizedSelectorWithProps<
  State,
  Props,
  Result,
  ProjectorFn = DefaultProjectorFn<Result>
> extends SelectorWithProps<State, Props, Result> {
  release(): void;
  projector: ProjectorFn;
  setResult: (result?: Result) => void;
  clearResult: () => void;
}

export function isEqualCheck(a: any, b: any): boolean {
  return a === b;
}

function isArgumentsChanged(
  args: IArguments,
  lastArguments: IArguments,
  comparator: ComparatorFn
) {
  for (let i = 0; i < args.length; i++) {
    if (!comparator(args[i], lastArguments[i])) {
      return true;
    }
  }
  return false;
}

export function resultMemoize(
  projectionFn: AnyFn,
  isResultEqual: ComparatorFn
) {
  return defaultMemoize(projectionFn, isEqualCheck, isResultEqual);
}

export function defaultMemoize(
  projectionFn: AnyFn,
  isArgumentsEqual = isEqualCheck,
  isResultEqual = isEqualCheck
): MemoizedProjection {
  let lastArguments: null | IArguments = null;
  // tslint:disable-next-line:no-any anything could be the result.
  let lastResult: any = null;
  let overrideResult: any;

  function reset() {
    lastArguments = null;
    lastResult = null;
  }

  function setResult(result: any = undefined) {
    overrideResult = { result };
  }

  function clearResult() {
    overrideResult = undefined;
  }

  // tslint:disable-next-line:no-any anything could be the result.
  function memoized(): any {
    if (overrideResult !== undefined) {
      return overrideResult.result;
    }

    if (!lastArguments) {
      lastResult = projectionFn.apply(null, arguments as any);
      lastArguments = arguments;
      return lastResult;
    }

    if (!isArgumentsChanged(arguments, lastArguments, isArgumentsEqual)) {
      return lastResult;
    }

    const newResult = projectionFn.apply(null, arguments as any);
    lastArguments = arguments;

    if (isResultEqual(lastResult, newResult)) {
      return lastResult;
    }

    lastResult = newResult;

    return newResult;
  }

  return { memoized, reset, setResult, clearResult };
}

type StateOfSelectors<S> = S extends Selector<infer State, any>[]
  ? State
  : never;

type ValueOfSelector<S> = S extends Selector<any, infer Value> ? Value : never;

export function createSelector<S extends Selector<any, any>[], Result>(
  ...args: [
    ...S,
    (...args: [...{ [i in keyof S]: ValueOfSelector<S[i]> }]) => Result
  ]
): MemoizedSelector<StateOfSelectors<S>, Result>;
export function createSelector<
  S extends SelectorWithProps<any, any, any>[],
  Props,
  Result
>(
  ...args: [
    ...S,
    (...args: [...{ [i in keyof S]: ValueOfSelector<S[i]> }, Props]) => Result
  ]
): MemoizedSelectorWithProps<StateOfSelectors<S>, Props, Result>;
export function createSelector<S extends Selector<any, any>[], Result>(
  selectors: S,
  projector: (...args: [...{ [i in keyof S]: ValueOfSelector<S[i]> }]) => Result
): MemoizedSelector<StateOfSelectors<S>, Result>;
export function createSelector<
  S extends MemoizedSelectorWithProps<any, any, any>[],
  Props,
  Result
>(
  selectors: S,
  projector: (
    ...args: [...{ [i in keyof S]: ValueOfSelector<S[i]> }, Props]
  ) => Result
): MemoizedSelectorWithProps<StateOfSelectors<S>, Props, Result>;

export function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any> {
  return createSelectorFactory(defaultMemoize)(...input);
}

export function defaultStateFn(
  state: any,
  selectors: Selector<any, any>[] | SelectorWithProps<any, any, any>[],
  props: any,
  memoizedProjector: MemoizedProjection
): any {
  if (props === undefined) {
    const args = (<Selector<any, any>[]>selectors).map((fn) => fn(state));
    return memoizedProjector.memoized.apply(null, args);
  }

  const args = (<SelectorWithProps<any, any, any>[]>selectors).map((fn) =>
    fn(state, props)
  );
  return memoizedProjector.memoized.apply(null, [...args, props]);
}

export type SelectorFactoryConfig<T = any, V = any> = {
  stateFn: (
    state: T,
    selectors: Selector<any, any>[],
    props: any,
    memoizedProjector: MemoizedProjection
  ) => V;
};

export function createSelectorFactory<T = any, V = any>(
  memoize: MemoizeFn
): (...input: any[]) => MemoizedSelector<T, V>;
export function createSelectorFactory<T = any, V = any>(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<T, V>
): (...input: any[]) => MemoizedSelector<T, V>;
export function createSelectorFactory<T = any, Props = any, V = any>(
  memoize: MemoizeFn
): (...input: any[]) => MemoizedSelectorWithProps<T, Props, V>;
export function createSelectorFactory<T = any, Props = any, V = any>(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<T, V>
): (...input: any[]) => MemoizedSelectorWithProps<T, Props, V>;
/**
 *
 * @param memoize The function used to memoize selectors
 * @param options Config Object that may include a `stateFn` function defining how to return the selector's value, given the entire `Store`'s state, parent `Selector`s, `Props`, and a `MemoizedProjection`
 *
 * @usageNotes
 *
 * **Creating a Selector Factory Where Array Order Does Not Matter**
 *
 * ```ts
 * function removeMatch(arr: string[], target: string): string[] {
 *   const matchIndex = arr.indexOf(target);
 *   return [...arr.slice(0, matchIndex), ...arr.slice(matchIndex + 1)];
 * }
 *
 * function orderDoesNotMatterComparer(a: any, b: any): boolean {
 *   if (!Array.isArray(a) || !Array.isArray(b)) {
 *     return a === b;
 *   }
 *   if (a.length !== b.length) {
 *     return false;
 *   }
 *   let tempB = [...b];
 *   function reduceToDetermineIfArraysContainSameContents(
 *     previousCallResult: boolean,
 *     arrayMember: any
 *   ): boolean {
 *     if (previousCallResult === false) {
 *       return false;
 *     }
 *     if (tempB.includes(arrayMember)) {
 *       tempB = removeMatch(tempB, arrayMember);
 *       return true;
 *     }
 *     return false;
 *   }
 *   return a.reduce(reduceToDetermineIfArraysContainSameContents, true);
 * }
 *
 * export const creactOrderDoesNotMatterSelector = createSelectorFactory(
 *   (projectionFun) => defaultMemoize(
 *     projectionFun,
 *     orderDoesNotMatterComparer,
 *     orderDoesNotMatterComparer
 *   )
 * );
 * ```
 *
 * **Creating an Alternative Memoization Strategy**
 *
 * ```ts
 * function serialize(x: any): string {
 *   return JSON.stringify(x);
 * }
 *
 * export const createFullHistorySelector = createSelectorFactory(
 *  (projectionFunction) => {
 *    const cache = {};
 *
 *    function memoized() {
 *      const serializedArguments = serialize(...arguments);
 *       if (cache[serializedArguments] != null) {
 *         cache[serializedArguments] = projectionFunction.apply(null, arguments);
 *       }
 *       return cache[serializedArguments];
 *     }
 *     return {
 *       memoized,
 *       reset: () => {},
 *       setResult: () => {},
 *       clearResult: () => {},
 *     };
 *   }
 * );
 * ```
 *
 *
 */
export function createSelectorFactory(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<any, any> = {
    stateFn: defaultStateFn,
  }
) {
  return function (
    ...input: any[]
  ): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any> {
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

    const memoizedProjector = memoize(function (...selectors: any[]) {
      return projector.apply(null, selectors);
    });

    const memoizedState = defaultMemoize(function (state: any, props: any) {
      return options.stateFn.apply(null, [
        state,
        selectors,
        props,
        memoizedProjector,
      ]);
    });

    function release() {
      memoizedState.reset();
      memoizedProjector.reset();

      memoizedSelectors.forEach((selector) => selector.release());
    }

    return Object.assign(memoizedState.memoized, {
      release,
      projector: memoizedProjector.memoized,
      setResult: memoizedState.setResult,
      clearResult: memoizedState.clearResult,
    });
  };
}

export function createFeatureSelector<T>(
  featureName: string
): MemoizedSelector<object, T>;
export function createFeatureSelector<T, V>(
  featureName: keyof T
): MemoizedSelector<T, V>;
export function createFeatureSelector(
  featureName: any
): MemoizedSelector<any, any> {
  return createSelector(
    (state: any) => {
      const featureState = state[featureName];
      if (!isNgrxMockEnvironment() && isDevMode() && !(featureName in state)) {
        console.warn(
          `@ngrx/store: The feature name \"${featureName}\" does ` +
            'not exist in the state, therefore createFeatureSelector ' +
            'cannot access it.  Be sure it is imported in a loaded module ' +
            `using StoreModule.forRoot('${featureName}', ...) or ` +
            `StoreModule.forFeature('${featureName}', ...).  If the default ` +
            'state is intended to be undefined, as is the case with router ' +
            'state, this development-only warning message can be ignored.'
        );
      }
      return featureState;
    },
    (featureState: any) => featureState
  );
}
