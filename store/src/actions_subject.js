/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
export const /** @type {?} */ INIT = /** @type {?} */ ('@ngrx/store/init');
export class ActionsSubject extends BehaviorSubject {
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
function ActionsSubject_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ActionsSubject.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ActionsSubject.ctorParameters;
}
export const /** @type {?} */ ACTIONS_SUBJECT_PROVIDERS = [ActionsSubject];
//# sourceMappingURL=actions_subject.js.map