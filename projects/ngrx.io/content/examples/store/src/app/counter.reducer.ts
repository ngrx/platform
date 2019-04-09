// #docregion
import { Action } from '@ngrx/store';
import { increment, decrement, reset } from './counter.actions';

export const initialState = 0;

export function counterReducer(state = initialState, action: Action) {
  switch (action.type) {
    case increment.type:
      return state + 1;

    case decrement.type:
      return state - 1;

    case reset.type:
      return 0;

    default:
      return state;
  }
}
