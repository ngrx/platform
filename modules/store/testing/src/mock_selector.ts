import { MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';

export interface MockSelector<State, Result>
  extends MemoizedSelector<State, Result> {
  setResult: (result?: Result) => void;
}

export interface MockSelectorWithProps<State, Props, Result>
  extends MemoizedSelectorWithProps<State, Props, Result> {
  setResult: (result?: Result) => void;
}
