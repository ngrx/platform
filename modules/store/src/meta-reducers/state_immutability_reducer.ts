import { ActionReducer } from '../models';
import { freeze } from './utils';

export function stateImmutabilityCheckMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    const nextState = reducer(state, action);
    return freeze(nextState);
  };
}
