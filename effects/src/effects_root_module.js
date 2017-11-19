/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule, Inject, Optional } from "@angular/core";
import { StoreModule, Store } from "@ngrx/store";
import { EffectsRunner } from "./effects_runner";
import { EffectSources } from "./effect_sources";
import { ROOT_EFFECTS } from "./tokens";
export const /** @type {?} */ ROOT_EFFECTS_INIT = '@ngrx/effects/init';
export class EffectsRootModule {
    /**
     * @param {?} sources
     * @param {?} runner
     * @param {?} store
     * @param {?} rootEffects
     * @param {?} storeModule
     */
    constructor(sources, runner, store, rootEffects, storeModule) {
        this.sources = sources;
        runner.start();
        rootEffects.forEach(effectSourceInstance => sources.addEffects(effectSourceInstance));
        store.dispatch({ type: ROOT_EFFECTS_INIT });
    }
    /**
     * @param {?} effectSourceInstance
     * @return {?}
     */
    addEffects(effectSourceInstance) {
        this.sources.addEffects(effectSourceInstance);
    }
}
EffectsRootModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
EffectsRootModule.ctorParameters = () => [
    { type: EffectSources, },
    { type: EffectsRunner, },
    { type: Store, },
    { type: Array, decorators: [{ type: Inject, args: [ROOT_EFFECTS,] },] },
    { type: StoreModule, decorators: [{ type: Optional },] },
];
function EffectsRootModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    EffectsRootModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    EffectsRootModule.ctorParameters;
    /** @type {?} */
    EffectsRootModule.prototype.sources;
}
//# sourceMappingURL=effects_root_module.js.map