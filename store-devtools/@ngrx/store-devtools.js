import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { ActionsSubject, INIT, INITIAL_STATE, ReducerManagerDispatcher, ReducerObservable, ScannedActionsSubject, StateObservable, UPDATE } from '@ngrx/store';
import { ReplaySubject as ReplaySubject$1 } from 'rxjs/ReplaySubject';
import { map as map$1 } from 'rxjs/operator/map';
import { merge as merge$1 } from 'rxjs/operator/merge';
import { observeOn as observeOn$1 } from 'rxjs/operator/observeOn';
import { scan as scan$1 } from 'rxjs/operator/scan';
import { skip as skip$1 } from 'rxjs/operator/skip';
import { withLatestFrom as withLatestFrom$1 } from 'rxjs/operator/withLatestFrom';
import { queue as queue$1 } from 'rxjs/scheduler/queue';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { empty as empty$1 } from 'rxjs/observable/empty';
import { filter as filter$1 } from 'rxjs/operator/filter';
import { share as share$1 } from 'rxjs/operator/share';
import { switchMap as switchMap$1 } from 'rxjs/operator/switchMap';
import { takeUntil as takeUntil$1 } from 'rxjs/operator/takeUntil';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class StoreDevtoolsConfig {
}
const STORE_DEVTOOLS_CONFIG = new InjectionToken('@ngrx/devtools Options');
const INITIAL_OPTIONS = new InjectionToken('@ngrx/devtools Initial Config');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const PERFORM_ACTION = 'PERFORM_ACTION';
const RESET = 'RESET';
const ROLLBACK = 'ROLLBACK';
const COMMIT = 'COMMIT';
const SWEEP = 'SWEEP';
const TOGGLE_ACTION = 'TOGGLE_ACTION';
const SET_ACTIONS_ACTIVE = 'SET_ACTIONS_ACTIVE';
const JUMP_TO_STATE = 'JUMP_TO_STATE';
const IMPORT_STATE = 'IMPORT_STATE';
class PerformAction {
    /**
     * @param {?} action
     * @param {?=} timestamp
     */
    constructor(action, timestamp) {
        this.action = action;
        this.timestamp = timestamp;
        this.type = PERFORM_ACTION;
        if (typeof action.type === 'undefined') {
            throw new Error('Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?');
        }
    }
}
class Reset {
    /**
     * @param {?=} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = RESET;
    }
}
class Rollback {
    /**
     * @param {?=} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = ROLLBACK;
    }
}
class Commit {
    /**
     * @param {?=} timestamp
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.type = COMMIT;
    }
}
class Sweep {
    constructor() {
        this.type = SWEEP;
    }
}
class ToggleAction {
    /**
     * @param {?} id
     */
    constructor(id) {
        this.id = id;
        this.type = TOGGLE_ACTION;
    }
}

