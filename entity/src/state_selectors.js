/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { createSelector } from "@ngrx/store";
/**
 * @template T
 * @return {?}
 */
export function createSelectorsFactory() {
    /**
     * @param {?=} selectState
     * @return {?}
     */
    function getSelectors(selectState) {
        const /** @type {?} */ selectIds = (state) => state.ids;
        const /** @type {?} */ selectEntities = (state) => state.entities;
        const /** @type {?} */ selectAll = createSelector(selectIds, selectEntities, (ids, entities) => ids.map((id) => (/** @type {?} */ (entities))[id]));
        const /** @type {?} */ selectTotal = createSelector(selectIds, ids => ids.length);
        if (!selectState) {
            return {
                selectIds,
                selectEntities,
                selectAll,
                selectTotal,
            };
        }
        return {
            selectIds: createSelector(selectState, selectIds),
            selectEntities: createSelector(selectState, selectEntities),
            selectAll: createSelector(selectState, selectAll),
            selectTotal: createSelector(selectState, selectTotal),
        };
    }
    return { getSelectors };
}
//# sourceMappingURL=state_selectors.js.map