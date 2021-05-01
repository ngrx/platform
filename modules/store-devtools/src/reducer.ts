import { ErrorHandler } from '@angular/core';
import { Action, ActionReducer, UPDATE, INIT } from '@ngrx/store';

import { difference, liftAction, isActionFiltered } from './utils';
import * as DevtoolsActions from './actions';
import { StoreDevtoolsConfig } from './config';
import { PerformAction } from './actions';

export type InitAction = {
  readonly type: typeof INIT;
};

export type UpdateReducerAction = {
  readonly type: typeof UPDATE;
};

export type CoreActions = InitAction | UpdateReducerAction;
export type Actions = DevtoolsActions.All | CoreActions;

export const INIT_ACTION = { type: INIT };

export const RECOMPUTE = '@ngrx/store-devtools/recompute' as const;
export const RECOMPUTE_ACTION = { type: RECOMPUTE };

export interface ComputedState {
  state: any;
  error: any;
}

export interface LiftedAction {
  type: string;
  action: Action;
}

export interface LiftedActions {
  [id: number]: LiftedAction;
}

export interface LiftedState {
  monitorState: any;
  nextActionId: number;
  actionsById: LiftedActions;
  stagedActionIds: number[];
  skippedActionIds: number[];
  committedState: any;
  currentStateIndex: number;
  computedStates: ComputedState[];
  isLocked: boolean;
  isPaused: boolean;
}

/**
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry(
  reducer: ActionReducer<any, any>,
  action: Action,
  state: any,
  error: any,
  errorHandler: ErrorHandler
) {
  if (error) {
    return {
      state,
      error: 'Interrupted by an error up the chain',
    };
  }

  let nextState = state;
  let nextError;
  try {
    nextState = reducer(state, action);
  } catch (err) {
    nextError = err.toString();
    errorHandler.handleError(err);
  }

  return {
    state: nextState,
    error: nextError,
  };
}

/**
 * Runs the reducer on invalidated actions to get a fresh computation log.
 */
function recomputeStates(
  computedStates: ComputedState[],
  minInvalidatedStateIndex: number,
  reducer: ActionReducer<any, any>,
  committedState: any,
  actionsById: LiftedActions,
  stagedActionIds: number[],
  skippedActionIds: number[],
  errorHandler: ErrorHandler,
  isPaused: boolean
) {
  // Optimization: exit early and return the same reference
  // if we know nothing could have changed.
  if (
    minInvalidatedStateIndex >= computedStates.length &&
    computedStates.length === stagedActionIds.length
  ) {
    return computedStates;
  }

  const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
  // If the recording is paused, recompute all states up until the pause state,
  // else recompute all states.
  const lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
  for (let i = minInvalidatedStateIndex; i < lastIncludedActionId; i++) {
    const actionId = stagedActionIds[i];
    const action = actionsById[actionId].action;

    const previousEntry = nextComputedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;
    const previousError = previousEntry ? previousEntry.error : undefined;

    const shouldSkip = skippedActionIds.indexOf(actionId) > -1;
    const entry: ComputedState = shouldSkip
      ? previousEntry
      : computeNextEntry(
          reducer,
          action,
          previousState,
          previousError,
          errorHandler
        );

    nextComputedStates.push(entry);
  }
  // If the recording is paused, the last state will not be recomputed,
  // because it's essentially not part of the state history.
  if (isPaused) {
    nextComputedStates.push(computedStates[computedStates.length - 1]);
  }

  return nextComputedStates;
}

export function liftInitialState(
  initialCommittedState?: any,
  monitorReducer?: any
): LiftedState {
  return {
    monitorState: monitorReducer(undefined, {}),
    nextActionId: 1,
    actionsById: { 0: liftAction(INIT_ACTION) },
    stagedActionIds: [0],
    skippedActionIds: [],
    committedState: initialCommittedState,
    currentStateIndex: 0,
    computedStates: [],
    isLocked: false,
    isPaused: false,
  };
}

/**
 * Creates a history state reducer from an app's reducer.
 */
