import { Inject, Injectable, InjectionToken, Injector, NgModule } from '@angular/core';
import { BehaviorSubject as BehaviorSubject$1 } from 'rxjs/BehaviorSubject';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { queue as queue$1 } from 'rxjs/scheduler/queue';
import { observeOn as observeOn$1 } from 'rxjs/operator/observeOn';
import { withLatestFrom as withLatestFrom$1 } from 'rxjs/operator/withLatestFrom';
import { scan as scan$1 } from 'rxjs/operator/scan';
import { map as map$1 } from 'rxjs/operator/map';
import { pluck as pluck$1 } from 'rxjs/operator/pluck';
import { distinctUntilChanged as distinctUntilChanged$1 } from 'rxjs/operator/distinctUntilChanged';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} reducers
 * @param {?=} initialState
 * @return {?}
 */
function combineReducers(reducers, initialState = {}) {
    const /** @type {?} */ reducerKeys = Object.keys(reducers);
    const /** @type {?} */ finalReducers = {};
    for (let /** @type {?} */ i = 0; i < reducerKeys.length; i++) {
        const /** @type {?} */ key = reducerKeys[i];
        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key];
        }
    }
    const /** @type {?} */ finalReducerKeys = Object.keys(finalReducers);
    return function combination(state, action) {
        state = state || initialState;
        let /** @type {?} */ hasChanged = false;
        const /** @type {?} */ nextState = {};
        for (let /** @type {?} */ i = 0; i < finalReducerKeys.length; i++) {
            const /** @type {?} */ key = finalReducerKeys[i];
            const /** @type {?} */ reducer = finalReducers[key];
            const /** @type {?} */ previousStateForKey = state[key];
            const /** @type {?} */ nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
    };
}
/**
 * @template T
 * @param {?} object
 * @param {?} keyToRemove
 * @return {?}
 */
function omit(object, keyToRemove) {
    return Object.keys(object)
        .filter(key => key !== keyToRemove)
        .reduce((result, key) => Object.assign(result, { [key]: object[key] }), {});
}
/**
 * @param {...?} functions
 * @return {?}
 */
function compose(...functions) {
    return function (arg) {
        if (functions.length === 0) {
            return arg;
        }
        const /** @type {?} */ last = functions[functions.length - 1];
        const /** @type {?} */ rest = functions.slice(0, -1);
        return rest.reduceRight((composed, fn) => fn(composed), last(arg));
    };
}
/**
 * @template T, V
 * @param {?} reducerFactory
 * @param {?=} metaReducers
 * @return {?}
 */
