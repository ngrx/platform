/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { queue } from "rxjs/scheduler/queue";
import { observeOn } from "rxjs/operator/observeOn";
import { withLatestFrom } from "rxjs/operator/withLatestFrom";
import { scan } from "rxjs/operator/scan";
import { ActionsSubject, INIT } from "./actions_subject";
import { INITIAL_STATE } from "./tokens";
import { ReducerObservable } from "./reducer_manager";
import { ScannedActionsSubject } from "./scanned_actions_subject";
/**
 * @abstract
 */
export class StateObservable extends Observable {
}
export class State extends BehaviorSubject {
    /**
     * @param {?} actions$
     * @param {?} reducer$
     * @param {?} scannedActions
     * @param {?} initialState
     */
    constructor(actions$, reducer$, scannedActions, initialState) {
        super(initialState);
        const /** @type {?} */ actionsOnQueue$ = observeOn.call(actions$, queue);
        const /** @type {?} */ withLatestReducer$ = withLatestFrom.call(actionsOnQueue$, reducer$);
        const /** @type {?} */ stateAndAction$ = scan.call(withLatestReducer$, reduceState, { state: initialState });
        this.stateSubscription = stateAndAction$.subscribe({
            next: ({ state, action }) => {
                this.next(state);
                scannedActions.next(action);
            },
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.stateSubscription.unsubscribe();
        this.complete();
    }
}
State.INIT = INIT;
State.decorators = [
    { type: Injectable },
];
/** @nocollapse */
State.ctorParameters = () => [
    { type: ActionsSubject, },
    { type: ReducerObservable, },
    { type: ScannedActionsSubject, },
    { type: undefined, decorators: [{ type: Inject, args: [INITIAL_STATE,] },] },
];
function State_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    State.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    State.ctorParameters;
    /** @type {?} */
    State.INIT;
    /** @type {?} */
    State.prototype.stateSubscription;
}
/**
 * @template T, V
 * @param {?=} stateActionPair
 * @param {?=} __1
 * @return {?}
 */
export function reduceState(stateActionPair = { state: undefined }, [action, reducer]) {
    const { state } = stateActionPair;
    return { state: reducer(state, action), action };
}
export const /** @type {?} */ STATE_PROVIDERS = [
    State,
    { provide: StateObservable, useExisting: State },
];
//# sourceMappingURL=state.js.map