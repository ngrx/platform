/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template V
 * @return {?}
 */
export function getInitialEntityState() {
    return {
        ids: [],
        entities: {},
    };
}
/**
 * @template V
 * @return {?}
 */
export function createInitialStateFactory() {
    /**
     * @param {?=} additionalState
     * @return {?}
     */
    function getInitialState(additionalState = {}) {
        return Object.assign(getInitialEntityState(), additionalState);
    }
    return { getInitialState };
}
//# sourceMappingURL=entity_state.js.map