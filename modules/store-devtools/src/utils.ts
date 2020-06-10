import { Action } from '@ngrx/store';

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
  return first.filter((item) => second.indexOf(item) < 0);
}

/**
 * Provides an app's view into the state of the lifted store.
 */
export function unliftState(liftedState: LiftedState) {
  const { computedStates, currentStateIndex } = liftedState;

  // At start up NgRx dispatches init actions,
  // When these init actions are being filtered out by the predicate or safe/block list options
  // we don't have a complete computed states yet.
  // At this point it could happen that we're out of bounds, when this happens we fall back to the last known state
  if (currentStateIndex >= computedStates.length) {
    const { state } = computedStates[computedStates.length - 1];
    return state;
  }

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
  return Object.keys(actions).reduce((sanitizedActions, actionIdx) => {
    const idx = Number(actionIdx);
    sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx], idx);
    return sanitizedActions;
  }, <LiftedActions>{});
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
  return config.predicate || config.actionsSafelist || config.actionsBlocklist;
}

/**
 * Return a full filtered lifted state
 */
export function filterLiftedState(
  liftedState: LiftedState,
  predicate?: Predicate,
  safelist?: string[],
  blocklist?: string[]
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
        safelist,
        blocklist
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
  safelist?: string[],
  blockedlist?: string[]
) {
  const predicateMatch = predicate && !predicate(state, action.action);
  const safelistMatch =
    safelist &&
    !action.action.type.match(safelist.map((s) => escapeRegExp(s)).join('|'));
  const blocklistMatch =
    blockedlist &&
    action.action.type.match(blockedlist.map((s) => escapeRegExp(s)).join('|'));
  return predicateMatch || safelistMatch || blocklistMatch;
}

/**
 * Return string with escaped RegExp special characters
 * https://stackoverflow.com/a/6969486/1337347
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
