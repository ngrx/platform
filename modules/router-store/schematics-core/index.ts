import {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
  pluralize,
} from './utility/strings';

export {
  findNodes,
  getSourceNodes,
  getDecoratorMetadata,
  getContentOfKeyLiteral,
  insertAfterLastOccurrence,
  insertImport,
  addBootstrapToModule,
  addDeclarationToModule,
  addExportToModule,
  addImportToModule,
  addProviderToComponent,
  addProviderToModule,
  replaceImport,
  containsProperty,
} from './utility/ast-utils';

export {
  Host,
  Change,
  NoopChange,
  InsertChange,
  RemoveChange,
  ReplaceChange,
  createReplaceChange,
  createChangeRecorder,
  commitChanges,
} from './utility/change';

export { AppConfig, getWorkspace, getWorkspacePath } from './utility/config';

export { findComponentFromOptions } from './utility/find-component';

export {
  findModule,
  findModuleFromOptions,
  buildRelativePath,
  ModuleOptions,
} from './utility/find-module';

export { findPropertyInAstObject } from './utility/json-utilts';

export {
  addReducerToState,
  addReducerToStateInterface,
  addReducerImportToNgModule,
  addReducerToActionReducerMap,
  omit,
  getPrefix,
} from './utility/ngrx-utils';

export { getProjectPath, getProject, isLib } from './utility/project';

export const stringUtils = {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
  pluralize,
};

export { updatePackage } from './utility/update';

export { parseName } from './utility/parse-name';

export { addPackageToPackageJson } from './utility/package';

export { platformVersion } from './utility/libs-version';

export {
  visitTSSourceFiles,
  visitNgModuleImports,
  visitNgModuleExports,
  visitComponents,
  visitDecorator,
  visitNgModules,
  visitTemplates,
} from './utility/visitors';
