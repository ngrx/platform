(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/BehaviorSubject'), require('rxjs/Observable'), require('rxjs/Subject'), require('rxjs/scheduler/queue'), require('rxjs/operator/observeOn'), require('rxjs/operator/withLatestFrom'), require('rxjs/operator/scan'), require('rxjs/operator/map'), require('rxjs/operator/pluck'), require('rxjs/operator/distinctUntilChanged')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/BehaviorSubject', 'rxjs/Observable', 'rxjs/Subject', 'rxjs/scheduler/queue', 'rxjs/operator/observeOn', 'rxjs/operator/withLatestFrom', 'rxjs/operator/scan', 'rxjs/operator/map', 'rxjs/operator/pluck', 'rxjs/operator/distinctUntilChanged'], factory) :
	(factory((global.ngrx = global.ngrx || {}, global.ngrx.store = {}),global.ng.core,global.Rx,global.Rx,global.Rx,global.Rx.Scheduler,global.Rx.Observable.prototype,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,core,BehaviorSubject,Observable,Subject,queue,observeOn,withLatestFrom,scan,map,pluck,distinctUntilChanged) { 'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} reducers
 * @param {?=} initialState
 * @return {?}
 */
function combineReducers(reducers, initialState) {
    if (initialState === void 0) { initialState = {}; }
    var /** @type {?} */ reducerKeys = Object.keys(reducers);
    var /** @type {?} */ finalReducers = {};
    for (var /** @type {?} */ i = 0; i < reducerKeys.length; i++) {
        var /** @type {?} */ key = reducerKeys[i];
        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key];
        }
    }
    var /** @type {?} */ finalReducerKeys = Object.keys(finalReducers);
    return function combination(state, action) {
        state = state || initialState;
        var /** @type {?} */ hasChanged = false;
        var /** @type {?} */ nextState = {};
        for (var /** @type {?} */ i = 0; i < finalReducerKeys.length; i++) {
            var /** @type {?} */ key = finalReducerKeys[i];
            var /** @type {?} */ reducer = finalReducers[key];
            var /** @type {?} */ previousStateForKey = state[key];
            var /** @type {?} */ nextStateForKey = reducer(previousStateForKey, action);
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
        .filter(function (key) { return key !== keyToRemove; })
        .reduce(function (result, key) {
        return Object.assign(result, (_a = {}, _a[key] = object[key], _a));
        var _a;
    }, {});
}
/**
 * @param {...?} functions
 * @return {?}
 */
function compose() {
    var functions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        functions[_i] = arguments[_i];
    }
    return function (arg) {
        if (functions.length === 0) {
            return arg;
        }
        var /** @type {?} */ last = functions[functions.length - 1];
        var /** @type {?} */ rest = functions.slice(0, -1);
        return rest.reduceRight(function (composed, fn) { return fn(composed); }, last(arg));
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
        return compose.apply(null, metaReducers.concat([reducerFactory]));
    }
    return reducerFactory;
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var _INITIAL_STATE = new core.InjectionToken('@ngrx/store Internal Initial State');
var INITIAL_STATE = new core.InjectionToken('@ngrx/store Initial State');
var REDUCER_FACTORY = new core.InjectionToken('@ngrx/store Reducer Factory');
var _REDUCER_FACTORY = new core.InjectionToken('@ngrx/store Reducer Factory Provider');
var INITIAL_REDUCERS = new core.InjectionToken('@ngrx/store Initial Reducers');
var _INITIAL_REDUCERS = new core.InjectionToken('@ngrx/store Internal Initial Reducers');
var META_REDUCERS = new core.InjectionToken('@ngrx/store Meta Reducers');
var STORE_FEATURES = new core.InjectionToken('@ngrx/store Store Features');
var _STORE_REDUCERS = new core.InjectionToken('@ngrx/store Internal Store Reducers');
var _FEATURE_REDUCERS = new core.InjectionToken('@ngrx/store Internal Feature Reducers');
var _FEATURE_REDUCERS_TOKEN = new core.InjectionToken('@ngrx/store Internal Feature Reducers Token');
var FEATURE_REDUCERS = new core.InjectionToken('@ngrx/store Feature Reducers');
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var INIT = ('@ngrx/store/init');
var ActionsSubject = (function (_super) {
    __extends(ActionsSubject, _super);
    function ActionsSubject() {
        return _super.call(this, { type: INIT }) || this;
    }
    /**
     * @param {?} action
     * @return {?}
     */
    ActionsSubject.prototype.next = function (action) {
        if (typeof action === 'undefined') {
            throw new TypeError("Actions must be objects");
        }
        else if (typeof action.type === 'undefined') {
            throw new TypeError("Actions must have a type property");
        }
        _super.prototype.next.call(this, action);
    };
    /**
     * @return {?}
     */
    ActionsSubject.prototype.complete = function () {
        /* noop */
    };
    /**
     * @return {?}
     */
    ActionsSubject.prototype.ngOnDestroy = function () {
        _super.prototype.complete.call(this);
    };
    return ActionsSubject;
}(BehaviorSubject.BehaviorSubject));
ActionsSubject.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ActionsSubject.ctorParameters = function () { return []; };
var ACTIONS_SUBJECT_PROVIDERS = [ActionsSubject];
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
var ReducerObservable = (function (_super) {
    __extends(ReducerObservable, _super);
    function ReducerObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ReducerObservable;
}(Observable.Observable));
/**
 * @abstract
 */
var ReducerManagerDispatcher = (function (_super) {
    __extends(ReducerManagerDispatcher, _super);
    function ReducerManagerDispatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ReducerManagerDispatcher;
}(ActionsSubject));
var UPDATE = ('@ngrx/store/update-reducers');
var ReducerManager = (function (_super) {
    __extends(ReducerManager, _super);
    /**
     * @param {?} dispatcher
     * @param {?} initialState
     * @param {?} reducers
     * @param {?} reducerFactory
     */
    function ReducerManager(dispatcher, initialState, reducers, reducerFactory) {
        var _this = _super.call(this, reducerFactory(reducers, initialState)) || this;
        _this.dispatcher = dispatcher;
        _this.initialState = initialState;
        _this.reducers = reducers;
        _this.reducerFactory = reducerFactory;
        return _this;
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    ReducerManager.prototype.addFeature = function (_a) {
        var reducers = _a.reducers, reducerFactory = _a.reducerFactory, metaReducers = _a.metaReducers, initialState = _a.initialState, key = _a.key;
        var /** @type {?} */ reducer = typeof reducers === 'function'
            ? function (state, action) { return reducers(state || initialState, action); }
            : createReducerFactory(reducerFactory, metaReducers)(reducers, initialState);
        this.addReducer(key, reducer);
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    ReducerManager.prototype.removeFeature = function (_a) {
        var key = _a.key;
        this.removeReducer(key);
    };
    /**
     * @param {?} key
     * @param {?} reducer
     * @return {?}
     */
    ReducerManager.prototype.addReducer = function (key, reducer) {
        this.reducers = Object.assign({}, this.reducers, (_a = {}, _a[key] = reducer, _a));
        this.updateReducers();
        var _a;
    };
    /**
     * @param {?} key
     * @return {?}
     */
    ReducerManager.prototype.removeReducer = function (key) {
        this.reducers = omit(this.reducers, key);
        this.updateReducers();
    };
    /**
     * @return {?}
     */
    ReducerManager.prototype.updateReducers = function () {
        this.next(this.reducerFactory(this.reducers, this.initialState));
        this.dispatcher.next({ type: UPDATE });
    };
    /**
     * @return {?}
     */
    ReducerManager.prototype.ngOnDestroy = function () {
        this.complete();
    };
    return ReducerManager;
}(BehaviorSubject.BehaviorSubject));
ReducerManager.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ReducerManager.ctorParameters = function () { return [
    { type: ReducerManagerDispatcher, },
    { type: undefined, decorators: [{ type: core.Inject, args: [INITIAL_STATE,] },] },
    { type: undefined, decorators: [{ type: core.Inject, args: [INITIAL_REDUCERS,] },] },
    { type: undefined, decorators: [{ type: core.Inject, args: [REDUCER_FACTORY,] },] },
]; };
var REDUCER_MANAGER_PROVIDERS = [
    ReducerManager,
    { provide: ReducerObservable, useExisting: ReducerManager },
    { provide: ReducerManagerDispatcher, useExisting: ActionsSubject },
];
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ScannedActionsSubject = (function (_super) {
    __extends(ScannedActionsSubject, _super);
    function ScannedActionsSubject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    ScannedActionsSubject.prototype.ngOnDestroy = function () {
        this.complete();
    };
    return ScannedActionsSubject;
}(Subject.Subject));
ScannedActionsSubject.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ScannedActionsSubject.ctorParameters = function () { return []; };
var SCANNED_ACTIONS_SUBJECT_PROVIDERS = [
    ScannedActionsSubject,
];
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
var StateObservable = (function (_super) {
    __extends(StateObservable, _super);
    function StateObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StateObservable;
}(Observable.Observable));
var State = (function (_super) {
    __extends(State, _super);
    /**
     * @param {?} actions$
     * @param {?} reducer$
     * @param {?} scannedActions
     * @param {?} initialState
     */
    function State(actions$, reducer$, scannedActions, initialState) {
        var _this = _super.call(this, initialState) || this;
        var /** @type {?} */ actionsOnQueue$ = observeOn.observeOn.call(actions$, queue.queue);
        var /** @type {?} */ withLatestReducer$ = withLatestFrom.withLatestFrom.call(actionsOnQueue$, reducer$);
        var /** @type {?} */ stateAndAction$ = scan.scan.call(withLatestReducer$, reduceState, { state: initialState });
        _this.stateSubscription = stateAndAction$.subscribe({
            next: function (_a) {
                var state = _a.state, action = _a.action;
                _this.next(state);
                scannedActions.next(action);
            },
        });
        return _this;
    }
    /**
     * @return {?}
     */
    State.prototype.ngOnDestroy = function () {
        this.stateSubscription.unsubscribe();
        this.complete();
    };
    return State;
}(BehaviorSubject.BehaviorSubject));
State.INIT = INIT;
State.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
State.ctorParameters = function () { return [
    { type: ActionsSubject, },
    { type: ReducerObservable, },
    { type: ScannedActionsSubject, },
    { type: undefined, decorators: [{ type: core.Inject, args: [INITIAL_STATE,] },] },
]; };
/**
 * @template T, V
 * @param {?=} stateActionPair
 * @param {?=} __1
 * @return {?}
 */
function reduceState(stateActionPair, _a) {
    if (stateActionPair === void 0) { stateActionPair = { state: undefined }; }
    var action = _a[0], reducer = _a[1];
    var state = stateActionPair.state;
    return { state: reducer(state, action), action: action };
}
var STATE_PROVIDERS = [
    State,
    { provide: StateObservable, useExisting: State },
];
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Store = (function (_super) {
    __extends(Store, _super);
    /**
     * @param {?} state$
     * @param {?} actionsObserver
     * @param {?} reducerManager
     */
    function Store(state$, actionsObserver, reducerManager) {
        var _this = _super.call(this) || this;
        _this.actionsObserver = actionsObserver;
        _this.reducerManager = reducerManager;
        _this.source = state$;
        return _this;
    }
    /**
     * @param {?} pathOrMapFn
     * @param {...?} paths
     * @return {?}
     */
    Store.prototype.select = function (pathOrMapFn) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        var /** @type {?} */ mapped$;
        if (typeof pathOrMapFn === 'string') {
            mapped$ = pluck.pluck.call.apply(pluck.pluck, [this, pathOrMapFn].concat(paths));
        }
        else if (typeof pathOrMapFn === 'function') {
            mapped$ = map.map.call(this, pathOrMapFn);
        }
        else {
            throw new TypeError("Unexpected type '" + typeof pathOrMapFn + "' in select operator," +
                " expected 'string' or 'function'");
        }
        return distinctUntilChanged.distinctUntilChanged.call(mapped$);
    };
    /**
     * @template R
     * @param {?} operator
     * @return {?}
     */
    Store.prototype.lift = function (operator) {
        var /** @type {?} */ store = new Store(this, this.actionsObserver, this.reducerManager);
        store.operator = operator;
        return store;
    };
    /**
     * @template V
     * @param {?} action
     * @return {?}
     */
    Store.prototype.dispatch = function (action) {
        this.actionsObserver.next(action);
    };
    /**
     * @param {?} action
     * @return {?}
     */
    Store.prototype.next = function (action) {
        this.actionsObserver.next(action);
    };
    /**
     * @param {?} err
     * @return {?}
     */
    Store.prototype.error = function (err) {
        this.actionsObserver.error(err);
    };
    /**
     * @return {?}
     */
    Store.prototype.complete = function () {
        this.actionsObserver.complete();
    };
    /**
     * @template State, Actions
     * @param {?} key
     * @param {?} reducer
     * @return {?}
     */
    Store.prototype.addReducer = function (key, reducer) {
        this.reducerManager.addReducer(key, reducer);
    };
    /**
     * @template Key
     * @param {?} key
     * @return {?}
     */
    Store.prototype.removeReducer = function (key) {
        this.reducerManager.removeReducer(key);
    };
    return Store;
}(Observable.Observable));
Store.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
Store.ctorParameters = function () { return [
    { type: StateObservable, },
    { type: ActionsSubject, },
    { type: ReducerManager, },
]; };
var STORE_PROVIDERS = [Store];
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var StoreRootModule = (function () {
    /**
     * @param {?} actions$
     * @param {?} reducer$
     * @param {?} scannedActions$
     */
    function StoreRootModule(actions$, reducer$, scannedActions$) {
    }
    return StoreRootModule;
}());
StoreRootModule.decorators = [
    { type: core.NgModule, args: [{},] },
];
/** @nocollapse */
StoreRootModule.ctorParameters = function () { return [
    { type: ActionsSubject, },
    { type: ReducerObservable, },
    { type: ScannedActionsSubject, },
]; };
var StoreFeatureModule = (function () {
    /**
     * @param {?} features
     * @param {?} featureReducers
     * @param {?} reducerManager
     */
    function StoreFeatureModule(features, featureReducers, reducerManager) {
        this.features = features;
        this.featureReducers = featureReducers;
        this.reducerManager = reducerManager;
        features
            .map(function (feature, index) {
            var /** @type {?} */ featureReducerCollection = featureReducers.shift();
            var /** @type {?} */ reducers = featureReducerCollection[index];
            return Object.assign({}, feature, { reducers: reducers, initialState: _initialStateFactory(feature.initialState) });
        })
            .forEach(function (feature) { return reducerManager.addFeature(feature); });
    }
    /**
     * @return {?}
     */
    StoreFeatureModule.prototype.ngOnDestroy = function () {
        var _this = this;
        this.features.forEach(function (feature) { return _this.reducerManager.removeFeature(feature); });
    };
    return StoreFeatureModule;
}());
StoreFeatureModule.decorators = [
    { type: core.NgModule, args: [{},] },
];
/** @nocollapse */
StoreFeatureModule.ctorParameters = function () { return [
    { type: Array, decorators: [{ type: core.Inject, args: [STORE_FEATURES,] },] },
    { type: Array, decorators: [{ type: core.Inject, args: [FEATURE_REDUCERS,] },] },
    { type: ReducerManager, },
]; };
var StoreModule = (function () {
    function StoreModule() {
    }
    /**
     * @param {?} reducers
     * @param {?=} config
     * @return {?}
     */
    StoreModule.forRoot = function (reducers, config) {
        if (config === void 0) { config = {}; }
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
                    useExisting: reducers instanceof core.InjectionToken ? reducers : _INITIAL_REDUCERS,
                },
                {
                    provide: INITIAL_REDUCERS,
                    deps: [core.Injector, _INITIAL_REDUCERS, [new core.Inject(_STORE_REDUCERS)]],
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
    };
    /**
     * @param {?} featureName
     * @param {?} reducers
     * @param {?=} config
     * @return {?}
     */
    StoreModule.forFeature = function (featureName, reducers, config) {
        if (config === void 0) { config = {}; }
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
                    useExisting: reducers instanceof core.InjectionToken ? reducers : _FEATURE_REDUCERS,
                },
                {
                    provide: FEATURE_REDUCERS,
                    multi: true,
                    deps: [
                        core.Injector,
                        _FEATURE_REDUCERS,
                        [new core.Inject(_FEATURE_REDUCERS_TOKEN)],
                    ],
                    useFactory: _createFeatureReducers,
                },
            ],
        };
    };
    return StoreModule;
}());
StoreModule.decorators = [
    { type: core.NgModule, args: [{},] },
];
/** @nocollapse */
StoreModule.ctorParameters = function () { return []; };
/**
 * @param {?} injector
 * @param {?} reducers
 * @param {?} tokenReducers
 * @return {?}
 */
