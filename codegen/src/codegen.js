var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { collectMetadata, printActionFactory } from "./collect-metadata";
import { findFiles } from "./find-files";
const /** @type {?} */ ora = require('ora');
/**
 * @param {?} file
 * @return {?}
 */
function readFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (error, data) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data);
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
function writeFile(file, contents) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, contents, { encoding: 'utf8' }, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
/**
 * @param {?} data
 * @return {?}
 */
function createSourceFile(data) {
    return ts.createSourceFile('', data, ts.ScriptTarget.ES2015, true);
}
/**
 * @param {?} glob
 * @return {?}
 */
export function codegen(glob) {
    return __awaiter(this, void 0, void 0, function* () {
        const /** @type {?} */ filesIndicator = ora(`Searching for files matching "${glob}"`).start();
        const /** @type {?} */ files = yield findFiles(glob);
        filesIndicator.succeed(`Found ${files.length} files for pattern "${glob}"`);
        for (let /** @type {?} */ file of files) {
            const /** @type {?} */ indicator = ora(file).start();
            try {
                const /** @type {?} */ parsedPath = path.parse(file);
                const /** @type {?} */ contents = yield readFile(file);
                const /** @type {?} */ sourceFile = createSourceFile(contents);
                const /** @type {?} */ ast = collectMetadata(parsedPath.name, sourceFile);
                if (!ast) {
                    throw new Error(`No actions found for file "${file}"`);
                }
                const /** @type {?} */ output = printActionFactory(ast);
                const /** @type {?} */ target = path.resolve(parsedPath.dir, `./${parsedPath.name}.helpers.ts`);
                yield writeFile(target, output);
                indicator.succeed(`Found ${ast.length} actions in ${file}`);
            }
            catch (/** @type {?} */ e) {
                indicator.fail((/** @type {?} */ (e)).message);
            }
        }
    });
}
//# sourceMappingURL=codegen.js.map