export function liftReducerWith(
  initialCommittedState: any,
  initialLiftedState: LiftedState,
  errorHandler: ErrorHandler,
  monitorReducer?: any,
  options: Partial<StoreDevtoolsConfig> = {}
) {
  /**
   * Manages how the history actions modify the history state.
   */
  return (
    reducer: ActionReducer<any, any>
  ): ActionReducer<LiftedState, Actions> => (liftedState, liftedAction) => {
    let {
      monitorState,
      actionsById,
      nextActionId,
      stagedActionIds,
      skippedActionIds,
      committedState,
      currentStateIndex,
      computedStates,
      isLocked,
      isPaused,
    } = liftedState || initialLiftedState;

    if (!liftedState) {
      // Prevent mutating initialLiftedState
      actionsById = Object.create(actionsById);
    }

    function commitExcessActions(n: number) {
      // Auto-commits n-number of excess actions.
      let excess = n;
      let idsToDelete = stagedActionIds.slice(1, excess + 1);

      for (let i = 0; i < idsToDelete.length; i++) {
        if (computedStates[i + 1].error) {
          // Stop if error is found. Commit actions up to error.
          excess = i;
          idsToDelete = stagedActionIds.slice(1, excess + 1);
          break;
        } else {
          delete actionsById[idsToDelete[i]];
        }
      }

      skippedActionIds = skippedActionIds.filter(
        (id) => idsToDelete.indexOf(id) === -1
      );
      stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
      committedState = computedStates[excess].state;
      computedStates = computedStates.slice(excess);
      currentStateIndex =
        currentStateIndex > excess ? currentStateIndex - excess : 0;
    }

    function commitChanges() {
      // Consider the last committed state the new starting point.
      // Squash any staged actions into a single committed state.
      actionsById = { 0: liftAction(INIT_ACTION) };
      nextActionId = 1;
      stagedActionIds = [0];
      skippedActionIds = [];
      committedState = computedStates[currentStateIndex].state;
      currentStateIndex = 0;
      computedStates = [];
    }

    // By default, aggressively recompute every state whatever happens.
    // This has O(n) performance, so we'll override this to a sensible
    // value whenever we feel like we don't have to recompute the states.
    let minInvalidatedStateIndex = 0;

    switch (liftedAction.type) {
      case DevtoolsActions.LOCK_CHANGES: {
        isLocked = liftedAction.status;
        minInvalidatedStateIndex = Infinity;
        break;
      }
      case DevtoolsActions.PAUSE_RECORDING: {
        isPaused = liftedAction.status;
        if (isPaused) {
          // Add a pause action to signal the devtools-user the recording is paused.
          // The corresponding state will be overwritten on each update to always contain
          // the latest state (see Actions.PERFORM_ACTION).
          stagedActionIds = [...stagedActionIds, nextActionId];
          actionsById[nextActionId] = new PerformAction(
            {
              type: '@ngrx/devtools/pause',
            },
            +Date.now()
          );
          nextActionId++;
          minInvalidatedStateIndex = stagedActionIds.length - 1;
          computedStates = computedStates.concat(
            computedStates[computedStates.length - 1]
          );

          if (currentStateIndex === stagedActionIds.length - 2) {
            currentStateIndex++;
          }
          minInvalidatedStateIndex = Infinity;
        } else {
          commitChanges();
        }
        break;
      }
      case DevtoolsActions.RESET: {
        // Get back to the state the store was created with.
        actionsById = { 0: liftAction(INIT_ACTION) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = initialCommittedState;
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case DevtoolsActions.COMMIT: {
        commitChanges();
        break;
      }
      case DevtoolsActions.ROLLBACK: {
        // Forget about any staged actions.
        // Start again from the last committed state.
        actionsById = { 0: liftAction(INIT_ACTION) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case DevtoolsActions.TOGGLE_ACTION: {
        // Toggle whether an action with given ID is skipped.
        // Being skipped means it is a no-op during the computation.
        const { id: actionId } = liftedAction;
        const index = skippedActionIds.indexOf(actionId);
        if (index === -1) {
          skippedActionIds = [actionId, ...skippedActionIds];
        } else {
          skippedActionIds = skippedActionIds.filter((id) => id !== actionId);
        }
        // Optimization: we know history before this action hasn't changed
        minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
        break;
      }
      case DevtoolsActions.SET_ACTIONS_ACTIVE: {
        // Toggle whether an action with given ID is skipped.
        // Being skipped means it is a no-op during the computation.
        const { start, end, active } = liftedAction;
        const actionIds = [];
        for (let i = start; i < end; i++) actionIds.push(i);
        if (active) {
          skippedActionIds = difference(skippedActionIds, actionIds);
        } else {
          skippedActionIds = [...skippedActionIds, ...actionIds];
        }

        // Optimization: we know history before this action hasn't changed
        minInvalidatedStateIndex = stagedActionIds.indexOf(start);
        break;
      }
      case DevtoolsActions.JUMP_TO_STATE: {
        // Without recomputing anything, move the pointer that tell us
        // which state is considered the current one. Useful for sliders.
        currentStateIndex = liftedAction.index;
        // Optimization: we know the history has not changed.
        minInvalidatedStateIndex = Infinity;
        break;
      }
      case DevtoolsActions.JUMP_TO_ACTION: {
        // Jumps to a corresponding state to a specific action.
        // Useful when filtering actions.
        const index = stagedActionIds.indexOf(liftedAction.actionId);
        if (index !== -1) currentStateIndex = index;
        minInvalidatedStateIndex = Infinity;
        break;
      }
      case DevtoolsActions.SWEEP: {
        // Forget any actions that are currently being skipped.
        stagedActionIds = difference(stagedActionIds, skippedActionIds);
        skippedActionIds = [];
        currentStateIndex = Math.min(
          currentStateIndex,
          stagedActionIds.length - 1
        );
        break;
      }
      case DevtoolsActions.PERFORM_ACTION: {
        // Ignore action and return state as is if recording is locked
        if (isLocked) {
          return liftedState || initialLiftedState;
        }

        if (
          isPaused ||
          (liftedState &&
            isActionFiltered(
              liftedState.computedStates[currentStateIndex],
              liftedAction,
              options.predicate,
              options.actionsSafelist,
              options.actionsBlocklist
            ))
        ) {
          // If recording is paused or if the action should be ignored, overwrite the last state
          // (corresponds to the pause action) and keep everything else as is.
          // This way, the app gets the new current state while the devtools
          // do not record another action.
          const lastState = computedStates[computedStates.length - 1];
          computedStates = [
            ...computedStates.slice(0, -1),
            computeNextEntry(
              reducer,
              liftedAction.action,
              lastState.state,
              lastState.error,
              errorHandler
            ),
          ];
          minInvalidatedStateIndex = Infinity;
          break;
        }

        // Auto-commit as new actions come in.
        if (options.maxAge && stagedActionIds.length === options.maxAge) {
          commitExcessActions(1);
        }

        if (currentStateIndex === stagedActionIds.length - 1) {
          currentStateIndex++;
        }
        const actionId = nextActionId++;
        // Mutation! This is the hottest path, and we optimize on purpose.
        // It is safe because we set a new key in a cache dictionary.
        actionsById[actionId] = liftedAction;

        stagedActionIds = [...stagedActionIds, actionId];
        // Optimization: we know that only the new action needs computing.
        minInvalidatedStateIndex = stagedActionIds.length - 1;
        break;
      }
      case DevtoolsActions.IMPORT_STATE: {
        // Completely replace everything.
        ({
          monitorState,
          actionsById,
          nextActionId,
          stagedActionIds,
          skippedActionIds,
          committedState,
          currentStateIndex,
          computedStates,
          isLocked,
          isPaused,
        } = liftedAction.nextLiftedState);
        break;
      }
      case INIT: {
        // Always recompute states on hot reload and init.
        minInvalidatedStateIndex = 0;

        if (options.maxAge && stagedActionIds.length > options.maxAge) {
          // States must be recomputed before committing excess.
          computedStates = recomputeStates(
            computedStates,
            minInvalidatedStateIndex,
            reducer,
            committedState,
            actionsById,
            stagedActionIds,
            skippedActionIds,
            errorHandler,
            isPaused
          );

          commitExcessActions(stagedActionIds.length - options.maxAge);

          // Avoid double computation.
          minInvalidatedStateIndex = Infinity;
        }

        break;
      }
      case UPDATE: {
        const stateHasErrors =
          computedStates.filter((state) => state.error).length > 0;

        if (stateHasErrors) {
          // Recompute all states
          minInvalidatedStateIndex = 0;

          if (options.maxAge && stagedActionIds.length > options.maxAge) {
            // States must be recomputed before committing excess.
            computedStates = recomputeStates(
              computedStates,
              minInvalidatedStateIndex,
              reducer,
              committedState,
              actionsById,
              stagedActionIds,
              skippedActionIds,
              errorHandler,
              isPaused
            );

            commitExcessActions(stagedActionIds.length - options.maxAge);

            // Avoid double computation.
            minInvalidatedStateIndex = Infinity;
          }
        } else {
          // If not paused/locked, add a new action to signal devtools-user
          // that there was a reducer update.
          if (!isPaused && !isLocked) {
            if (currentStateIndex === stagedActionIds.length - 1) {
              currentStateIndex++;
            }

            // Add a new action to only recompute state
            const actionId = nextActionId++;
            actionsById[actionId] = new PerformAction(
              liftedAction,
              +Date.now()
            );
            stagedActionIds = [...stagedActionIds, actionId];

            minInvalidatedStateIndex = stagedActionIds.length - 1;

            computedStates = recomputeStates(
              computedStates,
              minInvalidatedStateIndex,
              reducer,
              committedState,
              actionsById,
              stagedActionIds,
              skippedActionIds,
              errorHandler,
              isPaused
            );
          }

          // Recompute state history with latest reducer and update action
          computedStates = computedStates.map((cmp) => ({
            ...cmp,
            state: reducer(cmp.state, RECOMPUTE_ACTION),
          }));

          currentStateIndex = stagedActionIds.length - 1;

          if (options.maxAge && stagedActionIds.length > options.maxAge) {
            commitExcessActions(stagedActionIds.length - options.maxAge);
          }

          // Avoid double computation.
          minInvalidatedStateIndex = Infinity;
        }

        break;
      }
      default: {
        // If the action is not recognized, it's a monitor action.
        // Optimization: a monitor action can't change history.
        minInvalidatedStateIndex = Infinity;
        break;
      }
    }

    computedStates = recomputeStates(
      computedStates,
      minInvalidatedStateIndex,
      reducer,
      committedState,
      actionsById,
      stagedActionIds,
      skippedActionIds,
      errorHandler,
      isPaused
    );
    monitorState = monitorReducer(monitorState, liftedAction);

    return {
      monitorState,
      actionsById,
      nextActionId,
      stagedActionIds,
      skippedActionIds,
      committedState,
      currentStateIndex,
      computedStates,
      isLocked,
      isPaused,
    };
  };
}
