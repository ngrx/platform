import * as tasks from './tasks';
import { createBuilder } from './util';

export default createBuilder([
  ['Removing "./dist" Folder', tasks.removeDistFolder],
  ['Compiling packages with NGC', tasks.compilePackagesWithNgc],
  ['Bundling FESMs', tasks.bundleFesms],
  ['Down-leveling FESMs to ES5', tasks.downLevelFesmsToES5],
  ['Creating UMD Bundles', tasks.createUmdBundles],
  ['Renaming package entry files', tasks.renamePackageEntryFiles],
  ['Cleaning TypeScript files', tasks.cleanTypeScriptFiles],
  ['Removing remaining sourcemap files', tasks.removeRemainingSourceMapFiles],
  ['Copying type definition files', tasks.copyTypeDefinitionFiles],
  ['Minifying UMD bundles', tasks.minifyUmdBundles],
  ['Copying documents', tasks.copyDocs],
  ['Copying package.json files', tasks.copyPackageJsonFiles],
  ['Removing "./dist/packages" Folder', tasks.removePackagesFolder],
]);