class JumpToState {
    /**
     * @param {?} index
     */
    constructor(index) {
        this.index = index;
        this.type = JUMP_TO_STATE;
    }
}
class ImportState {
    /**
     * @param {?} nextLiftedState
     */
    constructor(nextLiftedState) {
        this.nextLiftedState = nextLiftedState;
        this.type = IMPORT_STATE;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} first
 * @param {?} second
 * @return {?}
 */
function difference(first, second) {
    return first.filter(item => second.indexOf(item) < 0);
}
/**
 * Provides an app's view into the state of the lifted store.
 * @param {?} liftedState
 * @return {?}
 */
function unliftState(liftedState) {
    const { computedStates, currentStateIndex } = liftedState;
    const { state } = computedStates[currentStateIndex];
    return state;
}
/**
 * @param {?} liftedState
 * @return {?}
 */

/**
 * Lifts an app's action into an action on the lifted store.
 * @param {?} action
 * @return {?}
 */
function liftAction(action) {
    return new PerformAction(action);
}
/**
 * @param {?} input$
 * @param {?} operators
 * @return {?}
 */
function applyOperators(input$, operators) {
    return operators.reduce((source$, [operator, ...args]) => {
        return operator.apply(source$, args);
    }, input$);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
const REDUX_DEVTOOLS_EXTENSION = new InjectionToken('Redux Devtools Extension');
/**
 * @record
 */

/**
 * @record
 */

class DevtoolsExtension {
    /**
     * @param {?} devtoolsExtension
     * @param {?} config
     */
    constructor(devtoolsExtension, config) {
        this.config = config;
        this.instanceId = `ngrx-store-${Date.now()}`;
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    /**
     * @param {?} action
     * @param {?} state
     * @return {?}
     */
    notify(action, state) {
        if (!this.devtoolsExtension) {
            return;
        }
        this.devtoolsExtension.send(null, state, this.config, this.instanceId);
    }
    /**
     * @return {?}
     */
    createChangesObservable() {
        if (!this.devtoolsExtension) {
            return empty$1();
        }
        return new Observable$1(subscriber => {
            const /** @type {?} */ connection = this.devtoolsExtension.connect({
                instanceId: this.instanceId,
            });
            connection.subscribe((change) => subscriber.next(change));
            return connection.unsubscribe;
        });
    }
    /**
     * @return {?}
     */
    createActionStreams() {
        // Listens to all changes based on our instanceId
        const /** @type {?} */ changes$ = share$1.call(this.createChangesObservable());
        // Listen for the start action
        const /** @type {?} */ start$ = filter$1.call(changes$, (change) => change.type === ExtensionActionTypes.START);
        // Listen for the stop action
        const /** @type {?} */ stop$ = filter$1.call(changes$, (change) => change.type === ExtensionActionTypes.STOP);
        // Listen for lifted actions
        const /** @type {?} */ liftedActions$ = applyOperators(changes$, [
            [filter$1, (change) => change.type === ExtensionActionTypes.DISPATCH],
            [map$1, (change) => this.unwrapAction(change.payload)],
        ]);
        // Listen for unlifted actions
        const /** @type {?} */ actions$ = applyOperators(changes$, [
            [filter$1, (change) => change.type === ExtensionActionTypes.ACTION],
            [map$1, (change) => this.unwrapAction(change.payload)],
        ]);
        const /** @type {?} */ actionsUntilStop$ = takeUntil$1.call(actions$, stop$);
        const /** @type {?} */ liftedUntilStop$ = takeUntil$1.call(liftedActions$, stop$);
        // Only take the action sources between the start/stop events
        this.actions$ = switchMap$1.call(start$, () => actionsUntilStop$);
        this.liftedActions$ = switchMap$1.call(start$, () => liftedUntilStop$);
    }
    /**
     * @param {?} action
     * @return {?}
     */
    unwrapAction(action) {
        return typeof action === 'string' ? eval(`(${action})`) : action;
    }
}
DevtoolsExtension.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DevtoolsExtension.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [REDUX_DEVTOOLS_EXTENSION,] },] },
    { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const INIT_ACTION = { type: INIT };
/**
 * @record
 */

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
function liftInitialState(initialCommittedState, monitorReducer) {
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
function liftReducerWith(initialCommittedState, initialLiftedState, monitorReducer, options = {}) {
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
            case RESET: {
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
            case COMMIT: {
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
            case ROLLBACK: {
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
            case TOGGLE_ACTION: {
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
            case SET_ACTIONS_ACTIVE: {
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
            case JUMP_TO_STATE: {
                // Without recomputing anything, move the pointer that tell us
                // which state is considered the current one. Useful for sliders.
                currentStateIndex = liftedAction.index;
                // Optimization: we know the history has not changed.
                minInvalidatedStateIndex = Infinity;
                break;
            }
            case SWEEP: {
                // Forget any actions that are currently being skipped.
                stagedActionIds = difference(stagedActionIds, skippedActionIds);
                skippedActionIds = [];
                currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
                break;
            }
            case PERFORM_ACTION: {
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
            case IMPORT_STATE: {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DevtoolsDispatcher extends ActionsSubject {
}
DevtoolsDispatcher.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DevtoolsDispatcher.ctorParameters = () => [];
class StoreDevtools {
    /**
     * @param {?} dispatcher
     * @param {?} actions$
     * @param {?} reducers$
     * @param {?} extension
     * @param {?} scannedActions
     * @param {?} initialState
     * @param {?} config
     */
    constructor(dispatcher, actions$, reducers$, extension, scannedActions, initialState, config) {
        const /** @type {?} */ liftedInitialState = liftInitialState(initialState, config.monitor);
        const /** @type {?} */ liftReducer = liftReducerWith(initialState, liftedInitialState, config.monitor, config);
        const /** @type {?} */ liftedAction$ = applyOperators(actions$.asObservable(), [
            [skip$1, 1],
            [merge$1, extension.actions$],
            [map$1, liftAction],
            [merge$1, dispatcher, extension.liftedActions$],
            [observeOn$1, queue$1],
        ]);
        const /** @type {?} */ liftedReducer$ = map$1.call(reducers$, liftReducer);
        const /** @type {?} */ liftedStateSubject = new ReplaySubject$1(1);
        const /** @type {?} */ liftedStateSubscription = applyOperators(liftedAction$, [
            [withLatestFrom$1, liftedReducer$],
            [
                scan$1,
                ({ state: liftedState }, [action, reducer]) => {
                    const /** @type {?} */ state = reducer(liftedState, action);
                    extension.notify(action, state);
                    return { state, action };
                },
                { state: liftedInitialState, action: null },
            ],
        ]).subscribe(({ state, action }) => {
            liftedStateSubject.next(state);
            if (action.type === PERFORM_ACTION) {
                const /** @type {?} */ unliftedAction = (/** @type {?} */ (action)).action;
                scannedActions.next(unliftedAction);
            }
        });
        const /** @type {?} */ liftedState$ = /** @type {?} */ (liftedStateSubject.asObservable());
        const /** @type {?} */ state$ = map$1.call(liftedState$, unliftState);
        this.stateSubscription = liftedStateSubscription;
        this.dispatcher = dispatcher;
        this.liftedState = liftedState$;
        this.state = state$;
    }
    /**
     * @param {?} action
     * @return {?}
     */
    dispatch(action) {
        this.dispatcher.next(action);
    }
    /**
     * @param {?} action
     * @return {?}
     */
    next(action) {
        this.dispatcher.next(action);
    }
    /**
     * @param {?} error
     * @return {?}
     */
    error(error) { }
    /**
     * @return {?}
     */
    complete() { }
    /**
     * @param {?} action
     * @return {?}
     */
    performAction(action) {
        this.dispatch(new PerformAction(action));
    }
    /**
     * @return {?}
     */
    reset() {
        this.dispatch(new Reset());
    }
    /**
     * @return {?}
     */
    rollback() {
        this.dispatch(new Rollback());
    }
    /**
     * @return {?}
     */
    commit() {
        this.dispatch(new Commit());
    }
    /**
     * @return {?}
     */
    sweep() {
        this.dispatch(new Sweep());
    }
    /**
     * @param {?} id
     * @return {?}
     */
    toggleAction(id) {
        this.dispatch(new ToggleAction(id));
    }
    /**
     * @param {?} index
     * @return {?}
     */
    jumpToState(index) {
        this.dispatch(new JumpToState(index));
    }
    /**
     * @param {?} nextLiftedState
     * @return {?}
     */
    importState(nextLiftedState) {
        this.dispatch(new ImportState(nextLiftedState));
    }
}
StoreDevtools.decorators = [
    { type: Injectable },
];
/** @nocollapse */
StoreDevtools.ctorParameters = () => [
    { type: DevtoolsDispatcher, },
    { type: ActionsSubject, },
    { type: ReducerObservable, },
    { type: DevtoolsExtension, },
    { type: ScannedActionsSubject, },
    { type: undefined, decorators: [{ type: Inject, args: [INITIAL_STATE,] },] },
    { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken('Is Devtools Extension or Monitor Present');
/**
 * @param {?} extension
 * @param {?} config
 * @return {?}
 */
function createIsExtensionOrMonitorPresent(extension, config) {
    return Boolean(extension) || config.monitor !== noMonitor;
}
/**
 * @return {?}
 */
function createReduxDevtoolsExtension() {
    const /** @type {?} */ extensionKey = '__REDUX_DEVTOOLS_EXTENSION__';
    if (typeof window === 'object' &&
        typeof (/** @type {?} */ (window))[extensionKey] !== 'undefined') {
        return (/** @type {?} */ (window))[extensionKey];
    }
    else {
        return null;
    }
}
/**
 * @param {?} devtools
 * @return {?}
 */
function createStateObservable(devtools) {
    return devtools.state;
}
/**
 * @return {?}
 */
function noMonitor() {
    return null;
}
/**
 * @return {?}
 */
function noActionSanitizer() {
    return null;
}
/**
 * @return {?}
 */
function noStateSanitizer() {
    return null;
}
const DEFAULT_NAME = 'NgRx Store DevTools';
/**
 * @param {?} _options
 * @return {?}
 */
function createConfig(_options) {
    const /** @type {?} */ DEFAULT_OPTIONS = {
        maxAge: false,
        monitor: noMonitor,
        actionSanitizer: noActionSanitizer,
        stateSanitizer: noStateSanitizer,
        name: DEFAULT_NAME,
        serialize: false,
    };
    let /** @type {?} */ options = typeof _options === 'function' ? _options() : _options;
    const /** @type {?} */ config = Object.assign({}, DEFAULT_OPTIONS, options);
    if (config.maxAge && config.maxAge < 2) {
        throw new Error(`Devtools 'maxAge' cannot be less than 2, got ${config.maxAge}`);
    }
    return config;
}
class StoreDevtoolsModule {
    /**
     * @param {?=} options
     * @return {?}
     */
    static instrument(options = {}) {
        return {
            ngModule: StoreDevtoolsModule,
            providers: [
                DevtoolsExtension,
                DevtoolsDispatcher,
                StoreDevtools,
                {
                    provide: INITIAL_OPTIONS,
                    useValue: options,
                },
                {
                    provide: IS_EXTENSION_OR_MONITOR_PRESENT,
                    deps: [REDUX_DEVTOOLS_EXTENSION, STORE_DEVTOOLS_CONFIG],
                    useFactory: createIsExtensionOrMonitorPresent,
                },
                {
                    provide: REDUX_DEVTOOLS_EXTENSION,
                    useFactory: createReduxDevtoolsExtension,
                },
                {
                    provide: STORE_DEVTOOLS_CONFIG,
                    deps: [INITIAL_OPTIONS],
                    useFactory: createConfig,
                },
                {
                    provide: StateObservable,
                    deps: [StoreDevtools],
                    useFactory: createStateObservable,
                },
                {
                    provide: ReducerManagerDispatcher,
                    useExisting: DevtoolsDispatcher,
                },
            ],
        };
    }
}
StoreDevtoolsModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
StoreDevtoolsModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { StoreDevtoolsModule, StoreDevtools, StoreDevtoolsConfig, INITIAL_OPTIONS as ɵi, STORE_DEVTOOLS_CONFIG as ɵh, DevtoolsDispatcher as ɵg, DevtoolsExtension as ɵk, REDUX_DEVTOOLS_EXTENSION as ɵj, IS_EXTENSION_OR_MONITOR_PRESENT as ɵa, createConfig as ɵf, createIsExtensionOrMonitorPresent as ɵb, createReduxDevtoolsExtension as ɵc, createStateObservable as ɵd, noMonitor as ɵe };
//# sourceMappingURL=store-devtools.js.map
