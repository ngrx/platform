/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
export class ScannedActionsSubject extends Subject {
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
function ScannedActionsSubject_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ScannedActionsSubject.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ScannedActionsSubject.ctorParameters;
}
export const /** @type {?} */ SCANNED_ACTIONS_SUBJECT_PROVIDERS = [
    ScannedActionsSubject,
];
//# sourceMappingURL=scanned_actions_subject.js.map