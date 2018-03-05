import { ActionSanitizer, StateSanitizer } from './config';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  LiftedState,
  LiftedAction,
  LiftedActions,
  ComputedState,
} from './reducer';
import * as Actions from './actions';

export function difference(first: any[], second: any[]) {
  return first.filter(item => second.indexOf(item) < 0);
}

/**
 * Provides an app's view into the state of the lifted store.
 */
export function unliftState(liftedState: LiftedState) {
  const { computedStates, currentStateIndex } = liftedState;
  const { state } = computedStates[currentStateIndex];

  return state;
}

export function unliftAction(liftedState: LiftedState): LiftedAction {
  return liftedState.actionsById[liftedState.nextActionId - 1];
}

/**
 * Lifts an app's action into an action on the lifted store.
 */
export function liftAction(action: Action) {
  return new Actions.PerformAction(action);
}

export function applyOperators(
  input$: Observable<any>,
  operators: any[][]
): Observable<any> {
  return operators.reduce((source$, [operator, ...args]) => {
    return operator.apply(source$, args);
  }, input$);
}

/**
 * Sanitizes given actions with given function.
 */
export function sanitizeActions(
  actionSanitizer: ActionSanitizer,
  actions: LiftedActions
): LiftedActions {
  return Object.keys(actions).reduce(
    (sanitizedActions, actionIdx) => {
      const idx = Number(actionIdx);
      sanitizedActions[idx] = sanitizeAction(
        actionSanitizer,
        actions[idx],
        idx
      );
      return sanitizedActions;
    },
    <LiftedActions>{}
  );
}

/**
 * Sanitizes given action with given function.
 */
export function sanitizeAction(
  actionSanitizer: ActionSanitizer,
  action: LiftedAction,
  actionIdx: number
): LiftedAction {
  return {
    ...action,
    action: actionSanitizer(action.action, actionIdx),
  };
}

/**
 * Sanitizes given states with given function.
 */
export function sanitizeStates(
  stateSanitizer: StateSanitizer,
  states: ComputedState[]
): ComputedState[] {
  return states.map((computedState, idx) => ({
    state: sanitizeState(stateSanitizer, computedState.state, idx),
    error: computedState.error,
  }));
}

/**
 * Sanitizes given state with given function.
 */
export function sanitizeState(
  stateSanitizer: StateSanitizer,
  state: any,
  stateIdx: number
) {
  return stateSanitizer(state, stateIdx);
}
