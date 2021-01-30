import {
  ActionCreator,
  ActionCreatorProps,
  NotAllowedCheck,
  TypedAction,
} from './models';
import { createAction } from './action_creator';

export function createActionWithModifiers<
  T extends string,
  P extends object,
  MetaProps extends any[]
>(
  type: T,
  props: ActionCreatorProps<P> & NotAllowedCheck<P>,
  ...modifiers: [
    ...{
      [i in keyof MetaProps]: (
        p: P
      ) => (
        actionCreator: ActionCreator<T, (p: P) => TypedAction<T> & P>
      ) => ActionCreator<T, (p: P) => TypedAction<T> & P & MetaProps[i]>;
    }
  ]
) {
  const actionCreator = createAction(type, props) as ActionCreator<
    T,
    (p: P) => TypedAction<T> & P
  >;
  return modifiers.reduce((previous, current) => {
    const creator = (p: P) => {
      const action = previous(p);
      return {
        ...action,
        ...current(p)(previous)(p),
      };
    };
    creator.type = actionCreator.type;
    return creator;
  }, actionCreator);
}

export const createActionModifier = <A extends any[], M extends object>(
  modifier: (...args: [...A]) => M
) => (...args: [...A]) => <T extends string, P>(
  action: ActionCreator<T, (p: P) => TypedAction<T> & P>
) => {
  const creator = (p: P) => ({
    ...action(p),
    ...modifier(...args),
  });
  creator.type = action.type;
  return creator;
};
