/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { compose } from "@ngrx/store";
const /** @type {?} */ METADATA_KEY = '__@ngrx/effects__';
const /** @type {?} */ r = Reflect;
/**
 * @record
 */
export function EffectMetadata() { }
function EffectMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    EffectMetadata.prototype.propertyName;
    /** @type {?} */
    EffectMetadata.prototype.dispatch;
}
/**
 * @param {?} sourceProto
 * @return {?}
 */
function getEffectMetadataEntries(sourceProto) {
    return sourceProto.constructor[METADATA_KEY] || [];
}
/**
 * @param {?} sourceProto
 * @param {?} entries
 * @return {?}
 */
function setEffectMetadataEntries(sourceProto, entries) {
    const /** @type {?} */ constructor = sourceProto.constructor;
    const /** @type {?} */ meta = constructor.hasOwnProperty(METADATA_KEY)
        ? (/** @type {?} */ (constructor))[METADATA_KEY]
        : Object.defineProperty(constructor, METADATA_KEY, { value: [] })[METADATA_KEY];
    Array.prototype.push.apply(meta, entries);
}
/**
 * @param {?=} __0
 * @return {?}
 */
export function Effect({ dispatch } = { dispatch: true }) {
    return function (target, propertyName) {
        const /** @type {?} */ metadata = { propertyName, dispatch };
        setEffectMetadataEntries(target, [metadata]);
    };
}
/**
 * @param {?} instance
 * @return {?}
 */
export function getSourceForInstance(instance) {
    return Object.getPrototypeOf(instance);
}
export const /** @type {?} */ getSourceMetadata = compose(getEffectMetadataEntries, getSourceForInstance);
/**
 * @template T
 * @param {?} instance
 * @return {?}
 */
export function getEffectsMetadata(instance) {
    const /** @type {?} */ metadata = {};
    getSourceMetadata(instance).forEach(({ propertyName, dispatch }) => {
        metadata[propertyName] = { dispatch };
    });
    return metadata;
}
//# sourceMappingURL=effects_metadata.js.map