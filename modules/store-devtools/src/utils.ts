import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as Actions from './actions';
import {
  ActionSanitizer,
  StateSanitizer,
  Predicate,
  StoreDevtoolsConfig,
} from './config';
import {
  ComputedState,
  LiftedAction,
  LiftedActions,
  LiftedState,
} from './reducer';

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
  return new Actions.PerformAction(action, +Date.now());
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

/**
 * Read the config and tell if actions should be filtered
 */
export function shouldFilterActions(config: StoreDevtoolsConfig) {
  return config.predicate || config.actionsWhitelist || config.actionsBlacklist;
}

/**
 * Return a full filtered lifted state
 */
export function filterLiftedState(
  liftedState: LiftedState,
  predicate?: Predicate,
  whitelist?: string[],
  blacklist?: string[]
): LiftedState {
  const filteredStagedActionIds: number[] = [];
  const filteredActionsById: LiftedActions = {};
  const filteredComputedStates: ComputedState[] = [];
  liftedState.stagedActionIds.forEach((id, idx) => {
    const liftedAction = liftedState.actionsById[id];
    if (!liftedAction) return;
    if (
      idx &&
      isActionFiltered(
        liftedState.computedStates[idx],
        liftedAction,
        predicate,
        whitelist,
        blacklist
      )
    ) {
      return;
    }
    filteredActionsById[id] = liftedAction;
    filteredStagedActionIds.push(id);
    filteredComputedStates.push(liftedState.computedStates[idx]);
  });
  return {
    ...liftedState,
    stagedActionIds: filteredStagedActionIds,
    actionsById: filteredActionsById,
    computedStates: filteredComputedStates,
  };
}

/**
 * Return true is the action should be ignored
 */
export function isActionFiltered(
  state: any,
  action: LiftedAction,
  predicate?: Predicate,
  whitelist?: string[],
  blacklist?: string[]
) {
  return (
    (predicate && !predicate(state, action.action)) ||
    (whitelist && !action.action.type.match(whitelist.join('|'))) ||
    (blacklist && action.action.type.match(blacklist.join('|')))
  );
}
