/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { UPDATE, INIT, } from "@ngrx/store";
import { difference, liftAction } from "./utils";
import * as Actions from "./actions";
export const /** @type {?} */ INIT_ACTION = { type: INIT };
/**
 * @record
 */
export function LiftedState() { }
function LiftedState_tsickle_Closure_declarations() {
    /** @type {?} */
    LiftedState.prototype.monitorState;
    /** @type {?} */
    LiftedState.prototype.nextActionId;
    /** @type {?} */
    LiftedState.prototype.actionsById;
    /** @type {?} */
    LiftedState.prototype.stagedActionIds;
    /** @type {?} */
    LiftedState.prototype.skippedActionIds;
    /** @type {?} */
    LiftedState.prototype.committedState;
    /** @type {?} */
    LiftedState.prototype.currentStateIndex;
    /** @type {?} */
    LiftedState.prototype.computedStates;
}
/**
 * Computes the next entry in the log by applying an action.
 * @param {?} reducer
 * @param {?} action
 * @param {?} state
 * @param {?} error
 * @return {?}
 */
function computeNextEntry(reducer, action, state, error) {
    if (error) {
        return {
            state,
            error: 'Interrupted by an error up the chain',
        };
    }
    let /** @type {?} */ nextState = state;
    let /** @type {?} */ nextError;
    try {
        nextState = reducer(state, action);
    }
    catch (/** @type {?} */ err) {
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
 * @param {?} computedStates
 * @param {?} minInvalidatedStateIndex
 * @param {?} reducer
 * @param {?} committedState
 * @param {?} actionsById
 * @param {?} stagedActionIds
 * @param {?} skippedActionIds
 * @return {?}
 */
function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds) {
    // Optimization: exit early and return the same reference
    // if we know nothing could have changed.
    if (minInvalidatedStateIndex >= computedStates.length &&
        computedStates.length === stagedActionIds.length) {
        return computedStates;
    }
    const /** @type {?} */ nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
    for (let /** @type {?} */ i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
        const /** @type {?} */ actionId = stagedActionIds[i];
        const /** @type {?} */ action = actionsById[actionId].action;
        const /** @type {?} */ previousEntry = nextComputedStates[i - 1];
        const /** @type {?} */ previousState = previousEntry ? previousEntry.state : committedState;
        const /** @type {?} */ previousError = previousEntry ? previousEntry.error : undefined;
        const /** @type {?} */ shouldSkip = skippedActionIds.indexOf(actionId) > -1;
        const /** @type {?} */ entry = shouldSkip
            ? previousEntry
            : computeNextEntry(reducer, action, previousState, previousError);
        nextComputedStates.push(entry);
    }
    return nextComputedStates;
}
/**
 * @param {?=} initialCommittedState
 * @param {?=} monitorReducer
 * @return {?}
 */
export function liftInitialState(initialCommittedState, monitorReducer) {
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
 * @param {?} initialCommittedState
 * @param {?} initialLiftedState
 * @param {?=} monitorReducer
 * @param {?=} options
 * @return {?}
 */
export function liftReducerWith(initialCommittedState, initialLiftedState, monitorReducer, options = {}) {
    /**
      * Manages how the history actions modify the history state.
      */
    return (reducer) => (liftedState, liftedAction) => {
        let { monitorState, actionsById, nextActionId, stagedActionIds, skippedActionIds, committedState, currentStateIndex, computedStates, } = liftedState || initialLiftedState;
        if (!liftedState) {
            // Prevent mutating initialLiftedState
            actionsById = Object.create(actionsById);
        }
        /**
         * @param {?} n
         * @return {?}
         */
        function commitExcessActions(n) {
            // Auto-commits n-number of excess actions.
            let /** @type {?} */ excess = n;
            let /** @type {?} */ idsToDelete = stagedActionIds.slice(1, excess + 1);
            for (let /** @type {?} */ i = 0; i < idsToDelete.length; i++) {
                if (computedStates[i + 1].error) {
                    // Stop if error is found. Commit actions up to error.
                    excess = i;
                    idsToDelete = stagedActionIds.slice(1, excess + 1);
                    break;
                }
                else {
                    delete actionsById[idsToDelete[i]];
                }
            }
            skippedActionIds = skippedActionIds.filter(id => idsToDelete.indexOf(id) === -1);
            stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
            committedState = computedStates[excess].state;
            computedStates = computedStates.slice(excess);
            currentStateIndex =
                currentStateIndex > excess ? currentStateIndex - excess : 0;
        }
        // By default, agressively recompute every state whatever happens.
        // This has O(n) performance, so we'll override this to a sensible
        // value whenever we feel like we don't have to recompute the states.
        let /** @type {?} */ minInvalidatedStateIndex = 0;
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
                const /** @type {?} */ index = skippedActionIds.indexOf(actionId);
                if (index === -1) {
                    skippedActionIds = [actionId, ...skippedActionIds];
                }
                else {
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
                const /** @type {?} */ actionIds = [];
                for (let /** @type {?} */ i = start; i < end; i++)
                    actionIds.push(i);
                if (active) {
                    skippedActionIds = difference(skippedActionIds, actionIds);
                }
                else {
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
                currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
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
                const /** @type {?} */ actionId = nextActionId++;
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
            case UPDATE:
            case INIT: {
                // Always recompute states on hot reload and init.
                minInvalidatedStateIndex = 0;
                if (options.maxAge && stagedActionIds.length > options.maxAge) {
                    // States must be recomputed before committing excess.
                    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds);
                    commitExcessActions(stagedActionIds.length - options.maxAge);
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
        computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds);
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
//# sourceMappingURL=reducer.js.map