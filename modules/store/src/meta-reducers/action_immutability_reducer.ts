import { ActionReducer } from '../models';
import { freeze } from './utils';

export function actionImmutabilityCheckMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    return reducer(state, freeze(action));
  };
}
