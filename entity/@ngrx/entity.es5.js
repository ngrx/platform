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
    function getInitialState(additionalState) {
        if (additionalState === void 0) { additionalState = {}; }
        return Object.assign(getInitialEntityState(), additionalState);
    }
    return { getInitialState: getInitialState };
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
        var /** @type {?} */ selectIds = function (state) { return state.ids; };
        var /** @type {?} */ selectEntities = function (state) { return state.entities; };
        var /** @type {?} */ selectAll = createSelector(selectIds, selectEntities, function (ids, entities) { return ids.map(function (id) { return ((entities))[id]; }); });
        var /** @type {?} */ selectTotal = createSelector(selectIds, function (ids) { return ids.length; });
        if (!selectState) {
            return {
                selectIds: selectIds,
                selectEntities: selectEntities,
                selectAll: selectAll,
                selectTotal: selectTotal,
            };
        }
        return {
            selectIds: createSelector(selectState, selectIds),
            selectEntities: createSelector(selectState, selectEntities),
            selectAll: createSelector(selectState, selectAll),
            selectTotal: createSelector(selectState, selectTotal),
        };
    }
    return { getSelectors: getSelectors };
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
        var /** @type {?} */ clonedEntityState = {
            ids: state.ids.slice(),
            entities: Object.assign({}, state.entities),
        };
        var /** @type {?} */ didMutate = mutator(arg, clonedEntityState);
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
        var /** @type {?} */ key = selectId(entity);
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
        var /** @type {?} */ didMutate = false;
        for (var /** @type {?} */ index in entities) {
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
        var /** @type {?} */ didMutate = keys
            .filter(function (key) { return key in state.entities; })
            .map(function (key) { return delete state.entities[key]; }).length > 0;
        if (didMutate) {
            state.ids = state.ids.filter(function (id) { return id in state.entities; });
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
        var /** @type {?} */ original = state.entities[update.id];
        var /** @type {?} */ updated = Object.assign({}, original, update.changes);
        var /** @type {?} */ newKey = selectId(updated);
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
        var /** @type {?} */ newKeys = {};
        var /** @type {?} */ didMutate = updates
            .filter(function (update) { return update.id in state.entities; })
            .map(function (update) { return takeNewKey(newKeys, update, state); }).length > 0;
        if (didMutate) {
            state.ids = state.ids.map(function (id) { return newKeys[id] || id; });
        }
        return didMutate;
    }
    return {
        removeAll: removeAll,
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
    var _a = createUnsortedStateAdapter(selectId), removeOne = _a.removeOne, removeMany = _a.removeMany, removeAll = _a.removeAll;
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
        var /** @type {?} */ models = newModels.filter(function (model) { return !(selectId(model) in state.entities); });
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
        var /** @type {?} */ original = state.entities[update.id];
        var /** @type {?} */ updated = Object.assign({}, original, update.changes);
        delete state.entities[update.id];
        models.push(updated);
    }
    /**
     * @param {?} updates
     * @param {?} state
     * @return {?}
     */
    function updateManyMutably(updates, state) {
        var /** @type {?} */ models = [];
        updates.forEach(function (update) { return takeUpdatedModel(models, update, state); });
        if (models.length) {
            state.ids = state.ids.filter(function (id) { return id in state.entities; });
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
        var /** @type {?} */ ids = [];
        var /** @type {?} */ i = 0;
        var /** @type {?} */ j = 0;
        while (i < models.length && j < state.ids.length) {
            var /** @type {?} */ model = models[i];
            var /** @type {?} */ modelId = selectId(model);
            var /** @type {?} */ entityId = state.ids[j];
            var /** @type {?} */ entity = state.entities[entityId];
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
        models.forEach(function (model, i) {
            state.entities[selectId(model)] = model;
        });
        return true;
    }
    return {
        removeOne: removeOne,
        removeMany: removeMany,
        removeAll: removeAll,
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
function createEntityAdapter(options) {
    if (options === void 0) { options = {}; }
    var _a = Object.assign({ sortComparer: false, selectId: function (instance) { return instance.id; } }, options), selectId = _a.selectId, sortComparer = _a.sortComparer;
    var /** @type {?} */ stateFactory = createInitialStateFactory();
    var /** @type {?} */ selectorsFactory = createSelectorsFactory();
    var /** @type {?} */ stateAdapter = sortComparer
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
//# sourceMappingURL=entity.es5.js.map
