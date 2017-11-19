import { readFile, writeFile } from 'fs';
import { parse, resolve } from 'path';
import { EmitHint, ModifierFlags, NewLineKind, ScriptKind, ScriptTarget, SyntaxKind, createBlock, createEnumDeclaration, createEnumMember, createFunctionDeclaration, createIdentifier, createImportClause, createImportDeclaration, createImportSpecifier, createLiteral, createNamedImports, createObjectLiteral, createParameter, createPrinter, createPropertyAccess, createPropertyAssignment, createPropertySignature, createReturn, createShorthandPropertyAssignment, createSourceFile, createToken, createTypeAliasDeclaration, createTypeLiteralNode, createTypeReferenceNode, createUnionTypeNode, getCombinedModifierFlags, isInterfaceDeclaration, isLiteralTypeNode, isPropertySignature } from 'typescript';
import { camelCase, flow, snakeCase, trim, upperFirst } from 'lodash';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} props
 * @return {?}
 */
function getOptionalProperties(props) {
    return props.filter(prop => prop.questionToken).map(prop => ({
        name: prop.name.getText(),
        required: false,
    }));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} node
 * @return {?}
 */
function getProperties(node) {
    return node.members.filter(isPropertySignature);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} props
 * @return {?}
 */
function getRequiredProperties(props) {
    return props
        .filter(prop => !prop.questionToken)
        .map(prop => ({
        name: prop.name.getText(),
        required: true,
    }))
        .filter(({ name }) => name !== 'type');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} action
 * @return {?}
 */
function getType(action) {
    const /** @type {?} */ typeProperty = getProperties(action).find(property => property.name.getText() === 'type');
    if (!typeProperty) {
        return undefined;
    }
    return isLiteralTypeNode(/** @type {?} */ (typeProperty.type))
        ? /** @type {?} */ (typeProperty.type) : undefined;
    // return !!typeProperty && ts.isLiteralTypeNode(typeProperty.type) ? typeProperty.type : undefined;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} statement
 * @return {?}
 */
function isActionDescendent(statement) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} node
 * @return {?}
 */
function hasExportModifier(node) {
    return (getCombinedModifierFlags(node) & ModifierFlags.Export) !== 0;
}
/**
 * @param {?} node
 * @return {?}
 */
function isTopLevel(node) {
    return !!node.parent && node.parent.kind === SyntaxKind.SourceFile;
}
/**
 * @param {?} node
 * @return {?}
 */
function isExported(node) {
    return hasExportModifier(node) && isTopLevel(node);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @record
 */

const actionTypeRegex = new RegExp(/\[(.*?)\](.*)/);
/**
 * @param {?} type
 * @return {?}
 */
function parseActionType(type) {
    const /** @type {?} */ result = actionTypeRegex.exec(type);
    if (result === null) {
        throw new Error(`Could not parse action type "${type}"`);
    }
    return {
        category: /** @type {?} */ (result[1]),
        name: /** @type {?} */ (result[2]),
    };
}
const getActionType = (enterface) => enterface.actionType;
const getActionName = (enterface) => enterface.name;
const getActionCategory = flow(getActionType, parseActionType, v => v.category);
const getActionCategoryToken = flow(getActionCategory, camelCase, upperFirst);
const getActionEnumName = flow(getActionCategoryToken, v => `${v}ActionType`);
const getActionEnumPropName = flow(getActionName, snakeCase, v => v.toUpperCase());
const getActionUnionName = flow(getActionCategoryToken, v => `${v}Actions`);
const getActionLookupName = flow(getActionCategoryToken, v => `${v}ActionLookup`);
const getActionFactoryName = flow(getActionName, camelCase, upperFirst, v => `create${v}`);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} action
 * @return {?}
 */
function printActionFactoryDeclaration(action) {
    return createFunctionDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], undefined, getActionFactoryName(action), undefined, action.properties.map(({ name, required }) => {
        return createParameter(undefined, undefined, undefined, name, required ? undefined : createToken(SyntaxKind.QuestionToken), createTypeReferenceNode(`${getActionName(action)}["${name}"]`, undefined), undefined);
    }), createTypeReferenceNode(getActionName(action), undefined), createBlock([
        createReturn(createObjectLiteral([
            createPropertyAssignment('type', createPropertyAccess(createIdentifier(getActionEnumName(action)), createIdentifier(getActionEnumPropName(action)))),
            ...action.properties.map(({ name }) => {
                return createShorthandPropertyAssignment(name, undefined);
            }),
        ])),
    ], true));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} actions
 * @return {?}
 */
function printEnumDeclaration(actions) {
    const [firstInterface] = actions;
    return createEnumDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], getActionEnumName(firstInterface), actions
        .map(action => ({
        prop: getActionEnumPropName(action),
        value: getActionType(action),
    }))
        .map(({ prop, value }) => {
        return createEnumMember(prop, createLiteral(value));
    }));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} filename
 * @param {?} actions
 * @return {?}
 */
