/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
/**
 * @param {?} node
 * @return {?}
 */
function hasExportModifier(node) {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}
/**
 * @param {?} node
 * @return {?}
 */
function isTopLevel(node) {
    return !!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile;
}
/**
 * @param {?} node
 * @return {?}
 */
export function isExported(node) {
    return hasExportModifier(node) && isTopLevel(node);
}
//# sourceMappingURL=is-exported.js.map