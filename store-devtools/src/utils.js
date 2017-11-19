/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as Actions from "./actions";
/**
 * @param {?} first
 * @param {?} second
 * @return {?}
 */
export function difference(first, second) {
    return first.filter(item => second.indexOf(item) < 0);
}
/**
 * Provides an app's view into the state of the lifted store.
 * @param {?} liftedState
 * @return {?}
 */
export function unliftState(liftedState) {
    const { computedStates, currentStateIndex } = liftedState;
    const { state } = computedStates[currentStateIndex];
    return state;
}
/**
 * @param {?} liftedState
 * @return {?}
 */
export function unliftAction(liftedState) {
    return liftedState.actionsById[liftedState.nextActionId - 1];
}
/**
 * Lifts an app's action into an action on the lifted store.
 * @param {?} action
 * @return {?}
 */
export function liftAction(action) {
    return new Actions.PerformAction(action);
}
/**
 * @param {?} input$
 * @param {?} operators
 * @return {?}
 */
export function applyOperators(input$, operators) {
    return operators.reduce((source$, [operator, ...args]) => {
        return operator.apply(source$, args);
    }, input$);
}
//# sourceMappingURL=utils.js.map