import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
  SchematicsException,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageToPackageJson,
  platformVersion,
  findModuleFromOptions,
  insertImport,
  InsertChange,
  getProjectPath,
  parseName,
  addImportToModule,
} from '@ngrx/data/schematics-core';
import { Schema as EntityDataOptions } from './schema';

function addNgRxDataToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/data',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function addEntityDataToNgModule(options: EntityDataOptions): Rule {
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

    const moduleToImport = options.withoutEffects
      ? 'EntityDataModuleWithoutEffects'
      : 'EntityDataModule';
    const effectsModuleImport = insertImport(
      source,
      modulePath,
      moduleToImport,
      '@ngrx/data'
    );

    const [dateEntityNgModuleImport] = addImportToModule(
      source,
      modulePath,
      moduleToImport,
      ''
    );

    const changes = [effectsModuleImport, dateEntityNgModuleImport];
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

export default function(options: EntityDataOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    (options as any).name = '';
    options.path = getProjectPath(host, options);

    if (options.module) {
      options.module = findModuleFromOptions(host, options as any);
    }

    const parsedPath = parseName(options.path, '');
    options.path = parsedPath.path;

    return chain([
      options && options.skipPackageJson ? noop() : addNgRxDataToPackageJson(),
      addEntityDataToNgModule(options),
    ])(host, context);
  };
}
