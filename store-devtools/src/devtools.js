/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Inject } from "@angular/core";
import { INITIAL_STATE, ReducerObservable, ActionsSubject, ScannedActionsSubject, } from "@ngrx/store";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { map } from "rxjs/operator/map";
import { merge } from "rxjs/operator/merge";
import { observeOn } from "rxjs/operator/observeOn";
import { scan } from "rxjs/operator/scan";
import { skip } from "rxjs/operator/skip";
import { withLatestFrom } from "rxjs/operator/withLatestFrom";
import { queue } from "rxjs/scheduler/queue";
import { DevtoolsExtension } from "./extension";
import { liftAction, unliftState, applyOperators } from "./utils";
import { liftReducerWith, liftInitialState } from "./reducer";
import * as Actions from "./actions";
import { StoreDevtoolsConfig, STORE_DEVTOOLS_CONFIG } from "./config";
export class DevtoolsDispatcher extends ActionsSubject {
}
DevtoolsDispatcher.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DevtoolsDispatcher.ctorParameters = () => [];
function DevtoolsDispatcher_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DevtoolsDispatcher.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DevtoolsDispatcher.ctorParameters;
}
export class StoreDevtools {
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
            [skip, 1],
            [merge, extension.actions$],
            [map, liftAction],
            [merge, dispatcher, extension.liftedActions$],
            [observeOn, queue],
        ]);
        const /** @type {?} */ liftedReducer$ = map.call(reducers$, liftReducer);
        const /** @type {?} */ liftedStateSubject = new ReplaySubject(1);
        const /** @type {?} */ liftedStateSubscription = applyOperators(liftedAction$, [
            [withLatestFrom, liftedReducer$],
            [
                scan,
                ({ state: liftedState }, [action, reducer]) => {
                    const /** @type {?} */ state = reducer(liftedState, action);
                    extension.notify(action, state);
                    return { state, action };
                },
                { state: liftedInitialState, action: null },
            ],
        ]).subscribe(({ state, action }) => {
            liftedStateSubject.next(state);
            if (action.type === Actions.PERFORM_ACTION) {
                const /** @type {?} */ unliftedAction = (/** @type {?} */ (action)).action;
                scannedActions.next(unliftedAction);
            }
        });
        const /** @type {?} */ liftedState$ = /** @type {?} */ (liftedStateSubject.asObservable());
        const /** @type {?} */ state$ = map.call(liftedState$, unliftState);
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
        this.dispatch(new Actions.PerformAction(action));
    }
    /**
     * @return {?}
     */
    reset() {
        this.dispatch(new Actions.Reset());
    }
    /**
     * @return {?}
     */
    rollback() {
        this.dispatch(new Actions.Rollback());
    }
    /**
     * @return {?}
     */
    commit() {
        this.dispatch(new Actions.Commit());
    }
    /**
     * @return {?}
     */
    sweep() {
        this.dispatch(new Actions.Sweep());
    }
    /**
     * @param {?} id
     * @return {?}
     */
    toggleAction(id) {
        this.dispatch(new Actions.ToggleAction(id));
    }
    /**
     * @param {?} index
     * @return {?}
     */
    jumpToState(index) {
        this.dispatch(new Actions.JumpToState(index));
    }
    /**
     * @param {?} nextLiftedState
     * @return {?}
     */
    importState(nextLiftedState) {
        this.dispatch(new Actions.ImportState(nextLiftedState));
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
function StoreDevtools_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StoreDevtools.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StoreDevtools.ctorParameters;
    /** @type {?} */
    StoreDevtools.prototype.stateSubscription;
    /** @type {?} */
    StoreDevtools.prototype.dispatcher;
    /** @type {?} */
    StoreDevtools.prototype.liftedState;
    /** @type {?} */
    StoreDevtools.prototype.state;
}
//# sourceMappingURL=devtools.js.map