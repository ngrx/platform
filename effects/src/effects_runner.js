/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { EffectSources } from "./effect_sources";
export class EffectsRunner {
    /**
     * @param {?} effectSources
     * @param {?} store
     */
    constructor(effectSources, store) {
        this.effectSources = effectSources;
        this.store = store;
        this.effectsSubscription = null;
    }
    /**
     * @return {?}
     */
    start() {
        if (!this.effectsSubscription) {
            this.effectsSubscription = this.effectSources
                .toActions()
                .subscribe(this.store);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.effectsSubscription) {
            this.effectsSubscription.unsubscribe();
            this.effectsSubscription = null;
        }
    }
}
EffectsRunner.decorators = [
    { type: Injectable },
];
/** @nocollapse */
EffectsRunner.ctorParameters = () => [
    { type: EffectSources, },
    { type: Store, },
];
function EffectsRunner_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    EffectsRunner.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    EffectsRunner.ctorParameters;
    /** @type {?} */
    EffectsRunner.prototype.effectsSubscription;
    /** @type {?} */
    EffectsRunner.prototype.effectSources;
    /** @type {?} */
    EffectsRunner.prototype.store;
}
//# sourceMappingURL=effects_runner.js.map