import {
  Action,
  ActionReducer,
  ActionsSubject,
  ReducerManager,
  UPDATE,
  INIT,
} from '@ngrx/store';
import { difference, liftAction } from './utils';
import * as Actions from './actions';
import { StoreDevtoolsConfig } from './config';
import { PerformAction } from './actions';

export type InitAction = {
  readonly type: typeof INIT;
};

export type UpdateReducerAction = {
  readonly type: typeof UPDATE;
};

export type CoreActions = InitAction | UpdateReducerAction;
export type Actions = Actions.All | CoreActions;

export const INIT_ACTION = { type: INIT };

export interface LiftedState {
  monitorState: any;
  nextActionId: number;
  actionsById: { [id: number]: { action: Action } };
  stagedActionIds: number[];
  skippedActionIds: number[];
  committedState: any;
  currentStateIndex: number;
  computedStates: { state: any; error: any }[];
}

/**
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry(
  reducer: ActionReducer<any, any>,
  action: Action,
  state: LiftedState,
  error: any
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
    console.error(err.stack || err);
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
  computedStates: { state: any; error: any }[],
  minInvalidatedStateIndex: number,
  reducer: ActionReducer<any, any>,
  committedState: any,
  actionsById: { [id: number]: { action: Action } },
  stagedActionIds: number[],
  skippedActionIds: number[]
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
  for (let i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
    const actionId = stagedActionIds[i];
    const action = actionsById[actionId].action;

    const previousEntry = nextComputedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;
    const previousError = previousEntry ? previousEntry.error : undefined;

    const shouldSkip = skippedActionIds.indexOf(actionId) > -1;
    const entry = shouldSkip
      ? previousEntry
      : computeNextEntry(reducer, action, previousState, previousError);

    nextComputedStates.push(entry);
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
  };
}

/**
 * Creates a history state reducer from an app's reducer.
 */
export function liftReducerWith(
  initialCommittedState: any,
  initialLiftedState: LiftedState,
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
    } =
      liftedState || initialLiftedState;

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
        id => idsToDelete.indexOf(id) === -1
      );
      stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
      committedState = computedStates[excess].state;
      computedStates = computedStates.slice(excess);
      currentStateIndex =
        currentStateIndex > excess ? currentStateIndex - excess : 0;
    }

    // By default, agressively recompute every state whatever happens.
    // This has O(n) performance, so we'll override this to a sensible
    // value whenever we feel like we don't have to recompute the states.
    let minInvalidatedStateIndex = 0;

    switch (liftedAction.type) {
      case Actions.RESET: {
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
      case Actions.COMMIT: {
        // Consider the last committed state the new starting point.
        // Squash any staged actions into a single committed state.
        actionsById = { 0: liftAction(INIT_ACTION) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = computedStates[currentStateIndex].state;
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case Actions.ROLLBACK: {
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
      case Actions.TOGGLE_ACTION: {
        // Toggle whether an action with given ID is skipped.
        // Being skipped means it is a no-op during the computation.
        const { id: actionId } = liftedAction;
        const index = skippedActionIds.indexOf(actionId);
        if (index === -1) {
          skippedActionIds = [actionId, ...skippedActionIds];
        } else {
          skippedActionIds = skippedActionIds.filter(id => id !== actionId);
        }
        // Optimization: we know history before this action hasn't changed
        minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
        break;
      }
      case Actions.SET_ACTIONS_ACTIVE: {
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
      case Actions.JUMP_TO_STATE: {
        // Without recomputing anything, move the pointer that tell us
        // which state is considered the current one. Useful for sliders.
        currentStateIndex = liftedAction.index;
        // Optimization: we know the history has not changed.
        minInvalidatedStateIndex = Infinity;
        break;
      }
      case Actions.SWEEP: {
        // Forget any actions that are currently being skipped.
        stagedActionIds = difference(stagedActionIds, skippedActionIds);
        skippedActionIds = [];
        currentStateIndex = Math.min(
          currentStateIndex,
          stagedActionIds.length - 1
        );
        break;
      }
      case Actions.PERFORM_ACTION: {
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
      case Actions.IMPORT_STATE: {
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
            skippedActionIds
          );

          commitExcessActions(stagedActionIds.length - options.maxAge);

          // Avoid double computation.
          minInvalidatedStateIndex = Infinity;
        }

        break;
      }
      case UPDATE: {
        const stateHasErrors =
          computedStates.filter(state => state.error).length > 0;

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
              skippedActionIds
            );

            commitExcessActions(stagedActionIds.length - options.maxAge);

            // Avoid double computation.
            minInvalidatedStateIndex = Infinity;
          }
        } else {
          if (currentStateIndex === stagedActionIds.length - 1) {
            currentStateIndex++;
          }

          // Add a new action to only recompute state
          const actionId = nextActionId++;
          actionsById[actionId] = new PerformAction(liftedAction);
          stagedActionIds = [...stagedActionIds, actionId];

          minInvalidatedStateIndex = stagedActionIds.length - 1;

          // States must be recomputed before committing excess.
          computedStates = recomputeStates(
            computedStates,
            minInvalidatedStateIndex,
            reducer,
            committedState,
            actionsById,
            stagedActionIds,
            skippedActionIds
          );

          currentStateIndex = minInvalidatedStateIndex;

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
      skippedActionIds
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
    };
  };
}
