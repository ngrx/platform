import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  url,
} from '@angular-devkit/schematics';
import {
  InsertChange,
  addImportToModule,
  buildRelativePath,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  parseName,
  stringUtils,
  addPackageToPackageJson,
  platformVersion,
} from '../../schematics-core';
import { Schema as EffectOptions } from './schema';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

function addImportToNgModule(options: EffectOptions): Rule {
  return (host: Tree) => {
    const modulePath = options.module;

    if (!modulePath) {
      return host;
    }

    if (!host.exists(modulePath)) {
      throw new Error(`Specified module path ${modulePath} does not exist`);
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

    const effectsName = `${stringUtils.classify(`${options.name}Effects`)}`;

    const effectsModuleImport = insertImport(
      source,
      modulePath,
      'EffectsModule',
      '@ngrx/effects'
    );

    const effectsPath =
      `/${options.path}/` +
      (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
      (options.group ? 'effects/' : '') +
      stringUtils.dasherize(options.name) +
      '.effects';
    const relativePath = buildRelativePath(modulePath, effectsPath);
    const effectsImport = insertImport(
      source,
      modulePath,
      effectsName,
      relativePath
    );

    const effectsSetup = options.minimal ? `[]` : `[${effectsName}]`;
    const [effectsNgModuleImport] = addImportToModule(
      source,
      modulePath,
      `EffectsModule.forRoot(${effectsSetup})`,
      relativePath
    );

    let changes = [effectsModuleImport, effectsNgModuleImport];

    if (!options.minimal) {
      changes = changes.concat([effectsImport]);
    }

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

function addNgRxEffectsToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/effects',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

export default function (options: EffectOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const parsedPath = parseName(options.path, options.name || '');
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      options.skipTests
        ? filter((path) => !path.endsWith('.spec.ts.template'))
        : noop(),
      options.minimal ? filter((_) => false) : noop(),
      applyTemplates({
        ...stringUtils,
        'if-flat': (s: string) =>
          stringUtils.group(
            options.flat ? '' : s,
            options.group ? 'effects' : ''
          ),
        ...(options as object),
      } as any),
      move(parsedPath.path),
    ]);

    return chain([
      branchAndMerge(
        chain([addImportToNgModule(options), mergeWith(templateSource)])
      ),
      options && options.skipPackageJson
        ? noop()
        : addNgRxEffectsToPackageJson(),
    ])(host, context);
  };
}
