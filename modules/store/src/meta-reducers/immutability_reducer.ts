import { ActionReducer } from '../models';
import { isFunction, hasOwnProperty, isObjectLike } from './utils';

export function immutabilityCheckMetaReducer(
  reducer: ActionReducer<any, any>,
  checks: { action: boolean; state: boolean }
): ActionReducer<any, any> {
  return function(state, action) {
    const act = checks.action ? freeze(action) : action;

    const nextState = reducer(state, act);

    return checks.state ? freeze(nextState) : nextState;
  };
}

function freeze(target: any) {
  Object.freeze(target);

  const targetIsFunction = isFunction(target);

  Object.getOwnPropertyNames(target).forEach(prop => {
    const propValue = target[prop];
    if (
      hasOwnProperty(target, prop) &&
      (targetIsFunction
        ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
        : true) &&
      (isObjectLike(propValue) || isFunction(propValue)) &&
      !Object.isFrozen(propValue)
    ) {
      freeze(propValue);
    }
  });

  return target;
}
