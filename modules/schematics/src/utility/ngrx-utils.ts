import * as ts from 'typescript';
import * as stringUtils from './strings';
import { InsertChange, Change, NoopChange } from './change';
import { Tree, SchematicsException, Rule } from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';
import { buildRelativePath } from './find-module';
import { insertImport } from './route-utils';
import { ReducerOptions } from '../reducer';
import { addImportToModule } from './ast-utils';

export function addReducerToState(options: ReducerOptions): Rule {
  return (host: Tree) => {
    if (!options.reducers) {
      return host;
    }

    const reducersPath = normalize(
      `/${options.sourceDir}/${options.path}/${options.reducers}`
    );

    if (!host.exists(reducersPath)) {
      throw new Error('Specified reducers path does not exist');
    }

    const text = host.read(reducersPath);
    if (text === null) {
      throw new SchematicsException(`File ${reducersPath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(
      reducersPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    const reducerPath =
      `/${options.sourceDir}/${options.path}/` +
      (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
      (options.group ? 'reducers/' : '') +
      stringUtils.dasherize(options.name) +
      '.reducer';

    const relativePath = buildRelativePath(reducersPath, reducerPath);
    const reducerImport = insertImport(
      source,
      reducersPath,
      `* as from${stringUtils.classify(options.name)}`,
      relativePath,
      true
    );

    const stateInferfaceInsert = addReducerToStateInferface(
      source,
      reducersPath,
      options
    );
    const reducerMapInsert = addReducerToActionReducerMap(
      source,
      reducersPath,
      options
    );

    const changes = [reducerImport, stateInferfaceInsert, reducerMapInsert];
    const recorder = host.beginUpdate(reducersPath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

/**
 * Insert the reducer into the first defined top level interface
 */
export function addReducerToStateInferface(
  source: ts.SourceFile,
  reducersPath: string,
  options: { name: string }
): Change {
  const stateInterface = source.statements.find(
    stm => stm.kind === ts.SyntaxKind.InterfaceDeclaration
  );
  let node = stateInterface as ts.Statement;

  if (!node) {
    return new NoopChange();
  }

  const keyInsert =
    stringUtils.camelize(options.name) +
    ': from' +
    stringUtils.classify(options.name) +
    '.State;';
  const expr = node as any;
  let position;
  let toInsert;

  if (expr.members.length === 0) {
    position = expr.getEnd() - 1;
    toInsert = `  ${keyInsert}\n`;
  } else {
    node = expr.members[expr.members.length - 1];
    position = node.getEnd() + 1;
    // Get the indentation of the last element, if any.
    const text = node.getFullText(source);
    const matches = text.match(/^\r?\n+(\s*)/);

    if (matches!.length > 0) {
      toInsert = `${matches![1]}${keyInsert}\n`;
    } else {
      toInsert = `\n${keyInsert}`;
    }
  }

  return new InsertChange(reducersPath, position, toInsert);
}

/**
 * Insert the reducer into the ActionReducerMap
 */
export function addReducerToActionReducerMap(
  source: ts.SourceFile,
  reducersPath: string,
  options: { name: string }
): Change {
  let initializer: any;
  const actionReducerMap: any = source.statements
    .filter(stm => stm.kind === ts.SyntaxKind.VariableStatement)
    .filter((stm: any) => !!stm.declarationList)
    .map((stm: any) => {
      const {
        declarations,
      }: {
        declarations: ts.SyntaxKind.VariableDeclarationList[];
      } = stm.declarationList;
      const variable: any = declarations.find(
        (decl: any) => decl.kind === ts.SyntaxKind.VariableDeclaration
      );
      const type = variable ? variable.type : {};

      return { initializer: variable.initializer, type };
    })
    .find(({ type }) => type.typeName.text === 'ActionReducerMap');

  if (!actionReducerMap || !actionReducerMap.initializer) {
    return new NoopChange();
  }

  let node = actionReducerMap.initializer;

  const keyInsert =
    stringUtils.camelize(options.name) +
    ': from' +
    stringUtils.classify(options.name) +
    '.reducer,';
  const expr = node as any;
  let position;
  let toInsert;

  if (expr.properties.length === 0) {
    position = expr.getEnd() - 1;
    toInsert = `  ${keyInsert}\n`;
  } else {
    node = expr.properties[expr.properties.length - 1];
    position = node.getEnd() + 1;
    // Get the indentation of the last element, if any.
    const text = node.getFullText(source);
    const matches = text.match(/^\r?\n+(\s*)/);

    if (matches.length > 0) {
      toInsert = `\n${matches![1]}${keyInsert}`;
    } else {
      toInsert = `\n${keyInsert}`;
    }
  }

  return new InsertChange(reducersPath, position, toInsert);
}

/**
 * Add reducer feature to NgModule
 */
export function addReducerImportToNgModule(options: ReducerOptions): Rule {
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

    const commonImports = [
      insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
    ];

    const reducerPath =
      `/${options.sourceDir}/${options.path}/` +
      (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
      (options.group ? 'reducers/' : '') +
      stringUtils.dasherize(options.name) +
      '.reducer';
    const relativePath = buildRelativePath(modulePath, reducerPath);
    const reducerImport = insertImport(
      source,
      modulePath,
      `* as from${stringUtils.classify(options.name)}`,
      relativePath,
      true
    );
    const [storeNgModuleImport] = addImportToModule(
      source,
      modulePath,
      `StoreModule.forFeature('${stringUtils.camelize(
        options.name
      )}', from${stringUtils.classify(options.name)}.reducer)`,
      relativePath
    );
    const changes = [...commonImports, reducerImport, storeNgModuleImport];
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

export function omit<T extends { [key: string]: any }>(
  object: T,
  keyToRemove: keyof T
): Partial<T> {
  return Object.keys(object)
    .filter(key => key !== keyToRemove)
    .reduce((result, key) => Object.assign(result, { [key]: object[key] }), {});
}
