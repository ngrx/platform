/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { INITIAL_STATE, INITIAL_REDUCERS, REDUCER_FACTORY } from "./tokens";
import { omit, createReducerFactory } from "./utils";
import { ActionsSubject } from "./actions_subject";
/**
 * @abstract
 */
export class ReducerObservable extends Observable {
}
/**
 * @abstract
 */
export class ReducerManagerDispatcher extends ActionsSubject {
}
export const /** @type {?} */ UPDATE = /** @type {?} */ ('@ngrx/store/update-reducers');
export class ReducerManager extends BehaviorSubject {
    /**
     * @param {?} dispatcher
     * @param {?} initialState
     * @param {?} reducers
     * @param {?} reducerFactory
     */
    constructor(dispatcher, initialState, reducers, reducerFactory) {
        super(reducerFactory(reducers, initialState));
        this.dispatcher = dispatcher;
        this.initialState = initialState;
        this.reducers = reducers;
        this.reducerFactory = reducerFactory;
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    addFeature({ reducers, reducerFactory, metaReducers, initialState, key, }) {
        const /** @type {?} */ reducer = typeof reducers === 'function'
            ? (state, action) => reducers(state || initialState, action)
            : createReducerFactory(reducerFactory, metaReducers)(reducers, initialState);
        this.addReducer(key, reducer);
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    removeFeature({ key }) {
        this.removeReducer(key);
    }
    /**
     * @param {?} key
     * @param {?} reducer
     * @return {?}
     */
    addReducer(key, reducer) {
        this.reducers = Object.assign({}, this.reducers, { [key]: reducer });
        this.updateReducers();
    }
    /**
     * @param {?} key
     * @return {?}
     */
    removeReducer(key) {
        this.reducers = omit(this.reducers, key);
        this.updateReducers();
    }
    /**
     * @return {?}
     */
    updateReducers() {
        this.next(this.reducerFactory(this.reducers, this.initialState));
        this.dispatcher.next({ type: UPDATE });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.complete();
    }
}
ReducerManager.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ReducerManager.ctorParameters = () => [
    { type: ReducerManagerDispatcher, },
    { type: undefined, decorators: [{ type: Inject, args: [INITIAL_STATE,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [INITIAL_REDUCERS,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [REDUCER_FACTORY,] },] },
];
function ReducerManager_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ReducerManager.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ReducerManager.ctorParameters;
    /** @type {?} */
    ReducerManager.prototype.dispatcher;
    /** @type {?} */
    ReducerManager.prototype.initialState;
    /** @type {?} */
    ReducerManager.prototype.reducers;
    /** @type {?} */
    ReducerManager.prototype.reducerFactory;
}
export const /** @type {?} */ REDUCER_MANAGER_PROVIDERS = [
    ReducerManager,
    { provide: ReducerObservable, useExisting: ReducerManager },
    { provide: ReducerManagerDispatcher, useExisting: ActionsSubject },
];
//# sourceMappingURL=reducer_manager.js.map