/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
import { getActionLookupName, getActionType, getActionName, } from "../action-interface";
/**
 * @param {?} actions
 * @return {?}
 */
export function printTypeDictionaryDeclaration(actions) {
    const [firstAction] = actions;
    return ts.createTypeAliasDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], getActionLookupName(firstAction), undefined, ts.createTypeLiteralNode(actions.map(action => {
        return ts.createPropertySignature(undefined, JSON.stringify(getActionType(action)), undefined, ts.createTypeReferenceNode(getActionName(action), undefined), undefined);
    })));
}
//# sourceMappingURL=type-dictionary-declaration.js.map