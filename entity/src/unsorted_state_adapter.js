/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { createStateOperator } from "./state_adapter";
/**
 * @template T
 * @param {?} selectId
 * @return {?}
 */
export function createUnsortedStateAdapter(selectId) {
    /**
     * @param {?} entity
     * @param {?} state
     * @return {?}
     */
    function addOneMutably(entity, state) {
        const /** @type {?} */ key = selectId(entity);
        if (key in state.entities) {
            return false;
        }
        state.ids.push(key);
        state.entities[key] = entity;
        return true;
    }
    /**
     * @param {?} entities
     * @param {?} state
     * @return {?}
     */
    function addManyMutably(entities, state) {
        let /** @type {?} */ didMutate = false;
        for (let /** @type {?} */ index in entities) {
            didMutate = addOneMutably(entities[index], state) || didMutate;
        }
        return didMutate;
    }
    /**
     * @param {?} entities
     * @param {?} state
     * @return {?}
     */
    function addAllMutably(entities, state) {
        state.ids = [];
        state.entities = {};
        addManyMutably(entities, state);
        return true;
    }
    /**
     * @param {?} key
     * @param {?} state
     * @return {?}
     */
    function removeOneMutably(key, state) {
        return removeManyMutably([key], state);
    }
    /**
     * @param {?} keys
     * @param {?} state
     * @return {?}
     */
    function removeManyMutably(keys, state) {
        const /** @type {?} */ didMutate = keys
            .filter(key => key in state.entities)
            .map(key => delete state.entities[key]).length > 0;
        if (didMutate) {
            state.ids = state.ids.filter((id) => id in state.entities);
        }
        return didMutate;
    }
    /**
     * @template S
     * @param {?} state
     * @return {?}
     */
    function removeAll(state) {
        return Object.assign({}, state, {
            ids: [],
            entities: {},
        });
    }
    /**
     * @param {?} keys
     * @param {?} update
     * @param {?} state
     * @return {?}
     */
    function takeNewKey(keys, update, state) {
        const /** @type {?} */ original = state.entities[update.id];
        const /** @type {?} */ updated = Object.assign({}, original, update.changes);
        const /** @type {?} */ newKey = selectId(updated);
        if (newKey !== update.id) {
            keys[update.id] = newKey;
            delete state.entities[update.id];
        }
        state.entities[newKey] = updated;
    }
    /**
     * @param {?} update
     * @param {?} state
     * @return {?}
     */
    function updateOneMutably(update, state) {
        return updateManyMutably([update], state);
    }
    /**
     * @param {?} updates
     * @param {?} state
     * @return {?}
     */
    function updateManyMutably(updates, state) {
        const /** @type {?} */ newKeys = {};
        const /** @type {?} */ didMutate = updates
            .filter(update => update.id in state.entities)
            .map(update => takeNewKey(newKeys, update, state)).length > 0;
        if (didMutate) {
            state.ids = state.ids.map((id) => newKeys[id] || id);
        }
        return didMutate;
    }
    return {
        removeAll,
        addOne: createStateOperator(addOneMutably),
        addMany: createStateOperator(addManyMutably),
        addAll: createStateOperator(addAllMutably),
        updateOne: createStateOperator(updateOneMutably),
        updateMany: createStateOperator(updateManyMutably),
        removeOne: createStateOperator(removeOneMutably),
        removeMany: createStateOperator(removeManyMutably),
    };
}
//# sourceMappingURL=unsorted_state_adapter.js.map