/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
import { getActionEnumName, getActionEnumPropName, getActionType, } from "../action-interface";
/**
 * @param {?} actions
 * @return {?}
 */
export function printEnumDeclaration(actions) {
    const [firstInterface] = actions;
    return ts.createEnumDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], getActionEnumName(firstInterface), actions
        .map(action => ({
        prop: getActionEnumPropName(action),
        value: getActionType(action),
    }))
        .map(({ prop, value }) => {
        return ts.createEnumMember(prop, ts.createLiteral(value));
    }));
}
//# sourceMappingURL=enum-declaration.js.map