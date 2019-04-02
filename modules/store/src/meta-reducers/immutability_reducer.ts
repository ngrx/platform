import { ActionReducer } from '../models';
import { isFunction, hasOwnProperty, isObjectLike } from './utils';

export function immutabilityCheckMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    const nextState = reducer(state, freeze(action));
    return freeze(nextState);
  };
}

function freeze(target: any) {
  Object.freeze(target);

  const targetIsFunction = isFunction(target);

  Object.getOwnPropertyNames(target).forEach(prop => {
    const propValue = target[prop];
    if (
      hasOwnProperty(target, prop) && targetIsFunction
        ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
        : true &&
          (isObjectLike(propValue) || isFunction(propValue)) &&
          !Object.isFrozen(propValue)
    ) {
      freeze(propValue);
    }
  });

  return target;
}
