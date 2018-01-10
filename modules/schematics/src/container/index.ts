import { normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain,
  externalSchematic,
  apply,
  url,
  noop,
  filter,
  template,
  move,
  branchAndMerge,
  mergeWith,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as stringUtils from '../strings';
import { Schema as FeatureOptions } from './schema';
import { buildRelativePath } from '../utility/find-module';
import { NoopChange, InsertChange, ReplaceChange } from '../utility/change';
import { insertImport } from '../utility/route-utils';
import { omit } from '../utility/ngrx-utils';

function addStateToComponent(options: FeatureOptions) {
  return (host: Tree) => {
    if (!options.state && !options.stateInterface) {
      return host;
    }

    const statePath = `/${options.sourceDir}/${options.path}/${options.state}`;

    if (options.state) {
      if (!host.exists(statePath)) {
        throw new Error('Specified state path does not exist');
      }
    }

    const componentPath =
      `/${options.sourceDir}/${options.path}/` +
      (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
      stringUtils.dasherize(options.name) +
      '.component.ts';

    const text = host.read(componentPath);

    if (text === null) {
      throw new SchematicsException(`File ${componentPath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      componentPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    const stateImportPath = buildRelativePath(componentPath, statePath);
    const stateImport = options.state
      ? insertImport(
          source,
          componentPath,
          `* as fromStore`,
          stateImportPath,
          true
        )
      : new NoopChange();

    const componentClass = source.statements.find(
      stm => stm.kind === ts.SyntaxKind.ClassDeclaration
    );
    const component = componentClass as ts.ClassDeclaration;
    const componentConstructor = component.members.find(
      member => member.kind === ts.SyntaxKind.Constructor
    );
    const cmpCtr = componentConstructor as ts.ConstructorDeclaration;
    const { pos } = cmpCtr;
    const stateType = options.state
      ? `fromStore.${options.stateInterface}`
      : 'any';
    const constructorText = cmpCtr.getText();
    const [start, end] = constructorText.split('()');
    const storeText = `private store: Store<${stateType}>`;
    const storeConstructor = [start, `(${storeText})`, end].join('');
    const constructorUpdate = new ReplaceChange(
      componentPath,
      pos,
      `  ${constructorText}`,
      `\n\n  ${storeConstructor}`
    );

    const changes = [stateImport, constructorUpdate];
    const recorder = host.beginUpdate(componentPath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      } else if (change instanceof ReplaceChange) {
        recorder.remove(pos, change.oldText.length);
        recorder.insertLeft(change.order, change.newText);
      }
    }

    host.commitUpdate(recorder);

    return host;
  };
}

export default function(options: FeatureOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const sourceDir = options.sourceDir;

    if (!sourceDir) {
      throw new SchematicsException(`sourceDir option is required.`);
    }

    const opts = ['state', 'stateInterface'].reduce((current, key) => {
      return omit(current, key as any);
    }, options);

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('__spec.ts')),
      template({
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...stringUtils,
        ...(options as object),
        dot: () => '.',
      }),
      move(sourceDir),
    ]);

    return chain([
      externalSchematic('@schematics/angular', 'component', {
        ...opts,
        spec: false,
      }),
      addStateToComponent(options),
      mergeWith(templateSource),
    ])(host, context);
  };
}
