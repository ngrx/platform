/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { getSourceForInstance } from "./effects_metadata";
/**
 * @record
 */
export function OnRunEffects() { }
function OnRunEffects_tsickle_Closure_declarations() {
    /** @type {?} */
    OnRunEffects.prototype.ngrxOnRunEffects;
}
const /** @type {?} */ onRunEffectsKey = 'ngrxOnRunEffects';
/**
 * @param {?} sourceInstance
 * @return {?}
 */
export function isOnRunEffects(sourceInstance) {
    const /** @type {?} */ source = getSourceForInstance(sourceInstance);
    return (onRunEffectsKey in source && typeof source[onRunEffectsKey] === 'function');
}
//# sourceMappingURL=on_run_effects.js.map