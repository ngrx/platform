import * as ts from 'typescript';
import { Path } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addImportToModule,
  addPackageToPackageJson,
  commitChanges,
  createReplaceChange,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  parseName,
  platformVersion,
  ReplaceChange,
  stringUtils,
  visitTSSourceFiles,
} from '../../schematics-core';
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
      options.entityConfig
        ? [moduleToImport, 'forRoot(entityConfig)'].join('.')
        : moduleToImport,
      ''
    );

    const changes = [effectsModuleImport, dateEntityNgModuleImport];

    if (options.entityConfig) {
      const entityConfigImport = insertImport(
        source,
        modulePath,
        'entityConfig',
        './entity-metadata'
      );
      changes.push(entityConfigImport);
    }

    commitChanges(host, source.fileName, changes);

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

      if (json['dependencies'] && json['dependencies']['ngrx-data']) {
        delete json['dependencies']['ngrx-data'];
      }

      host.overwrite('package.json', JSON.stringify(json, null, 2));
    }

    return host;
  };
}

function renameNgrxDataModule() {
  return (host: Tree) => {
    visitTSSourceFiles(host, (sourceFile) => {
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
        ...findNgrxDataImports(sourceFile, ngrxDataImports),
        ...findNgrxDataImportDeclarations(sourceFile, ngrxDataImports),
        ...findNgrxDataReplacements(sourceFile),
      ];

      commitChanges(host, sourceFile.fileName, changes);
    });
  };
}

function findNgrxDataImports(
  sourceFile: ts.SourceFile,
  imports: ts.ImportDeclaration[]
) {
  const changes = imports.map((specifier) =>
    createReplaceChange(
      sourceFile,
      specifier.moduleSpecifier,
      "'ngrx-data'",
      "'@ngrx/data'"
    )
  );

  return changes;
}

function findNgrxDataImportDeclarations(
  sourceFile: ts.SourceFile,
  imports: ts.ImportDeclaration[]
) {
  const changes = imports
    .map((p) => (p.importClause!.namedBindings! as ts.NamedImports).elements)
    .reduce((imports, curr) => imports.concat(curr), [] as ts.ImportSpecifier[])
    .map((specifier) => {
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
        specifier!,
        text!,
        (renames as any)[text!]
      )
    );

  return changes;
}

function findNgrxDataReplacements(sourceFile: ts.SourceFile) {
  const renameKeys = Object.keys(renames);
  const changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, (node) => find(node, changes));
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
          change.node,
          change.text,
          (renames as any)[change.text]
        )
      );
    }

    ts.forEachChild(node, (childNode) => find(childNode, changes));
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

function createEntityConfigFile(options: EntityDataOptions, path: Path) {
  return mergeWith(
    apply(url('./files'), [
      applyTemplates({
        ...stringUtils,
        ...options,
      }),
      move(path),
    ])
  );
}

export default function (options: EntityDataOptions): Rule {
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
            renameNgrxDataModule(),
          ])
        : addEntityDataToNgModule(options),
      options.entityConfig
        ? createEntityConfigFile(options, parsedPath.path)
        : noop(),
    ])(host, context);
  };
}