function printImportDeclaration(filename, actions) {
    return createImportDeclaration(undefined, undefined, createImportClause(undefined, createNamedImports(actions
        .map(getActionName)
        .map(name => createImportSpecifier(undefined, createIdentifier(name))))), createIdentifier(`'./${filename}'`));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} actions
 * @return {?}
 */
function printTypeDictionaryDeclaration(actions) {
    const [firstAction] = actions;
    return createTypeAliasDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], getActionLookupName(firstAction), undefined, createTypeLiteralNode(actions.map(action => {
        return createPropertySignature(undefined, JSON.stringify(getActionType(action)), undefined, createTypeReferenceNode(getActionName(action), undefined), undefined);
    })));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} actions
 * @return {?}
 */
function printTypeUnionDeclaration(actions) {
    const [firstAction] = actions;
    return createTypeAliasDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], getActionUnionName(firstAction), undefined, createUnionTypeNode(actions
        .map(getActionName)
        .map(name => createTypeReferenceNode(name, undefined))));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @param {?} fileName
 * @param {?} sourceFile
 * @return {?}
 */
function collectMetadata(fileName, sourceFile) {
    const /** @type {?} */ interfaces = sourceFile.statements
        .filter(isInterfaceDeclaration)
        .filter(isExported)
        .filter(isActionDescendent)
        .filter(m => !!getType(m))
        .map((enterface) => ({
        name: enterface.name.getText(),
        actionType: trim(/** @type {?} */ ((getType(enterface))).literal.getFullText(), ' \'"`'),
        properties: [
            ...getRequiredProperties(getProperties(enterface)),
            ...getOptionalProperties(getProperties(enterface)),
        ],
    }));
    if (interfaces.length === 0) {
        undefined;
    }
    return [
        printImportDeclaration(fileName, interfaces),
        printEnumDeclaration(interfaces),
        printTypeUnionDeclaration(interfaces),
        printTypeDictionaryDeclaration(interfaces),
        ...interfaces.map(action => printActionFactoryDeclaration(action)),
    ];
}
/**
 * @param {?} ast
 * @return {?}
 */
function printActionFactory(ast) {
    const /** @type {?} */ resultFile = createSourceFile('', '', ScriptTarget.ES2015, false, ScriptKind.TS);
    const /** @type {?} */ printer = createPrinter({ newLine: NewLineKind.LineFeed });
    return ast
        .map(statement => printer.printNode(EmitHint.Unspecified, statement, resultFile))
        .join('\n\n');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const glob = require('glob');
/**
 * @param {?} globPattern
 * @return {?}
 */
function findFiles(globPattern) {
    return new Promise((resolve$$1, reject) => {
        glob(globPattern, { cwd: process.cwd(), ignore: ['**/node_modules/**'] }, (error, files) => {
            if (error) {
                return reject(error);
            }
            resolve$$1(files);
        });
    });
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve$$1, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve$$1(result.value) : new P(function (resolve$$1) { resolve$$1(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const ora = require('ora');
/**
 * @param {?} file
 * @return {?}
 */
function readFile$1(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve$$1, reject) => {
            readFile(file, 'utf8', (error, data) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve$$1(data);
                }
            });
        });
    });
}
/**
 * @param {?} file
 * @param {?} contents
 * @return {?}
 */
function writeFile$1(file, contents) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve$$1, reject) => {
            writeFile(file, contents, { encoding: 'utf8' }, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve$$1();
                }
            });
        });
    });
}
/**
 * @param {?} data
 * @return {?}
 */
function createSourceFile$1(data) {
    return createSourceFile('', data, ScriptTarget.ES2015, true);
}
/**
 * @param {?} glob
 * @return {?}
 */
function codegen(glob) {
    return __awaiter(this, void 0, void 0, function* () {
        const /** @type {?} */ filesIndicator = ora(`Searching for files matching "${glob}"`).start();
        const /** @type {?} */ files = yield findFiles(glob);
        filesIndicator.succeed(`Found ${files.length} files for pattern "${glob}"`);
        for (let /** @type {?} */ file of files) {
            const /** @type {?} */ indicator = ora(file).start();
            try {
                const /** @type {?} */ parsedPath = parse(file);
                const /** @type {?} */ contents = yield readFile$1(file);
                const /** @type {?} */ sourceFile = createSourceFile$1(contents);
                const /** @type {?} */ ast = collectMetadata(parsedPath.name, sourceFile);
                if (!ast) {
                    throw new Error(`No actions found for file "${file}"`);
                }
                const /** @type {?} */ output = printActionFactory(ast);
                const /** @type {?} */ target = resolve(parsedPath.dir, `./${parsedPath.name}.helpers.ts`);
                yield writeFile$1(target, output);
                indicator.succeed(`Found ${ast.length} actions in ${file}`);
            }
            catch (/** @type {?} */ e) {
                indicator.fail((/** @type {?} */ (e)).message);
            }
        }
    });
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { codegen };
//# sourceMappingURL=codegen.js.map
