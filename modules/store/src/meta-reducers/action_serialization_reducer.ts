import { ActionReducer } from '../models';
import { getUnserializable, throwIfUnserializable } from './utils';

export function actionSerializationCheckMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    const unserializable = getUnserializable(action);
    throwIfUnserializable(unserializable, 'action');

    return reducer(state, action);
  };
}
