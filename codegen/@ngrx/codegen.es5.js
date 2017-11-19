var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    return props.filter(function (prop) { return prop.questionToken; }).map(function (prop) { return ({
        name: prop.name.getText(),
        required: false,
    }); });
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
        .filter(function (prop) { return !prop.questionToken; })
        .map(function (prop) { return ({
        name: prop.name.getText(),
        required: true,
    }); })
        .filter(function (_a) {
        var name = _a.name;
        return name !== 'type';
    });
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
    var /** @type {?} */ typeProperty = getProperties(action).find(function (property) { return property.name.getText() === 'type'; });
    if (!typeProperty) {
        return undefined;
    }
    return isLiteralTypeNode(/** @type {?} */ (typeProperty.type))
        ? (typeProperty.type) : undefined;
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
    var /** @type {?} */ heritageClauses = statement.heritageClauses;
    if (heritageClauses) {
        return heritageClauses.some(function (clause) {
            /**
                   * TODO: This breaks if the interface looks like this:
                   *
                   *   interface MyAction extends ngrx.Action { }
                   *
                   */
            return clause.types.some(function (type) { return type.expression.getText() === 'Action'; });
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
var actionTypeRegex = new RegExp(/\[(.*?)\](.*)/);
/**
 * @param {?} type
 * @return {?}
 */
function parseActionType(type) {
    var /** @type {?} */ result = actionTypeRegex.exec(type);
    if (result === null) {
        throw new Error("Could not parse action type \"" + type + "\"");
    }
    return {
        category: /** @type {?} */ (result[1]),
        name: /** @type {?} */ (result[2]),
    };
}
var getActionType = function (enterface) { return enterface.actionType; };
var getActionName = function (enterface) { return enterface.name; };
var getActionCategory = flow(getActionType, parseActionType, function (v) { return v.category; });
var getActionCategoryToken = flow(getActionCategory, camelCase, upperFirst);
var getActionEnumName = flow(getActionCategoryToken, function (v) { return v + "ActionType"; });
var getActionEnumPropName = flow(getActionName, snakeCase, function (v) { return v.toUpperCase(); });
var getActionUnionName = flow(getActionCategoryToken, function (v) { return v + "Actions"; });
var getActionLookupName = flow(getActionCategoryToken, function (v) { return v + "ActionLookup"; });
var getActionFactoryName = flow(getActionName, camelCase, upperFirst, function (v) { return "create" + v; });
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} action
 * @return {?}
 */
function printActionFactoryDeclaration(action) {
    return createFunctionDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], undefined, getActionFactoryName(action), undefined, action.properties.map(function (_a) {
        var name = _a.name, required = _a.required;
        return createParameter(undefined, undefined, undefined, name, required ? undefined : createToken(SyntaxKind.QuestionToken), createTypeReferenceNode(getActionName(action) + "[\"" + name + "\"]", undefined), undefined);
    }), createTypeReferenceNode(getActionName(action), undefined), createBlock([
        createReturn(createObjectLiteral([
            createPropertyAssignment('type', createPropertyAccess(createIdentifier(getActionEnumName(action)), createIdentifier(getActionEnumPropName(action))))
        ].concat(action.properties.map(function (_a) {
            var name = _a.name;
            return createShorthandPropertyAssignment(name, undefined);
        })))),
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
    var firstInterface = actions[0];
    return createEnumDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], getActionEnumName(firstInterface), actions
        .map(function (action) { return ({
        prop: getActionEnumPropName(action),
        value: getActionType(action),
    }); })
        .map(function (_a) {
        var prop = _a.prop, value = _a.value;
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
        .map(function (name) { return createImportSpecifier(undefined, createIdentifier(name)); }))), createIdentifier("'./" + filename + "'"));
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
    var firstAction = actions[0];
    return createTypeAliasDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], getActionLookupName(firstAction), undefined, createTypeLiteralNode(actions.map(function (action) {
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
    var firstAction = actions[0];
    return createTypeAliasDeclaration(undefined, [createToken(SyntaxKind.ExportKeyword)], getActionUnionName(firstAction), undefined, createUnionTypeNode(actions
        .map(getActionName)
        .map(function (name) { return createTypeReferenceNode(name, undefined); })));
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
    var /** @type {?} */ interfaces = sourceFile.statements
        .filter(isInterfaceDeclaration)
        .filter(isExported)
        .filter(isActionDescendent)
        .filter(function (m) { return !!getType(m); })
        .map(function (enterface) { return ({
        name: enterface.name.getText(),
        actionType: trim(/** @type {?} */ ((getType(enterface))).literal.getFullText(), ' \'"`'),
        properties: getRequiredProperties(getProperties(enterface)).concat(getOptionalProperties(getProperties(enterface))),
    }); });
    if (interfaces.length === 0) {
        undefined;
    }
    return [
        printImportDeclaration(fileName, interfaces),
        printEnumDeclaration(interfaces),
        printTypeUnionDeclaration(interfaces),
        printTypeDictionaryDeclaration(interfaces)
    ].concat(interfaces.map(function (action) { return printActionFactoryDeclaration(action); }));
}
/**
 * @param {?} ast
 * @return {?}
 */
function printActionFactory(ast) {
    var /** @type {?} */ resultFile = createSourceFile('', '', ScriptTarget.ES2015, false, ScriptKind.TS);
    var /** @type {?} */ printer = createPrinter({ newLine: NewLineKind.LineFeed });
    return ast
        .map(function (statement) { return printer.printNode(EmitHint.Unspecified, statement, resultFile); })
        .join('\n\n');
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var glob = require('glob');
/**
 * @param {?} globPattern
 * @return {?}
 */
function findFiles(globPattern) {
    return new Promise(function (resolve$$1, reject) {
        glob(globPattern, { cwd: process.cwd(), ignore: ['**/node_modules/**'] }, function (error, files) {
            if (error) {
                return reject(error);
            }
            resolve$$1(files);
        });
    });
}
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve$$1, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve$$1(result.value) : new P(function (resolve$$1) { resolve$$1(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ora = require('ora');
/**
 * @param {?} file
 * @return {?}
 */
function readFile$1(file) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve$$1, reject) {
                    readFile(file, 'utf8', function (error, data) {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve$$1(data);
                        }
                    });
                })];
        });
    });
}
/**
 * @param {?} file
 * @param {?} contents
 * @return {?}
 */
