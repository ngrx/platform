/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ glob = require('glob');
/**
 * @param {?} globPattern
 * @return {?}
 */
export function findFiles(globPattern) {
    return new Promise((resolve, reject) => {
        glob(globPattern, { cwd: process.cwd(), ignore: ['**/node_modules/**'] }, (error, files) => {
            if (error) {
                return reject(error);
            }
            resolve(files);
        });
    });
}
//# sourceMappingURL=find-files.js.map