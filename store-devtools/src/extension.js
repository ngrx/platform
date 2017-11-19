/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { empty } from "rxjs/observable/empty";
import { filter } from "rxjs/operator/filter";
import { map } from "rxjs/operator/map";
import { share } from "rxjs/operator/share";
import { switchMap } from "rxjs/operator/switchMap";
import { takeUntil } from "rxjs/operator/takeUntil";
import { STORE_DEVTOOLS_CONFIG, StoreDevtoolsConfig } from "./config";
import { applyOperators } from "./utils";
export const /** @type {?} */ ExtensionActionTypes = {
    START: 'START',
    DISPATCH: 'DISPATCH',
    STOP: 'STOP',
    ACTION: 'ACTION',
};
export const /** @type {?} */ REDUX_DEVTOOLS_EXTENSION = new InjectionToken('Redux Devtools Extension');
/**
 * @record
 */
export function ReduxDevtoolsExtensionConnection() { }
function ReduxDevtoolsExtensionConnection_tsickle_Closure_declarations() {
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.subscribe;
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.unsubscribe;
    /** @type {?} */
    ReduxDevtoolsExtensionConnection.prototype.send;
}
/**
 * @record
 */
export function ReduxDevtoolsExtension() { }
function ReduxDevtoolsExtension_tsickle_Closure_declarations() {
    /** @type {?} */
    ReduxDevtoolsExtension.prototype.connect;
    /** @type {?} */
    ReduxDevtoolsExtension.prototype.send;
}
export class DevtoolsExtension {
    /**
     * @param {?} devtoolsExtension
     * @param {?} config
     */
    constructor(devtoolsExtension, config) {
        this.config = config;
        this.instanceId = `ngrx-store-${Date.now()}`;
        this.devtoolsExtension = devtoolsExtension;
        this.createActionStreams();
    }
    /**
     * @param {?} action
     * @param {?} state
     * @return {?}
     */
    notify(action, state) {
        if (!this.devtoolsExtension) {
            return;
        }
        this.devtoolsExtension.send(null, state, this.config, this.instanceId);
    }
    /**
     * @return {?}
     */
    createChangesObservable() {
        if (!this.devtoolsExtension) {
            return empty();
        }
        return new Observable(subscriber => {
            const /** @type {?} */ connection = this.devtoolsExtension.connect({
                instanceId: this.instanceId,
            });
            connection.subscribe((change) => subscriber.next(change));
            return connection.unsubscribe;
        });
    }
    /**
     * @return {?}
     */
    createActionStreams() {
        // Listens to all changes based on our instanceId
        const /** @type {?} */ changes$ = share.call(this.createChangesObservable());
        // Listen for the start action
        const /** @type {?} */ start$ = filter.call(changes$, (change) => change.type === ExtensionActionTypes.START);
        // Listen for the stop action
        const /** @type {?} */ stop$ = filter.call(changes$, (change) => change.type === ExtensionActionTypes.STOP);
        // Listen for lifted actions
        const /** @type {?} */ liftedActions$ = applyOperators(changes$, [
            [filter, (change) => change.type === ExtensionActionTypes.DISPATCH],
            [map, (change) => this.unwrapAction(change.payload)],
        ]);
        // Listen for unlifted actions
        const /** @type {?} */ actions$ = applyOperators(changes$, [
            [filter, (change) => change.type === ExtensionActionTypes.ACTION],
            [map, (change) => this.unwrapAction(change.payload)],
        ]);
        const /** @type {?} */ actionsUntilStop$ = takeUntil.call(actions$, stop$);
        const /** @type {?} */ liftedUntilStop$ = takeUntil.call(liftedActions$, stop$);
        // Only take the action sources between the start/stop events
        this.actions$ = switchMap.call(start$, () => actionsUntilStop$);
        this.liftedActions$ = switchMap.call(start$, () => liftedUntilStop$);
    }
    /**
     * @param {?} action
     * @return {?}
     */
    unwrapAction(action) {
        return typeof action === 'string' ? eval(`(${action})`) : action;
    }
}
DevtoolsExtension.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DevtoolsExtension.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [REDUX_DEVTOOLS_EXTENSION,] },] },
    { type: StoreDevtoolsConfig, decorators: [{ type: Inject, args: [STORE_DEVTOOLS_CONFIG,] },] },
];
function DevtoolsExtension_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DevtoolsExtension.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DevtoolsExtension.ctorParameters;
    /** @type {?} */
    DevtoolsExtension.prototype.instanceId;
    /** @type {?} */
    DevtoolsExtension.prototype.devtoolsExtension;
    /** @type {?} */
    DevtoolsExtension.prototype.liftedActions$;
    /** @type {?} */
    DevtoolsExtension.prototype.actions$;
    /** @type {?} */
    DevtoolsExtension.prototype.config;
}
//# sourceMappingURL=extension.js.map