function _createStoreReducers(injector, reducers, tokenReducers) {
    return reducers instanceof core.InjectionToken ? injector.get(reducers) : reducers;
}
/**
 * @param {?} injector
 * @param {?} reducerCollection
 * @param {?} tokenReducerCollection
 * @return {?}
 */
function _createFeatureReducers(injector, reducerCollection, tokenReducerCollection) {
    var /** @type {?} */ reducers = reducerCollection.map(function (reducer, index) {
        return reducer instanceof core.InjectionToken ? injector.get(reducer) : reducer;
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
    var /** @type {?} */ lastArguments = null;
    var /** @type {?} */ lastResult = null;
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
        for (var /** @type {?} */ i = 0; i < arguments.length; i++) {
            if (arguments[i] !== lastArguments[i]) {
                lastResult = t.apply(null, arguments);
                lastArguments = arguments;
                return lastResult;
            }
        }
        return lastResult;
    }
    return { memoized: memoized, reset: reset };
}
/**
 * @param {...?} input
 * @return {?}
 */
function createSelector() {
    var input = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        input[_i] = arguments[_i];
    }
    var /** @type {?} */ args = input;
    if (Array.isArray(args[0])) {
        var head = args[0], tail = args.slice(1);
        args = head.concat(tail);
    }
    var /** @type {?} */ selectors = args.slice(0, args.length - 1);
    var /** @type {?} */ projector = args[args.length - 1];
    var /** @type {?} */ memoizedSelectors = selectors.filter(function (selector) { return selector.release && typeof selector.release === 'function'; });
    var /** @type {?} */ memoizedProjector = memoize(function () {
        var selectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selectors[_i] = arguments[_i];
        }
        return projector.apply(null, selectors);
    });
    var /** @type {?} */ memoizedState = memoize(function (state) {
        var /** @type {?} */ args = selectors.map(function (fn) { return fn(state); });
        return memoizedProjector.memoized.apply(null, args);
    });
    /**
     * @return {?}
     */
    function release() {
        memoizedState.reset();
        memoizedProjector.reset();
        memoizedSelectors.forEach(function (selector) { return selector.release(); });
    }
    return Object.assign(memoizedState.memoized, {
        release: release,
        projector: memoizedProjector.memoized,
    });
}
/**
 * @template T
 * @param {?} featureName
 * @return {?}
 */
