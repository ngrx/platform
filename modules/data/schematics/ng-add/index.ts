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
  createReplaceChange,
  ReplaceChange,
  createChangeRecorder,
} from '@ngrx/data/schematics-core';
import { Schema as EntityDataOptions } from './schema';
import { Path } from '@angular-devkit/core';

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
    throwIfModuleNotSpecified(host, options.module);

    const modulePath = options.module!;
    const text = host.read(modulePath)!.toString();

    const source = ts.createSourceFile(
      modulePath,
      text,
      ts.ScriptTarget.Latest,
      true
    );

    const moduleToImport = options.effects
      ? 'EntityDataModule'
      : 'EntityDataModuleWithoutEffects';
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

const renames = {
  NgrxDataModule: 'EntityDataModule',
  NgrxDataModuleWithoutEffects: 'EntityDataModuleWithoutEffects',
  NgrxDataModuleConfig: 'EntityDataModuleConfig',
};

function removeAngularNgRxDataFromPackageJson() {
  return (host: Tree) => {
    if (host.exists('package.json')) {
      const sourceText = host.read('package.json')!.toString('utf-8');
      const json = JSON.parse(sourceText);

      if (json['dependencies'] && json['dependencies']['angular-ngrx-data']) {
        delete json['dependencies']['angular-ngrx-data'];
      }

      host.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return host;
  };
}

function renameNgrxDataModule(options: EntityDataOptions) {
  return (host: Tree, context: SchematicContext) => {
    host.visit(path => {
      if (!path.endsWith('.ts')) {
        return;
      }

      const sourceFile = ts.createSourceFile(
        path,
        host.read(path)!.toString(),
        ts.ScriptTarget.Latest
      );

      if (sourceFile.isDeclarationFile) {
        return;
      }

      const ngrxDataImports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(
          ({ moduleSpecifier }) =>
            moduleSpecifier.getText(sourceFile) === "'ngrx-data'"
        );

      if (ngrxDataImports.length === 0) {
        return;
      }

      const changes = [
        ...findNgrxDataImports(sourceFile, path, ngrxDataImports),
        ...findNgrxDataImportDeclarations(sourceFile, path, ngrxDataImports),
        ...findNgrxDataReplacements(sourceFile, path),
      ];

      if (changes.length === 0) {
        return;
      }

      const recorder = createChangeRecorder(host, path, changes);
      host.commitUpdate(recorder);
    });
  };
}

function findNgrxDataImports(
  sourceFile: ts.SourceFile,
  path: Path,
  imports: ts.ImportDeclaration[]
) {
  const changes = imports.map(specifier =>
    createReplaceChange(
      sourceFile,
      path,
      specifier.moduleSpecifier,
      "'ngrx-data'",
      "'@ngrx/data'"
    )
  );

  return changes;
}

function findNgrxDataImportDeclarations(
  sourceFile: ts.SourceFile,
  path: Path,
  imports: ts.ImportDeclaration[]
) {
  const changes = imports
    .map(p => (p.importClause!.namedBindings! as ts.NamedImports).elements)
    .reduce((imports, curr) => imports.concat(curr), [] as ts.ImportSpecifier[])
    .map(specifier => {
      if (!ts.isImportSpecifier(specifier)) {
        return { hit: false };
      }

      const ngrxDataImports = Object.keys(renames);
      if (ngrxDataImports.includes(specifier.name.text)) {
        return { hit: true, specifier, text: specifier.name.text };
      }

      // if import is renamed
      if (
        specifier.propertyName &&
        ngrxDataImports.includes(specifier.propertyName.text)
      ) {
        return { hit: true, specifier, text: specifier.propertyName.text };
      }

      return { hit: false };
    })
    .filter(({ hit }) => hit)
    .map(({ specifier, text }) =>
      createReplaceChange(
        sourceFile,
        path,
        specifier!,
        text!,
        (renames as any)[text!]
      )
    );

  return changes;
}

function findNgrxDataReplacements(sourceFile: ts.SourceFile, path: Path) {
  const renameKeys = Object.keys(renames);
  let changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, node => find(node, changes));
  return changes;

  function find(node: ts.Node, changes: ReplaceChange[]) {
    let change = undefined;

    if (
      ts.isPropertyAssignment(node) &&
      renameKeys.includes(node.initializer.getText(sourceFile))
    ) {
      change = {
        node: node.initializer,
        text: node.initializer.getText(sourceFile),
      };
    }

    if (
      ts.isPropertyAccessExpression(node) &&
      renameKeys.includes(node.expression.getText(sourceFile))
    ) {
      change = {
        node: node.expression,
        text: node.expression.getText(sourceFile),
      };
    }

    if (
      ts.isVariableDeclaration(node) &&
      node.type &&
      renameKeys.includes(node.type.getText(sourceFile))
    ) {
      change = {
        node: node.type,
        text: node.type.getText(sourceFile),
      };
    }

    if (change) {
      changes.push(
        createReplaceChange(
          sourceFile,
          path,
          change.node,
          change.text,
          (renames as any)[change.text]
        )
      );
    }

    ts.forEachChild(node, childNode => find(childNode, changes));
  }
}

function throwIfModuleNotSpecified(host: Tree, module?: string) {
  if (!module) {
    throw new Error('Module not specified');
  }

  if (!host.exists(module)) {
    throw new Error('Specified module does not exist');
  }

  const text = host.read(module);
  if (text === null) {
    throw new SchematicsException(`File ${module} does not exist.`);
  }
}

export default function(options: EntityDataOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    (options as any).name = '';
    options.path = getProjectPath(host, options);
    options.effects = options.effects === undefined ? true : options.effects;
    options.module = options.module
      ? findModuleFromOptions(host, options as any)
      : options.module;

    const parsedPath = parseName(options.path, '');
    options.path = parsedPath.path;

    return chain([
      options && options.skipPackageJson ? noop() : addNgRxDataToPackageJson(),
      options.migrateNgrxData
        ? chain([
            removeAngularNgRxDataFromPackageJson(),
            renameNgrxDataModule(options),
          ])
        : addEntityDataToNgModule(options),
    ])(host, context);
  };
}
