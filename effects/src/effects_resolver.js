/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { merge } from "rxjs/observable/merge";
import { ignoreElements } from "rxjs/operator/ignoreElements";
import { materialize } from "rxjs/operator/materialize";
import { map } from "rxjs/operator/map";
import { getSourceMetadata, getSourceForInstance } from "./effects_metadata";
import { isOnRunEffects } from "./on_run_effects";
/**
 * @param {?} sourceInstance
 * @return {?}
 */
export function mergeEffects(sourceInstance) {
    const /** @type {?} */ sourceName = getSourceForInstance(sourceInstance).constructor.name;
    const /** @type {?} */ observables = getSourceMetadata(sourceInstance).map(({ propertyName, dispatch }) => {
        const /** @type {?} */ observable = typeof sourceInstance[propertyName] === 'function'
            ? sourceInstance[propertyName]()
            : sourceInstance[propertyName];
        if (dispatch === false) {
            return ignoreElements.call(observable);
        }
        const /** @type {?} */ materialized$ = materialize.call(observable);
        return map.call(materialized$, (notification) => ({
            effect: sourceInstance[propertyName],
            notification,
            propertyName,
            sourceName,
            sourceInstance,
        }));
    });
    return merge(...observables);
}
/**
 * @param {?} sourceInstance
 * @return {?}
 */
export function resolveEffectSource(sourceInstance) {
    const /** @type {?} */ mergedEffects$ = mergeEffects(sourceInstance);
    if (isOnRunEffects(sourceInstance)) {
        return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }
    return mergedEffects$;
}
//# sourceMappingURL=effects_resolver.js.map