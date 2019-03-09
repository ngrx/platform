import { ActionReducer } from '../models';
import { getUnserializable, throwIfUnserializable } from './utils';

export function stateSerializationCheckMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    const nextState = reducer(state, action);

    const unserializable = getUnserializable(nextState);
    throwIfUnserializable(unserializable, 'state');

    return nextState;
  };
}
