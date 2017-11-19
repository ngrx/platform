/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Inject } from "@angular/core";
import { CONSOLE } from "./tokens";
export class ErrorReporter {
    /**
     * @param {?} console
     */
    constructor(console) {
        this.console = console;
    }
    /**
     * @param {?} reason
     * @param {?} details
     * @return {?}
     */
    report(reason, details) {
        this.console.group(reason);
        for (let /** @type {?} */ key in details) {
            this.console.error(`${key}:`, details[key]);
        }
        this.console.groupEnd();
    }
}
ErrorReporter.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ErrorReporter.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [CONSOLE,] },] },
];
function ErrorReporter_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ErrorReporter.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ErrorReporter.ctorParameters;
    /** @type {?} */
    ErrorReporter.prototype.console;
}
//# sourceMappingURL=error_reporter.js.map