declare var require: any;
import { ActionReducer, Action } from '@ngrx/store';
const deepFreeze = require('deep-freeze-strict');

/**
 * Meta-reducer that prevents state from being mutated anywhere in the app.
 */
export function storeFreeze<T, V extends Action = Action>(
  reducer: ActionReducer<T, V>
): ActionReducer<T, V>;
export function storeFreeze<T, V extends Action = Action>(
  reducer: ActionReducer<T, V>
): ActionReducer<any, any> {
  return function freeze(state, action): any {
    state = state || {};

    deepFreeze(state);

    // guard against trying to freeze null or undefined types
    if (action.payload) {
      deepFreeze(action.payload);
    }

    const nextState = reducer(state, action);

    deepFreeze(nextState);

    return nextState;
  };
}
