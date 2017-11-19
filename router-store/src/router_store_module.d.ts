import { ModuleWithProviders, InjectionToken } from '@angular/core';
import { NavigationCancel, NavigationError, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { Store } from '@ngrx/store';
import { RouterStateSerializer } from './serializer';
/**
 * An action dispatched when the router navigates.
 */
export declare const ROUTER_NAVIGATION = "ROUTER_NAVIGATION";
/**
 * Payload of ROUTER_NAVIGATION.
 */
export declare type RouterNavigationPayload<T> = {
    routerState: T;
    event: RoutesRecognized;
};
/**
 * An action dispatched when the router navigates.
 */
export declare type RouterNavigationAction<T = RouterStateSnapshot> = {
    type: typeof ROUTER_NAVIGATION;
    payload: RouterNavigationPayload<T>;
};
/**
 * An action dispatched when the router cancels navigation.
 */
export declare const ROUTER_CANCEL = "ROUTER_CANCEL";
/**
 * Payload of ROUTER_CANCEL.
 */
export declare type RouterCancelPayload<T, V> = {
    routerState: V;
    storeState: T;
    event: NavigationCancel;
};
/**
 * An action dispatched when the router cancel navigation.
 */
export declare type RouterCancelAction<T, V = RouterStateSnapshot> = {
    type: typeof ROUTER_CANCEL;
    payload: RouterCancelPayload<T, V>;
};
/**
 * An action dispatched when the router errors.
 */
export declare const ROUTER_ERROR = "ROUTE_ERROR";
/**
 * Payload of ROUTER_ERROR.
 */
export declare type RouterErrorPayload<T, V> = {
    routerState: V;
    storeState: T;
    event: NavigationError;
};
/**
 * An action dispatched when the router errors.
 */
export declare type RouterErrorAction<T, V = RouterStateSnapshot> = {
    type: typeof ROUTER_ERROR;
    payload: RouterErrorPayload<T, V>;
};
/**
 * An union type of router actions.
 */
export declare type RouterAction<T, V = RouterStateSnapshot> = RouterNavigationAction<V> | RouterCancelAction<T, V> | RouterErrorAction<T, V>;
export declare type RouterReducerState<T = RouterStateSnapshot> = {
    state: T;
    navigationId: number;
};
export declare function routerReducer<T = RouterStateSnapshot>(state: RouterReducerState<T>, action: RouterAction<any, T>): RouterReducerState<T>;
export interface StoreRouterConfig {
    stateKey?: string;
}
export declare const _ROUTER_CONFIG: InjectionToken<{}>;
export declare const ROUTER_CONFIG: InjectionToken<{}>;
export declare const DEFAULT_ROUTER_FEATURENAME = "routerReducer";
export declare function _createDefaultRouterConfig(config: StoreRouterConfig | StoreRouterConfigFunction): StoreRouterConfig;
export declare type StoreRouterConfigFunction = () => StoreRouterConfig;
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
 * @NgModule({
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
export declare class StoreRouterConnectingModule {
    private store;
    private router;
    private serializer;
    private config;
    static forRoot(config?: StoreRouterConfig | StoreRouterConfigFunction): ModuleWithProviders;
    private routerState;
    private storeState;
    private lastRoutesRecognized;
    private dispatchTriggeredByRouter;
    private navigationTriggeredByDispatch;
    private stateKey;
    constructor(store: Store<any>, router: Router, serializer: RouterStateSerializer<RouterStateSnapshot>, config: StoreRouterConfig);
    private setUpBeforePreactivationHook();
    private setUpStoreStateListener();
    private shouldDispatchRouterNavigation();
    private navigateIfNeeded();
    private setUpStateRollbackEvents();
    private dispatchRouterNavigation();
    private dispatchRouterCancel(event);
    private dispatchRouterError(event);
    private dispatchRouterAction(type, payload);
}
