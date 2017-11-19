/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, Inject, InjectionToken, Injector, } from "@angular/core";
import { combineReducers, createReducerFactory } from "./utils";
import { INITIAL_STATE, INITIAL_REDUCERS, _INITIAL_REDUCERS, REDUCER_FACTORY, _REDUCER_FACTORY, STORE_FEATURES, _INITIAL_STATE, META_REDUCERS, _STORE_REDUCERS, FEATURE_REDUCERS, _FEATURE_REDUCERS, _FEATURE_REDUCERS_TOKEN, } from "./tokens";
import { ACTIONS_SUBJECT_PROVIDERS, ActionsSubject } from "./actions_subject";
import { REDUCER_MANAGER_PROVIDERS, ReducerManager, ReducerObservable, } from "./reducer_manager";
import { SCANNED_ACTIONS_SUBJECT_PROVIDERS, ScannedActionsSubject, } from "./scanned_actions_subject";
import { STATE_PROVIDERS } from "./state";
import { STORE_PROVIDERS } from "./store";
export class StoreRootModule {
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
function StoreRootModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StoreRootModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StoreRootModule.ctorParameters;
}
export class StoreFeatureModule {
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
function StoreFeatureModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StoreFeatureModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StoreFeatureModule.ctorParameters;
    /** @type {?} */
    StoreFeatureModule.prototype.features;
    /** @type {?} */
    StoreFeatureModule.prototype.featureReducers;
    /** @type {?} */
    StoreFeatureModule.prototype.reducerManager;
}
export class StoreModule {
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
function StoreModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StoreModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StoreModule.ctorParameters;
}
/**
 * @param {?} injector
 * @param {?} reducers
 * @param {?} tokenReducers
 * @return {?}
 */
export function _createStoreReducers(injector, reducers, tokenReducers) {
    return reducers instanceof InjectionToken ? injector.get(reducers) : reducers;
}
/**
 * @param {?} injector
 * @param {?} reducerCollection
 * @param {?} tokenReducerCollection
 * @return {?}
 */
export function _createFeatureReducers(injector, reducerCollection, tokenReducerCollection) {
    const /** @type {?} */ reducers = reducerCollection.map((reducer, index) => {
        return reducer instanceof InjectionToken ? injector.get(reducer) : reducer;
    });
    return reducers;
}
/**
 * @param {?} initialState
 * @return {?}
 */
export function _initialStateFactory(initialState) {
    if (typeof initialState === 'function') {
        return initialState();
    }
    return initialState;
}
//# sourceMappingURL=store_module.js.map