function writeFile$1(file, contents) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve$$1, reject) {
                    writeFile(file, contents, { encoding: 'utf8' }, function (error) {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve$$1();
                        }
                    });
                })];
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
    return __awaiter(this, void 0, void 0, function () {
        var filesIndicator, files, _i, files_1, file, indicator, parsedPath, contents, sourceFile, ast, output, target, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filesIndicator = ora("Searching for files matching \"" + glob + "\"").start();
                    return [4 /*yield*/, findFiles(glob)];
                case 1:
                    files = _a.sent();
                    filesIndicator.succeed("Found " + files.length + " files for pattern \"" + glob + "\"");
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 8];
                    file = files_1[_i];
                    indicator = ora(file).start();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    parsedPath = parse(file);
                    return [4 /*yield*/, readFile$1(file)];
                case 4:
                    contents = _a.sent();
                    sourceFile = createSourceFile$1(contents);
                    ast = collectMetadata(parsedPath.name, sourceFile);
                    if (!ast) {
                        throw new Error("No actions found for file \"" + file + "\"");
                    }
                    output = printActionFactory(ast);
                    target = resolve(parsedPath.dir, "./" + parsedPath.name + ".helpers.ts");
                    return [4 /*yield*/, writeFile$1(target, output)];
                case 5:
                    _a.sent();
                    indicator.succeed("Found " + ast.length + " actions in " + file);
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    indicator.fail(((e_1)).message);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/];
            }
        });
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
//# sourceMappingURL=codegen.es5.js.map
