/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
import { getActionName, getActionUnionName, } from "../action-interface";
/**
 * @param {?} actions
 * @return {?}
 */
export function printTypeUnionDeclaration(actions) {
    const [firstAction] = actions;
    return ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], getActionUnionName(firstAction), undefined, ts.createUnionTypeNode(actions
        .map(getActionName)
        .map(name => ts.createTypeReferenceNode(name, undefined))));
}
//# sourceMappingURL=type-union-declaration.js.map