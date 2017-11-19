/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { groupBy } from "rxjs/operator/groupBy";
import { mergeMap } from "rxjs/operator/mergeMap";
import { exhaustMap } from "rxjs/operator/exhaustMap";
import { map } from "rxjs/operator/map";
import { dematerialize } from "rxjs/operator/dematerialize";
import { filter } from "rxjs/operator/filter";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { verifyOutput } from "./effect_notification";
import { getSourceForInstance } from "./effects_metadata";
import { resolveEffectSource } from "./effects_resolver";
import { ErrorReporter } from "./error_reporter";
export class EffectSources extends Subject {
    /**
     * @param {?} errorReporter
     */
    constructor(errorReporter) {
        super();
        this.errorReporter = errorReporter;
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.next(effectSourceInstance);
    }
    /**
     * \@internal
     * @return {?}
     */
    toActions() {
        return mergeMap.call(groupBy.call(this, getSourceForInstance), (source$) => dematerialize.call(filter.call(map.call(exhaustMap.call(source$, resolveEffectSource), (output) => {
            verifyOutput(output, this.errorReporter);
            return output.notification;
        }), (notification) => notification.kind === 'N')));
    }
}
EffectSources.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EffectSources.ctorParameters = () => [
    { type: ErrorReporter, },
];
function EffectSources_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    EffectSources.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    EffectSources.ctorParameters;
    /** @type {?} */
    EffectSources.prototype.errorReporter;
}
//# sourceMappingURL=effect_sources.js.map