import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  template,
  url,
  noop,
  move,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  InsertChange,
  addImportToModule,
  buildRelativePath,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  stringUtils,
  addPackageToPackageJson,
  platformVersion,
  parseName,
} from '@ngrx/store/schematics-core';
import { Path, dirname } from '@angular-devkit/core';
import * as ts from 'typescript';
import { Schema as RootStoreOptions } from './schema';

function addImportToNgModule(options: RootStoreOptions): Rule {
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

    const statePath = `${options.path}/${options.statePath}`;
    const relativePath = buildRelativePath(modulePath, statePath);
    const srcPath = dirname(options.path as Path);
    const environmentsPath = buildRelativePath(
      statePath,
      `/${srcPath}/environments/environment`
    );

    const changes = [
      insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
      insertImport(source, modulePath, 'reducers, metaReducers', relativePath),
      addImportToModule(
        source,
        modulePath,
        'StoreModule.forRoot(reducers, { metaReducers })',
        relativePath
      ),
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

function addNgRxStoreToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/store',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

export default function(options: RootStoreOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const statePath = `/${options.path}/${options.statePath}/index.ts`;
    const srcPath = dirname(options.path as Path);
    const environmentsPath = buildRelativePath(
      statePath,
      `/${srcPath}/environments/environment`
    );

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    if (options.stateInterface && options.stateInterface !== 'State') {
      options.stateInterface = stringUtils.classify(options.stateInterface);
    }

    const templateSource = apply(url('./files'), [
      template({
        ...stringUtils,
        ...(options as object),
        environmentsPath,
      } as any),
      move(parsedPath.path),
    ]);

    return chain([
      options && options.skipPackageJson ? noop() : addNgRxStoreToPackageJson(),
      branchAndMerge(
        chain([
          filter(
            path =>
              path.endsWith('.module.ts') &&
              !path.endsWith('-routing.module.ts')
          ),
          addImportToNgModule(options),
          mergeWith(templateSource),
        ])
      ),
    ])(host, context);
  };
}
