/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { createInitialStateFactory } from "./entity_state";
import { createSelectorsFactory } from "./state_selectors";
import { createSortedStateAdapter } from "./sorted_state_adapter";
import { createUnsortedStateAdapter } from "./unsorted_state_adapter";
/**
 * @template T
 * @param {?=} options
 * @return {?}
 */
export function createEntityAdapter(options = {}) {
    const { selectId, sortComparer } = Object.assign({ sortComparer: false, selectId: (instance) => instance.id }, options);
    const /** @type {?} */ stateFactory = createInitialStateFactory();
    const /** @type {?} */ selectorsFactory = createSelectorsFactory();
    const /** @type {?} */ stateAdapter = sortComparer
        ? createSortedStateAdapter(selectId, sortComparer)
        : createUnsortedStateAdapter(selectId);
    return Object.assign({}, stateFactory, selectorsFactory, stateAdapter);
}
//# sourceMappingURL=create_adapter.js.map