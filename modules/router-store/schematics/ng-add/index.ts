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
import * as ts from 'typescript';
import {
  InsertChange,
  addImportToModule,
  addPackageToPackageJson,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  parseName,
  platformVersion,
} from '../../schematics-core';
import { Schema as RouterStoreOptions } from './schema';

function addImportToNgModule(options: RouterStoreOptions): Rule {
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

    const [routerStoreNgModuleImport] = addImportToModule(
      source,
      modulePath,
      `StoreRouterConnectingModule.forRoot()`,
      `@ngrx/router-store`
    );

    const changes = [
      insertImport(
        source,
        modulePath,
        'StoreRouterConnectingModule',
        '@ngrx/router-store'
      ),
      routerStoreNgModuleImport,
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

function addNgRxRouterStoreToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/router-store',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

export default function (options: RouterStoreOptions): Rule {
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

    return chain([
      branchAndMerge(chain([addImportToNgModule(options)])),
      options && options.skipPackageJson
        ? noop()
        : addNgRxRouterStoreToPackageJson(),
    ])(host, context);
  };
}
