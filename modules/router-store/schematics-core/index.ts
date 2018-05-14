import {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
} from './utility/strings';

export {
  findNodes,
  getSourceNodes,
  getDecoratorMetadata,
  getContentOfKeyLiteral,
  insertAfterLastOccurrence,
  addBootstrapToModule,
  addDeclarationToModule,
  addExportToModule,
  addImportToModule,
  addProviderToModule,
} from './utility/ast-utils';

export {
  Host,
  Change,
  NoopChange,
  InsertChange,
  RemoveChange,
  ReplaceChange,
} from './utility/change';

export {
  AppConfig,
  CliConfig,
  getAppFromConfig,
  getConfig,
  getWorkspace,
  getWorkspacePath,
} from './utility/config';

export {
  findModule,
  findModuleFromOptions,
  buildRelativePath,
  ModuleOptions,
} from './utility/find-module';

export {
  addReducerToState,
  addReducerToStateInferface,
  addReducerImportToNgModule,
  addReducerToActionReducerMap,
  omit,
} from './utility/ngrx-utils';

export { getProjectPath } from './utility/project';
export { insertImport } from './utility/route-utils';

export const stringUtils = {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
};

export { updatePackage } from './utility/update';

export { addPackageToPackageJson } from './utility/package';

export { platformVersion } from './utility/libs-version';