function createReducerFactory(reducerFactory, metaReducers) {
    if (Array.isArray(metaReducers) && metaReducers.length > 0) {
        return compose.apply(null, [...metaReducers, reducerFactory]);
    }
    return reducerFactory;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const _INITIAL_STATE = new InjectionToken('@ngrx/store Internal Initial State');
const INITIAL_STATE = new InjectionToken('@ngrx/store Initial State');
const REDUCER_FACTORY = new InjectionToken('@ngrx/store Reducer Factory');
const _REDUCER_FACTORY = new InjectionToken('@ngrx/store Reducer Factory Provider');
const INITIAL_REDUCERS = new InjectionToken('@ngrx/store Initial Reducers');
const _INITIAL_REDUCERS = new InjectionToken('@ngrx/store Internal Initial Reducers');
const META_REDUCERS = new InjectionToken('@ngrx/store Meta Reducers');
const STORE_FEATURES = new InjectionToken('@ngrx/store Store Features');
const _STORE_REDUCERS = new InjectionToken('@ngrx/store Internal Store Reducers');
const _FEATURE_REDUCERS = new InjectionToken('@ngrx/store Internal Feature Reducers');
const _FEATURE_REDUCERS_TOKEN = new InjectionToken('@ngrx/store Internal Feature Reducers Token');
const FEATURE_REDUCERS = new InjectionToken('@ngrx/store Feature Reducers');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const INIT = /** @type {?} */ ('@ngrx/store/init');
class ActionsSubject extends BehaviorSubject$1 {
    constructor() {
        super({ type: INIT });
    }
    /**
     * @param {?} action
     * @return {?}
     */
    next(action) {
        if (typeof action === 'undefined') {
            throw new TypeError(`Actions must be objects`);
        }
        else if (typeof action.type === 'undefined') {
            throw new TypeError(`Actions must have a type property`);
        }
        super.next(action);
    }
    /**
     * @return {?}
     */
    complete() {
        /* noop */
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.complete();
    }
}
ActionsSubject.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ActionsSubject.ctorParameters = () => [];
const ACTIONS_SUBJECT_PROVIDERS = [ActionsSubject];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class ReducerObservable extends Observable$1 {
}
/**
 * @abstract
 */
class ReducerManagerDispatcher extends ActionsSubject {
}
const UPDATE = /** @type {?} */ ('@ngrx/store/update-reducers');
class ReducerManager extends BehaviorSubject$1 {
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
const REDUCER_MANAGER_PROVIDERS = [
    ReducerManager,
    { provide: ReducerObservable, useExisting: ReducerManager },
    { provide: ReducerManagerDispatcher, useExisting: ActionsSubject },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ScannedActionsSubject extends Subject$1 {
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.complete();
    }
}
ScannedActionsSubject.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ScannedActionsSubject.ctorParameters = () => [];
const SCANNED_ACTIONS_SUBJECT_PROVIDERS = [
    ScannedActionsSubject,
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class StateObservable extends Observable$1 {
}
class State extends BehaviorSubject$1 {
    /**
     * @param {?} actions$
     * @param {?} reducer$
     * @param {?} scannedActions
     * @param {?} initialState
     */
    constructor(actions$, reducer$, scannedActions, initialState) {
        super(initialState);
        const /** @type {?} */ actionsOnQueue$ = observeOn$1.call(actions$, queue$1);
        const /** @type {?} */ withLatestReducer$ = withLatestFrom$1.call(actionsOnQueue$, reducer$);
        const /** @type {?} */ stateAndAction$ = scan$1.call(withLatestReducer$, reduceState, { state: initialState });
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
/**
 * @template T, V
 * @param {?=} stateActionPair
 * @param {?=} __1
 * @return {?}
 */
function reduceState(stateActionPair = { state: undefined }, [action, reducer]) {
    const { state } = stateActionPair;
    return { state: reducer(state, action), action };
}
const STATE_PROVIDERS = [
    State,
    { provide: StateObservable, useExisting: State },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Store extends Observable$1 {
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
            mapped$ = pluck$1.call(this, pathOrMapFn, ...paths);
        }
        else if (typeof pathOrMapFn === 'function') {
            mapped$ = map$1.call(this, pathOrMapFn);
        }
        else {
            throw new TypeError(`Unexpected type '${typeof pathOrMapFn}' in select operator,` +
                ` expected 'string' or 'function'`);
        }
        return distinctUntilChanged$1.call(mapped$);
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
const STORE_PROVIDERS = [Store];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class StoreRootModule {
    /**
     * @param {?} actions$
     * @param {?} reducer$
     * @param {?} scannedActions$
     */
    constructor(actions$, reducer$, scannedActions$) { }
}
StoreRootModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
StoreRootModule.ctorParameters = () => [
    { type: ActionsSubject, },
    { type: ReducerObservable, },
    { type: ScannedActionsSubject, },
];
class StoreFeatureModule {
    /**
     * @param {?} features
     * @param {?} featureReducers
     * @param {?} reducerManager
     */
    constructor(features, featureReducers, reducerManager) {
        this.features = features;
        this.featureReducers = featureReducers;
        this.reducerManager = reducerManager;
        features
            .map((feature, index) => {
            const /** @type {?} */ featureReducerCollection = featureReducers.shift();
            const /** @type {?} */ reducers = featureReducerCollection[index];
            return Object.assign({}, feature, { reducers, initialState: _initialStateFactory(feature.initialState) });
        })
            .forEach(feature => reducerManager.addFeature(feature));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.features.forEach(feature => this.reducerManager.removeFeature(feature));
    }
}
StoreFeatureModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
StoreFeatureModule.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [STORE_FEATURES,] },] },
    { type: Array, decorators: [{ type: Inject, args: [FEATURE_REDUCERS,] },] },
    { type: ReducerManager, },
];
class StoreModule {
    /**
     * @param {?} reducers
     * @param {?=} config
     * @return {?}
     */
    static forRoot(reducers, config = {}) {
        return {
            ngModule: StoreRootModule,
            providers: [
                { provide: _INITIAL_STATE, useValue: config.initialState },
                {
                    provide: INITIAL_STATE,
                    useFactory: _initialStateFactory,
                    deps: [_INITIAL_STATE],
                },
                { provide: _INITIAL_REDUCERS, useValue: reducers },
                {
                    provide: _STORE_REDUCERS,
                    useExisting: reducers instanceof InjectionToken ? reducers : _INITIAL_REDUCERS,
                },
                {
                    provide: INITIAL_REDUCERS,
                    deps: [Injector, _INITIAL_REDUCERS, [new Inject(_STORE_REDUCERS)]],
                    useFactory: _createStoreReducers,
                },
                {
                    provide: META_REDUCERS,
                    useValue: config.metaReducers ? config.metaReducers : [],
                },
                {
                    provide: _REDUCER_FACTORY,
                    useValue: config.reducerFactory
                        ? config.reducerFactory
                        : combineReducers,
                },
                {
                    provide: REDUCER_FACTORY,
                    deps: [_REDUCER_FACTORY, META_REDUCERS],
                    useFactory: createReducerFactory,
                },
                ACTIONS_SUBJECT_PROVIDERS,
                REDUCER_MANAGER_PROVIDERS,
                SCANNED_ACTIONS_SUBJECT_PROVIDERS,
                STATE_PROVIDERS,
                STORE_PROVIDERS,
            ],
        };
    }
    /**
     * @param {?} featureName
     * @param {?} reducers
     * @param {?=} config
     * @return {?}
     */
    static forFeature(featureName, reducers, config = {}) {
        return {
            ngModule: StoreFeatureModule,
            providers: [
                {
                    provide: STORE_FEATURES,
                    multi: true,
                    useValue: /** @type {?} */ ({
                        key: featureName,
                        reducerFactory: config.reducerFactory
                            ? config.reducerFactory
                            : combineReducers,
                        metaReducers: config.metaReducers ? config.metaReducers : [],
                        initialState: config.initialState,
                    }),
                },
                { provide: _FEATURE_REDUCERS, multi: true, useValue: reducers },
                {
                    provide: _FEATURE_REDUCERS_TOKEN,
                    multi: true,
                    useExisting: reducers instanceof InjectionToken ? reducers : _FEATURE_REDUCERS,
                },
                {
                    provide: FEATURE_REDUCERS,
                    multi: true,
                    deps: [
                        Injector,
                        _FEATURE_REDUCERS,
                        [new Inject(_FEATURE_REDUCERS_TOKEN)],
                    ],
                    useFactory: _createFeatureReducers,
                },
            ],
        };
    }
}
StoreModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
StoreModule.ctorParameters = () => [];
/**
 * @param {?} injector
 * @param {?} reducers
 * @param {?} tokenReducers
 * @return {?}
 */
function _createStoreReducers(injector, reducers, tokenReducers) {
    return reducers instanceof InjectionToken ? injector.get(reducers) : reducers;
}
/**
 * @param {?} injector
 * @param {?} reducerCollection
 * @param {?} tokenReducerCollection
 * @return {?}
 */
function _createFeatureReducers(injector, reducerCollection, tokenReducerCollection) {
    const /** @type {?} */ reducers = reducerCollection.map((reducer, index) => {
        return reducer instanceof InjectionToken ? injector.get(reducer) : reducer;
    });
    return reducers;
}
/**
 * @param {?} initialState
 * @return {?}
 */
function _initialStateFactory(initialState) {
    if (typeof initialState === 'function') {
        return initialState();
    }
    return initialState;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @param {?} t
 * @return {?}
 */
function memoize(t) {
    let /** @type {?} */ lastArguments = null;
    let /** @type {?} */ lastResult = null;
    /**
     * @return {?}
     */
    function reset() {
        lastArguments = null;
        lastResult = null;
    }
    /**
     * @return {?}
     */
    function memoized() {
        if (!lastArguments) {
            lastResult = t.apply(null, arguments);
            lastArguments = arguments;
            return lastResult;
        }
        for (let /** @type {?} */ i = 0; i < arguments.length; i++) {
            if (arguments[i] !== lastArguments[i]) {
                lastResult = t.apply(null, arguments);
                lastArguments = arguments;
                return lastResult;
            }
        }
        return lastResult;
    }
    return { memoized, reset };
}
/**
 * @param {...?} input
 * @return {?}
 */
function createSelector(...input) {
    let /** @type {?} */ args = input;
    if (Array.isArray(args[0])) {
        const [head, ...tail] = args;
        args = [...head, ...tail];
    }
    const /** @type {?} */ selectors = args.slice(0, args.length - 1);
    const /** @type {?} */ projector = args[args.length - 1];
    const /** @type {?} */ memoizedSelectors = selectors.filter((selector) => selector.release && typeof selector.release === 'function');
    const /** @type {?} */ memoizedProjector = memoize(function (...selectors) {
        return projector.apply(null, selectors);
    });
    const /** @type {?} */ memoizedState = memoize(function (state) {
        const /** @type {?} */ args = selectors.map(fn => fn(state));
        return memoizedProjector.memoized.apply(null, args);
    });
    /**
     * @return {?}
     */
    function release() {
        memoizedState.reset();
        memoizedProjector.reset();
        memoizedSelectors.forEach(selector => selector.release());
    }
    return Object.assign(memoizedState.memoized, {
        release,
        projector: memoizedProjector.memoized,
    });
}
/**
 * @template T
 * @param {?} featureName
 * @return {?}
 */
function createFeatureSelector(featureName) {
    const { memoized, reset } = memoize(function (state) {
        return state[featureName];
    });
    return Object.assign(memoized, { release: reset, projector: memoized });
}

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

export { StoreModule, Store, combineReducers, compose, createReducerFactory, ActionsSubject, INIT, ReducerManager, ReducerObservable, ReducerManagerDispatcher, UPDATE, ScannedActionsSubject, createSelector, createFeatureSelector, State, StateObservable, reduceState, INITIAL_STATE, _REDUCER_FACTORY, REDUCER_FACTORY, _INITIAL_REDUCERS, INITIAL_REDUCERS, STORE_FEATURES, _INITIAL_STATE, META_REDUCERS, _STORE_REDUCERS, _FEATURE_REDUCERS, FEATURE_REDUCERS, _FEATURE_REDUCERS_TOKEN, StoreRootModule, StoreFeatureModule, _initialStateFactory, _createStoreReducers, _createFeatureReducers, ACTIONS_SUBJECT_PROVIDERS as ɵc, REDUCER_MANAGER_PROVIDERS as ɵd, SCANNED_ACTIONS_SUBJECT_PROVIDERS as ɵe, STATE_PROVIDERS as ɵf, STORE_PROVIDERS as ɵb };
//# sourceMappingURL=store.js.map
