/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} statement
 * @return {?}
 */
export function isActionDescendent(statement) {
    const /** @type {?} */ heritageClauses = statement.heritageClauses;
    if (heritageClauses) {
        return heritageClauses.some(clause => {
            /**
                   * TODO: This breaks if the interface looks like this:
                   *
                   *   interface MyAction extends ngrx.Action { }
                   *
                   */
            return clause.types.some(type => type.expression.getText() === 'Action');
        });
    }
    return false;
}
//# sourceMappingURL=is-action-descendent.js.map