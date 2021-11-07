"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
let compilerSetup;
let ts;
function getCompilerSetup(rootDir) {
    const tsConfigPath = ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.spec.json') ||
        ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.test.json') ||
        ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.jest.json');
    if (!tsConfigPath) {
        console.error(`Cannot locate a tsconfig.spec.json. Please create one at ${rootDir}/tsconfig.spec.json`);
    }
    const readResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    const config = ts.parseJsonConfigFileContent(readResult.config, ts.sys, path_1.dirname(tsConfigPath));
    const compilerOptions = config.options;
    const host = ts.createCompilerHost(compilerOptions, true);
    return { compilerOptions, host };
}
module.exports = function (path, options) {
    const ext = path_1.extname(path);
    if (ext === '.css' ||
        ext === '.scss' ||
        ext === '.sass' ||
        ext === '.less' ||
        ext === '.styl') {
        return require.resolve('identity-obj-proxy');
    }
    // Try to use the defaultResolver
    try {
        return   options.defaultResolver(path, {
            ...options,
            packageFilter: (pkg) => ({
              ...pkg,
              main: pkg.main || pkg.es2015 || pkg.module,
            }),
          });
        
    }
    catch (e) {
        if (path === 'jest-sequencer-@jest/test-sequencer' ||
            path === '@jest/test-sequencer') {
            return;
        }
        // Fallback to using typescript
        ts = ts || require('typescript');
        compilerSetup = compilerSetup || getCompilerSetup(options.rootDir);
        const { compilerOptions, host } = compilerSetup;
        return ts.resolveModuleName(path, options.basedir, compilerOptions, host)
            .resolvedModule.resolvedFileName;
    }
};
//# sourceMappingURL=resolver.js.map