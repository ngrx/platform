import { createSelector } from '@ngrx/store';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template V
 * @return {?}
 */
function getInitialEntityState() {
    return {
        ids: [],
        entities: {},
    };
}
/**
 * @template V
 * @return {?}
 */
function createInitialStateFactory() {
    /**
     * @param {?=} additionalState
     * @return {?}
     */
    function getInitialState(additionalState = {}) {
        return Object.assign(getInitialEntityState(), additionalState);
    }
    return { getInitialState };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 * @return {?}
 */
function createSelectorsFactory() {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template V, R
 * @param {?} mutator
 * @return {?}
 */
function createStateOperator(mutator) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 * @param {?} selectId
 * @return {?}
 */
function createUnsortedStateAdapter(selectId) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 * @param {?} selectId
 * @param {?} sort
 * @return {?}
 */
function createSortedStateAdapter(selectId, sort) {
    const { removeOne, removeMany, removeAll } = createUnsortedStateAdapter(selectId);
    /**
     * @param {?} entity
     * @param {?} state
     * @return {?}
     */
    function addOneMutably(entity, state) {
        return addManyMutably([entity], state);
    }
    /**
     * @param {?} newModels
     * @param {?} state
     * @return {?}
     */
    function addManyMutably(newModels, state) {
        const /** @type {?} */ models = newModels.filter(model => !(selectId(model) in state.entities));
        return merge(models, state);
    }
    /**
     * @param {?} models
     * @param {?} state
     * @return {?}
     */
    function addAllMutably(models, state) {
        state.entities = {};
        state.ids = [];
        addManyMutably(models, state);
        return true;
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
     * @param {?} models
     * @param {?} update
     * @param {?} state
     * @return {?}
     */
    function takeUpdatedModel(models, update, state) {
        if (!(update.id in state.entities)) {
            return;
        }
        const /** @type {?} */ original = state.entities[update.id];
        const /** @type {?} */ updated = Object.assign({}, original, update.changes);
        delete state.entities[update.id];
        models.push(updated);
    }
    /**
     * @param {?} updates
     * @param {?} state
     * @return {?}
     */
    function updateManyMutably(updates, state) {
        const /** @type {?} */ models = [];
        updates.forEach(update => takeUpdatedModel(models, update, state));
        if (models.length) {
            state.ids = state.ids.filter((id) => id in state.entities);
        }
        return merge(models, state);
    }
    /**
     * @param {?} models
     * @param {?} state
     * @return {?}
     */
    function merge(models, state) {
        if (models.length === 0) {
            return false;
        }
        models.sort(sort);
        const /** @type {?} */ ids = [];
        let /** @type {?} */ i = 0;
        let /** @type {?} */ j = 0;
        while (i < models.length && j < state.ids.length) {
            const /** @type {?} */ model = models[i];
            const /** @type {?} */ modelId = selectId(model);
            const /** @type {?} */ entityId = state.ids[j];
            const /** @type {?} */ entity = state.entities[entityId];
            if (sort(model, entity) <= 0) {
                ids.push(modelId);
                i++;
            }
            else {
                ids.push(entityId);
                j++;
            }
        }
        if (i < models.length) {
            state.ids = ids.concat(models.slice(i).map(selectId));
        }
        else {
            state.ids = ids.concat(state.ids.slice(j));
        }
        models.forEach((model, i) => {
            state.entities[selectId(model)] = model;
        });
        return true;
    }
    return {
        removeOne,
        removeMany,
        removeAll,
        addOne: createStateOperator(addOneMutably),
        updateOne: createStateOperator(updateOneMutably),
        addAll: createStateOperator(addAllMutably),
        addMany: createStateOperator(addManyMutably),
        updateMany: createStateOperator(updateManyMutably),
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @template T
 * @param {?=} options
 * @return {?}
 */
function createEntityAdapter(options = {}) {
    const { selectId, sortComparer } = Object.assign({ sortComparer: false, selectId: (instance) => instance.id }, options);
    const /** @type {?} */ stateFactory = createInitialStateFactory();
    const /** @type {?} */ selectorsFactory = createSelectorsFactory();
    const /** @type {?} */ stateAdapter = sortComparer
        ? createSortedStateAdapter(selectId, sortComparer)
        : createUnsortedStateAdapter(selectId);
    return Object.assign({}, stateFactory, selectorsFactory, stateAdapter);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { createEntityAdapter };
//# sourceMappingURL=entity.js.map
