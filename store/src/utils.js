/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} reducers
 * @param {?=} initialState
 * @return {?}
 */
export function combineReducers(reducers, initialState = {}) {
    const /** @type {?} */ reducerKeys = Object.keys(reducers);
    const /** @type {?} */ finalReducers = {};
    for (let /** @type {?} */ i = 0; i < reducerKeys.length; i++) {
        const /** @type {?} */ key = reducerKeys[i];
        if (typeof reducers[key] === 'function') {
            finalReducers[key] = reducers[key];
        }
    }
    const /** @type {?} */ finalReducerKeys = Object.keys(finalReducers);
    return function combination(state, action) {
        state = state || initialState;
        let /** @type {?} */ hasChanged = false;
        const /** @type {?} */ nextState = {};
        for (let /** @type {?} */ i = 0; i < finalReducerKeys.length; i++) {
            const /** @type {?} */ key = finalReducerKeys[i];
            const /** @type {?} */ reducer = finalReducers[key];
            const /** @type {?} */ previousStateForKey = state[key];
            const /** @type {?} */ nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
    };
}
/**
 * @template T
 * @param {?} object
 * @param {?} keyToRemove
 * @return {?}
 */
export function omit(object, keyToRemove) {
    return Object.keys(object)
        .filter(key => key !== keyToRemove)
        .reduce((result, key) => Object.assign(result, { [key]: object[key] }), {});
}
/**
 * @param {...?} functions
 * @return {?}
 */
export function compose(...functions) {
    return function (arg) {
        if (functions.length === 0) {
            return arg;
        }
        const /** @type {?} */ last = functions[functions.length - 1];
        const /** @type {?} */ rest = functions.slice(0, -1);
        return rest.reduceRight((composed, fn) => fn(composed), last(arg));
    };
}
/**
 * @template T, V
 * @param {?} reducerFactory
 * @param {?=} metaReducers
 * @return {?}
 */
export function createReducerFactory(reducerFactory, metaReducers) {
    if (Array.isArray(metaReducers) && metaReducers.length > 0) {
        return compose.apply(null, [...metaReducers, reducerFactory]);
    }
    return reducerFactory;
}
//# sourceMappingURL=utils.js.map