import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  branchAndMerge,
  chain,
  noop,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  InsertChange,
  addImportToModule,
  buildRelativePath,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  addPackageToPackageJson,
  platformVersion,
  parseName,
} from '../../schematics-core';
import { Path, dirname } from '@angular-devkit/core';
import { Schema as StoreDevtoolsOptions } from './schema';

function addImportToNgModule(options: StoreDevtoolsOptions): Rule {
  return (host: Tree) => {
    const modulePath = options.module;

    if (!modulePath) {
      return host;
    }

    if (!host.exists(modulePath)) {
      throw new Error('Specified module does not exist');
    }

    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      modulePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    const [instrumentNgModuleImport] = addImportToModule(
      source,
      modulePath,
      `StoreDevtoolsModule.instrument({ maxAge: ${options.maxAge}, logOnly: environment.production })`,
      modulePath
    );

    const srcPath = dirname(options.path as Path);
    const environmentsPath = buildRelativePath(
      modulePath,
      `/${srcPath}/environments/environment`
    );

    const changes = [
      insertImport(
        source,
        modulePath,
        'StoreDevtoolsModule',
        '@ngrx/store-devtools'
      ),
      insertImport(source, modulePath, 'environment', environmentsPath),
      instrumentNgModuleImport,
    ];
    const recorder = host.beginUpdate(modulePath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

function addNgRxStoreDevToolsToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/store-devtools',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

export default function (options: StoreDevtoolsOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    if (options.module) {
      options.module = findModuleFromOptions(host, {
        name: '',
        module: options.module,
        path: options.path,
      });
    }

    const parsedPath = parseName(options.path, '');
    options.path = parsedPath.path;

    if (options.maxAge && (options.maxAge < 0 || options.maxAge === 1)) {
      throw new SchematicsException(
        `maxAge should be an integer greater than 1.`
      );
    }

    return chain([
      branchAndMerge(chain([addImportToNgModule(options)])),
      options && options.skipPackageJson
        ? noop()
        : addNgRxStoreDevToolsToPackageJson(),
    ])(host, context);
  };
}
