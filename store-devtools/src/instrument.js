/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, InjectionToken, } from "@angular/core";
import { StateObservable, ReducerManagerDispatcher, } from "@ngrx/store";
import { StoreDevtools, DevtoolsDispatcher } from "./devtools";
import { STORE_DEVTOOLS_CONFIG, INITIAL_OPTIONS, } from "./config";
import { DevtoolsExtension, REDUX_DEVTOOLS_EXTENSION, } from "./extension";
export const /** @type {?} */ IS_EXTENSION_OR_MONITOR_PRESENT = new InjectionToken('Is Devtools Extension or Monitor Present');
/**
 * @param {?} extension
 * @param {?} config
 * @return {?}
 */
export function createIsExtensionOrMonitorPresent(extension, config) {
    return Boolean(extension) || config.monitor !== noMonitor;
}
/**
 * @return {?}
 */
export function createReduxDevtoolsExtension() {
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
export function createStateObservable(devtools) {
    return devtools.state;
}
/**
 * @return {?}
 */
export function noMonitor() {
    return null;
}
/**
 * @return {?}
 */
export function noActionSanitizer() {
    return null;
}
/**
 * @return {?}
 */
export function noStateSanitizer() {
    return null;
}
export const /** @type {?} */ DEFAULT_NAME = 'NgRx Store DevTools';
/**
 * @param {?} _options
 * @return {?}
 */
export function createConfig(_options) {
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
export class StoreDevtoolsModule {
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
function StoreDevtoolsModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StoreDevtoolsModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StoreDevtoolsModule.ctorParameters;
}
//# sourceMappingURL=instrument.js.map