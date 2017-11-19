/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template V, R
 * @param {?} mutator
 * @return {?}
 */
export function createStateOperator(mutator) {
    return function operation(arg, state) {
        const /** @type {?} */ clonedEntityState = {
            ids: [...state.ids],
            entities: Object.assign({}, state.entities),
        };
        const /** @type {?} */ didMutate = mutator(arg, clonedEntityState);
        if (didMutate) {
            return Object.assign({}, state, clonedEntityState);
        }
        return state;
    };
}
//# sourceMappingURL=state_adapter.js.map