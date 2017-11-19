/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
import { getActionName } from "../action-interface";
/**
 * @param {?} filename
 * @param {?} actions
 * @return {?}
 */
export function printImportDeclaration(filename, actions) {
    return ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports(actions
        .map(getActionName)
        .map(name => ts.createImportSpecifier(undefined, ts.createIdentifier(name))))), ts.createIdentifier(`'./${filename}'`));
}
//# sourceMappingURL=import-declaration.js.map