function createFeatureSelector(featureName) {
    var _a = memoize(function (state) {
        return state[featureName];
    }), memoized = _a.memoized, reset = _a.reset;
    return Object.assign(memoized, { release: reset, projector: memoized });
}

exports.StoreModule = StoreModule;
exports.Store = Store;
exports.combineReducers = combineReducers;
exports.compose = compose;
exports.createReducerFactory = createReducerFactory;
exports.ActionsSubject = ActionsSubject;
exports.INIT = INIT;
exports.ReducerManager = ReducerManager;
exports.ReducerObservable = ReducerObservable;
exports.ReducerManagerDispatcher = ReducerManagerDispatcher;
exports.UPDATE = UPDATE;
exports.ScannedActionsSubject = ScannedActionsSubject;
exports.createSelector = createSelector;
exports.createFeatureSelector = createFeatureSelector;
exports.State = State;
exports.StateObservable = StateObservable;
exports.reduceState = reduceState;
exports.INITIAL_STATE = INITIAL_STATE;
exports._REDUCER_FACTORY = _REDUCER_FACTORY;
exports.REDUCER_FACTORY = REDUCER_FACTORY;
exports._INITIAL_REDUCERS = _INITIAL_REDUCERS;
exports.INITIAL_REDUCERS = INITIAL_REDUCERS;
exports.STORE_FEATURES = STORE_FEATURES;
exports._INITIAL_STATE = _INITIAL_STATE;
exports.META_REDUCERS = META_REDUCERS;
exports._STORE_REDUCERS = _STORE_REDUCERS;
exports._FEATURE_REDUCERS = _FEATURE_REDUCERS;
exports.FEATURE_REDUCERS = FEATURE_REDUCERS;
exports._FEATURE_REDUCERS_TOKEN = _FEATURE_REDUCERS_TOKEN;
exports.StoreRootModule = StoreRootModule;
exports.StoreFeatureModule = StoreFeatureModule;
exports._initialStateFactory = _initialStateFactory;
exports._createStoreReducers = _createStoreReducers;
exports._createFeatureReducers = _createFeatureReducers;
exports.ɵc = ACTIONS_SUBJECT_PROVIDERS;
exports.ɵd = REDUCER_MANAGER_PROVIDERS;
exports.ɵe = SCANNED_ACTIONS_SUBJECT_PROVIDERS;
exports.ɵf = STATE_PROVIDERS;
exports.ɵb = STORE_PROVIDERS;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=store.umd.js.map
