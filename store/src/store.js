/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operator/map";
import { pluck } from "rxjs/operator/pluck";
import { distinctUntilChanged } from "rxjs/operator/distinctUntilChanged";
import { ActionsSubject } from "./actions_subject";
import { StateObservable } from "./state";
import { ReducerManager } from "./reducer_manager";
export class Store extends Observable {
    /**
     * @param {?} state$
     * @param {?} actionsObserver
     * @param {?} reducerManager
     */
    constructor(state$, actionsObserver, reducerManager) {
        super();
        this.actionsObserver = actionsObserver;
        this.reducerManager = reducerManager;
        this.source = state$;
    }
    /**
     * @param {?} pathOrMapFn
     * @param {...?} paths
     * @return {?}
     */
    select(pathOrMapFn, ...paths) {
        let /** @type {?} */ mapped$;
        if (typeof pathOrMapFn === 'string') {
            mapped$ = pluck.call(this, pathOrMapFn, ...paths);
        }
        else if (typeof pathOrMapFn === 'function') {
            mapped$ = map.call(this, pathOrMapFn);
        }
        else {
            throw new TypeError(`Unexpected type '${typeof pathOrMapFn}' in select operator,` +
                ` expected 'string' or 'function'`);
        }
        return distinctUntilChanged.call(mapped$);
    }
    /**
     * @template R
     * @param {?} operator
     * @return {?}
     */
    lift(operator) {
        const /** @type {?} */ store = new Store(this, this.actionsObserver, this.reducerManager);
        store.operator = operator;
        return store;
    }
    /**
     * @template V
     * @param {?} action
     * @return {?}
     */
    dispatch(action) {
        this.actionsObserver.next(action);
    }
    /**
     * @param {?} action
     * @return {?}
     */
    next(action) {
        this.actionsObserver.next(action);
    }
    /**
     * @param {?} err
     * @return {?}
     */
    error(err) {
        this.actionsObserver.error(err);
    }
    /**
     * @return {?}
     */
    complete() {
        this.actionsObserver.complete();
    }
    /**
     * @template State, Actions
     * @param {?} key
     * @param {?} reducer
     * @return {?}
     */
    addReducer(key, reducer) {
        this.reducerManager.addReducer(key, reducer);
    }
    /**
     * @template Key
     * @param {?} key
     * @return {?}
     */
    removeReducer(key) {
        this.reducerManager.removeReducer(key);
    }
}
Store.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Store.ctorParameters = () => [
    { type: StateObservable, },
    { type: ActionsSubject, },
    { type: ReducerManager, },
];
function Store_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Store.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Store.ctorParameters;
    /** @type {?} */
    Store.prototype.actionsObserver;
    /** @type {?} */
    Store.prototype.reducerManager;
}
export const /** @type {?} */ STORE_PROVIDERS = [Store];
//# sourceMappingURL=store.js.map