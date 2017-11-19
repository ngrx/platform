/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Inject } from "@angular/core";
import { ScannedActionsSubject } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { filter } from "rxjs/operator/filter";
export class Actions extends Observable {
    /**
     * @param {?=} source
     */
    constructor(source) {
        super();
        if (source) {
            this.source = source;
        }
    }
    /**
     * @template R
     * @param {?} operator
     * @return {?}
     */
    lift(operator) {
        const /** @type {?} */ observable = new Actions();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
    /**
     * @template V2
     * @param {...?} allowedTypes
     * @return {?}
     */
    ofType(...allowedTypes) {
        return filter.call(this, (action) => allowedTypes.some(type => type === action.type));
    }
}
Actions.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Actions.ctorParameters = () => [
    { type: Observable, decorators: [{ type: Inject, args: [ScannedActionsSubject,] },] },
];
function Actions_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    Actions.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    Actions.ctorParameters;
}
//# sourceMappingURL=actions.js.map