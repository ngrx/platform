/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
/**
 * @param {?} node
 * @return {?}
 */
export function getProperties(node) {
    return node.members.filter(ts.isPropertySignature);
}
//# sourceMappingURL=get-properties.js.map