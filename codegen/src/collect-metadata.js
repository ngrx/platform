/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as ts from "typescript";
import * as _ from "lodash";
import * as collector from "./metadata/index";
import * as printers from "./printers/index";
/**
 * @record
 */
export function ActionMetadata() { }
function ActionMetadata_tsickle_Closure_declarations() {
    /** @type {?} */
    ActionMetadata.prototype.name;
    /** @type {?} */
    ActionMetadata.prototype.type;
    /** @type {?} */
    ActionMetadata.prototype.properties;
}
/**
 * @param {?} fileName
 * @param {?} sourceFile
 * @return {?}
 */
export function collectMetadata(fileName, sourceFile) {
    const /** @type {?} */ interfaces = sourceFile.statements
        .filter(ts.isInterfaceDeclaration)
        .filter(collector.isExported)
        .filter(collector.isActionDescendent)
        .filter(m => !!collector.getType(m))
        .map((enterface) => ({
        name: enterface.name.getText(),
        actionType: _.trim(/** @type {?} */ ((collector.getType(enterface))).literal.getFullText(), ' \'"`'),
        properties: [
            ...collector.getRequiredProperties(collector.getProperties(enterface)),
            ...collector.getOptionalProperties(collector.getProperties(enterface)),
        ],
    }));
    if (interfaces.length === 0) {
        undefined;
    }
    return [
        printers.printImportDeclaration(fileName, interfaces),
        printers.printEnumDeclaration(interfaces),
        printers.printTypeUnionDeclaration(interfaces),
        printers.printTypeDictionaryDeclaration(interfaces),
        ...interfaces.map(action => printers.printActionFactoryDeclaration(action)),
    ];
}
/**
 * @param {?} ast
 * @return {?}
 */
export function printActionFactory(ast) {
    const /** @type {?} */ resultFile = ts.createSourceFile('', '', ts.ScriptTarget.ES2015, false, ts.ScriptKind.TS);
    const /** @type {?} */ printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    return ast
        .map(statement => printer.printNode(ts.EmitHint.Unspecified, statement, resultFile))
        .join('\n\n');
}
//# sourceMappingURL=collect-metadata.js.map