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
  insertImport,
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
  createReplaceChange,
  createChangeRecorder,
} from './utility/change';

export { AppConfig, getWorkspace, getWorkspacePath } from './utility/config';

export {
  findModule,
  findModuleFromOptions,
  buildRelativePath,
  ModuleOptions,
} from './utility/find-module';

export {
  addReducerToState,
  addReducerToStateInterface,
  addReducerImportToNgModule,
  addReducerToActionReducerMap,
  omit,
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
};

export { updatePackage } from './utility/update';

export { parseName } from './utility/parse-name';

export { addPackageToPackageJson } from './utility/package';

export { platformVersion } from './utility/libs-version';
