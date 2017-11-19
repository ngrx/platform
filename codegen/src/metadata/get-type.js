/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
import { getProperties } from "./get-properties";
/**
 * @param {?} action
 * @return {?}
 */
export function getType(action) {
    const /** @type {?} */ typeProperty = getProperties(action).find(property => property.name.getText() === 'type');
    if (!typeProperty) {
        return undefined;
    }
    return ts.isLiteralTypeNode(/** @type {?} */ (typeProperty.type))
        ? /** @type {?} */ (typeProperty.type) : undefined;
    // return !!typeProperty && ts.isLiteralTypeNode(typeProperty.type) ? typeProperty.type : undefined;
}
//# sourceMappingURL=get-type.js.map