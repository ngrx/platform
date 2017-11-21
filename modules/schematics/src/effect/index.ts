import { normalize } from '@angular-devkit/core';
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
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';
import 'rxjs/add/operator/merge';
import * as ts from 'typescript';
import * as stringUtils from '../strings';
import { addProviderToModule, addImportToModule } from '../utility/ast-utils';
import { InsertChange } from '../utility/change';
import {
  buildRelativePath,
  findModuleFromOptions,
} from '../utility/find-module';
import { Schema as EffectOptions } from './schema';
import { insertImport } from '../utility/route-utils';

function addImportToNgModule(options: EffectOptions): Rule {
  return (host: Tree) => {
    if (!options.module) {
      return host;
    }

    const modulePath = options.module;
    if (!host.exists(options.module)) {
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

    const effectsName = `${stringUtils.classify(`${options.name}Effects`)}`;

    const effectsModuleImport = insertImport(
      source,
      modulePath,
      'EffectsModule',
      '@ngrx/effects'
    );

    const effectsPath =
      `/${options.sourceDir}/${options.path}/` +
      (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
      stringUtils.dasherize(options.name) +
      '.effects';
    const relativePath = buildRelativePath(modulePath, effectsPath);
    const effectsImport = insertImport(
      source,
      modulePath,
      effectsName,
      relativePath
    );
    const [effectsNgModuleImport] = addImportToModule(
      source,
      modulePath,
      options.root
        ? `EffectsModule.forRoot([${effectsName}])`
        : `EffectsModule.forFeature([${effectsName}])`,
      relativePath
    );
    const changes = [effectsModuleImport, effectsImport, effectsNgModuleImport];
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

export default function(options: EffectOptions): Rule {
  options.path = options.path ? normalize(options.path) : options.path;
  const sourceDir = options.sourceDir;
  if (!sourceDir) {
    throw new SchematicsException(`sourceDir option is required.`);
  }

  return (host: Tree, context: SchematicContext) => {
    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('__spec.ts')),
      template({
        ...stringUtils,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...(options as object),
        dot: () => '.',
      }),
      move(sourceDir),
    ]);

    return chain([
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
