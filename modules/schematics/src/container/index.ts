import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain,
  externalSchematic,
  apply,
  applyTemplates,
  url,
  noop,
  filter,
  move,
  mergeWith,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import {
  stringUtils,
  buildRelativePath,
  insertImport,
  NoopChange,
  ReplaceChange,
  InsertChange,
  getProjectPath,
  omit,
  parseName,
} from '../../schematics-core';
import { Schema as ContainerOptions } from './schema';

function addStateToComponent(options: Partial<ContainerOptions>) {
  return (host: Tree) => {
    if (!options.state && !options.stateInterface) {
      return host;
    }

    const statePath = `/${options.path}/${options.state}`;

    if (options.state) {
      if (!host.exists(statePath)) {
        throw new Error(`The Specified state path ${statePath} does not exist`);
      }
    }

    let componentPath =
      `/${options.path}/` +
      (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
      stringUtils.dasherize(options.name) +
      '.component.ts';

    if (!host.exists(componentPath)) {
      componentPath =
        `/${options.path}/` +
        (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
        stringUtils.dasherize(options.name) +
        '.ts';
      if (!host.exists(componentPath)) {
        throw new SchematicsException(`File ${componentPath} does not exist.`);
      }
    }

    const text = host.read(componentPath);
    if (text === null) {
      throw new SchematicsException(
        `File content ${componentPath} does not exist.`
      );
    }

    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      componentPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    const stateImportPath = buildRelativePath(componentPath, statePath);
    const storeImport = insertImport(
      source,
      componentPath,
      'Store',
      '@ngrx/store'
    );
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
      (stm) => stm.kind === ts.SyntaxKind.ClassDeclaration
    ) as ts.ClassDeclaration;
    const constructorUpdate = new ReplaceChange(
      componentPath,
      componentClass.members.pos,
      '\n',
      `\n  constructor(private store: Store) {}`
    );

    const changes = [storeImport, stateImport, constructorUpdate];
    const recorder = host.beginUpdate(componentPath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      } else if (change instanceof ReplaceChange) {
        recorder.remove(change.pos, change.oldText.length);
        recorder.insertLeft(change.order, change.newText);
      }
    }

    host.commitUpdate(recorder);

    return host;
  };
}

export default function (options: ContainerOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const opts = ['state', 'stateInterface', 'testDepth'].reduce(
      (current: Partial<ContainerOptions>, key) => {
        return omit(current, key as any);
      },
      options
    );

    const templateSource = apply(
      url(options.testDepth === 'unit' ? './files' : './integration-files'),
      [
        options.skipTests
          ? filter((path) => !path.endsWith('.spec.ts.template'))
          : noop(),
        applyTemplates({
          'if-flat': (s: string) => (options.flat ? '' : s),
          ...stringUtils,
          ...(options as object),
        } as any),
        move(parsedPath.path),
      ]
    );

    // Remove all undefined values to use the schematic defaults (in angular.json or the Angular schema)
    (Object.keys(opts) as (keyof ContainerOptions)[]).forEach((key) =>
      opts[key] === undefined ? delete opts[key] : {}
    );

    return chain([
      externalSchematic('@schematics/angular', 'component', {
        ...opts,
        skipTests: true,
      }),
      addStateToComponent(options),
      mergeWith(templateSource),
    ])(host, context);
  };
}
