(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@ngrx/store'), require('rxjs/observable/of')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/router', '@ngrx/store', 'rxjs/observable/of'], factory) :
	(factory((global.ngrx = global.ngrx || {}, global.ngrx.routerStore = {}),global.ng.core,global.ng.router,global.ngrx.store,global.Rx.Observable));
}(this, (function (exports,core,router,store,of) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
var RouterStateSerializer = (function () {
    function RouterStateSerializer() {
    }
    return RouterStateSerializer;
}());
var DefaultRouterStateSerializer = (function () {
    function DefaultRouterStateSerializer() {
    }
    /**
     * @param {?} routerState
     * @return {?}
     */
    DefaultRouterStateSerializer.prototype.serialize = function (routerState) {
        return routerState;
    };
    return DefaultRouterStateSerializer;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * An action dispatched when the router navigates.
 */
var ROUTER_NAVIGATION = 'ROUTER_NAVIGATION';
/**
 * An action dispatched when the router cancels navigation.
 */
var ROUTER_CANCEL = 'ROUTER_CANCEL';
/**
 * An action dispatched when the router errors.
 */
var ROUTER_ERROR = 'ROUTE_ERROR';
/**
 * @template T
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function routerReducer(state, action) {
    switch (action.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: action.payload.routerState,
                navigationId: action.payload.event.id,
            };
        default:
            return state;
    }
}
/**
 * @record
 */
var _ROUTER_CONFIG = new core.InjectionToken('@ngrx/router-store Internal Configuration');
var ROUTER_CONFIG = new core.InjectionToken('@ngrx/router-store Configuration');
var DEFAULT_ROUTER_FEATURENAME = 'routerReducer';
/**
 * @param {?} config
 * @return {?}
 */
function _createDefaultRouterConfig(config) {
    var /** @type {?} */ _config;
    if (typeof config === 'function') {
        _config = config();
    }
    else {
        _config = config || {};
    }
    return Object.assign({ stateKey: DEFAULT_ROUTER_FEATURENAME }, _config);
}
var ɵ0 = { stateKey: DEFAULT_ROUTER_FEATURENAME };
/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: RouterStateSnapshot,
 *   event: RoutesRecognized
 * }
 * ```
 *
 * Either a reducer or an effect can be invoked in response to this action.
 * If the invoked reducer throws, the navigation will be canceled.
 *
 * If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be
 * dispatched. If navigation results in an error, a ROUTER_ERROR action will be dispatched.
 *
 * Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation
 * which can be used to restore the consistency of the store.
 *
 * Usage:
 *
 * ```typescript
 * \@NgModule({
 *   declarations: [AppCmp, SimpleCmp],
 *   imports: [
 *     BrowserModule,
 *     StoreModule.forRoot(mapOfReducers),
 *     RouterModule.forRoot([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ]),
 *     StoreRouterConnectingModule
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
var StoreRouterConnectingModule = (function () {
    /**
     * @param {?} store
     * @param {?} router
     * @param {?} serializer
     * @param {?} config
     */
    function StoreRouterConnectingModule(store$$1, router$$1, serializer, config) {
        this.store = store$$1;
        this.router = router$$1;
        this.serializer = serializer;
        this.config = config;
        this.dispatchTriggeredByRouter = false;
        this.navigationTriggeredByDispatch = false;
        this.stateKey = (this.config.stateKey);
        this.setUpBeforePreactivationHook();
        this.setUpStoreStateListener();
        this.setUpStateRollbackEvents();
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    StoreRouterConnectingModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: StoreRouterConnectingModule,
            providers: [
                { provide: _ROUTER_CONFIG, useValue: config },
                {
                    provide: ROUTER_CONFIG,
                    useFactory: _createDefaultRouterConfig,
                    deps: [_ROUTER_CONFIG],
                },
            ],
        };
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpBeforePreactivationHook = function () {
        var _this = this;
        ((this.router)).hooks.beforePreactivation = function (routerState) {
            _this.routerState = _this.serializer.serialize(routerState);
            if (_this.shouldDispatchRouterNavigation())
                _this.dispatchRouterNavigation();
            return of.of(true);
        };
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpStoreStateListener = function () {
        var _this = this;
        this.store.subscribe(function (s) {
            _this.storeState = s;
        });
        this.store.select(this.stateKey).subscribe(function () {
            _this.navigateIfNeeded();
        });
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.shouldDispatchRouterNavigation = function () {
        if (!this.storeState[this.stateKey])
            return true;
        return !this.navigationTriggeredByDispatch;
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.navigateIfNeeded = function () {
        if (!this.storeState[this.stateKey] ||
            !this.storeState[this.stateKey].state) {
            return;
        }
        if (this.dispatchTriggeredByRouter)
            return;
        if (this.router.url !== this.storeState[this.stateKey].state.url) {
            this.navigationTriggeredByDispatch = true;
            this.router.navigateByUrl(this.storeState[this.stateKey].state.url);
        }
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.setUpStateRollbackEvents = function () {
        var _this = this;
        this.router.events.subscribe(function (e) {
            if (e instanceof router.RoutesRecognized) {
                _this.lastRoutesRecognized = e;
            }
            else if (e instanceof router.NavigationCancel) {
                _this.dispatchRouterCancel(e);
            }
            else if (e instanceof router.NavigationError) {
                _this.dispatchRouterError(e);
            }
        });
    };
    /**
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterNavigation = function () {
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: this.routerState,
            event: new router.RoutesRecognized(this.lastRoutesRecognized.id, this.lastRoutesRecognized.url, this.lastRoutesRecognized.urlAfterRedirects, this.routerState),
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterCancel = function (event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            routerState: this.routerState,
            storeState: this.storeState,
            event: event,
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            routerState: this.routerState,
            storeState: this.storeState,
            event: new router.NavigationError(event.id, event.url, "" + event),
        });
    };
    /**
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    StoreRouterConnectingModule.prototype.dispatchRouterAction = function (type, payload) {
        this.dispatchTriggeredByRouter = true;
        try {
            this.store.dispatch({ type: type, payload: payload });
        }
        finally {
            this.dispatchTriggeredByRouter = false;
            this.navigationTriggeredByDispatch = false;
        }
    };
    return StoreRouterConnectingModule;
}());
StoreRouterConnectingModule.decorators = [
    { type: core.NgModule, args: [{
                providers: [
                    { provide: RouterStateSerializer, useClass: DefaultRouterStateSerializer },
                    {
                        provide: _ROUTER_CONFIG,
                        useValue: ɵ0,
                    },
                    {
                        provide: ROUTER_CONFIG,
                        useFactory: _createDefaultRouterConfig,
                        deps: [_ROUTER_CONFIG],
                    },
                ],
            },] },
];
/** @nocollapse */
StoreRouterConnectingModule.ctorParameters = function () { return [
    { type: store.Store, },
    { type: router.Router, },
    { type: RouterStateSerializer, },
    { type: undefined, decorators: [{ type: core.Inject, args: [ROUTER_CONFIG,] },] },
]; };

exports.ROUTER_ERROR = ROUTER_ERROR;
exports.ROUTER_CANCEL = ROUTER_CANCEL;
exports.ROUTER_NAVIGATION = ROUTER_NAVIGATION;
exports.routerReducer = routerReducer;
exports.StoreRouterConnectingModule = StoreRouterConnectingModule;
exports.ROUTER_CONFIG = ROUTER_CONFIG;
exports.DEFAULT_ROUTER_FEATURENAME = DEFAULT_ROUTER_FEATURENAME;
exports.RouterStateSerializer = RouterStateSerializer;
exports.DefaultRouterStateSerializer = DefaultRouterStateSerializer;
exports.ɵa = _ROUTER_CONFIG;
exports.ɵb = _createDefaultRouterConfig;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=router-store.umd.js.map
