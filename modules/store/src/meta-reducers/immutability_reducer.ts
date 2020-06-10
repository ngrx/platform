import { ActionReducer, Action } from '../models';
import { isFunction, hasOwnProperty, isObjectLike } from './utils';

export function immutabilityCheckMetaReducer(
  reducer: ActionReducer<any, any>,
  checks: { action: (action: Action) => boolean; state: () => boolean }
): ActionReducer<any, any> {
  return function (state, action) {
    const act = checks.action(action) ? freeze(action) : action;

    const nextState = reducer(state, act);

    return checks.state() ? freeze(nextState) : nextState;
  };
}

function freeze(target: any) {
  Object.freeze(target);

  const targetIsFunction = isFunction(target);

  Object.getOwnPropertyNames(target).forEach((prop) => {
    // Ignore Ivy properties, ref: https://github.com/ngrx/platform/issues/2109#issuecomment-582689060
    if (prop.startsWith('ɵ')) {
      return;
    }

    if (
      hasOwnProperty(target, prop) &&
      (targetIsFunction
        ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
        : true)
    ) {
      const propValue = target[prop];

      if (
        (isObjectLike(propValue) || isFunction(propValue)) &&
        !Object.isFrozen(propValue)
      ) {
        freeze(propValue);
      }
    }
  });

  return target;
}
