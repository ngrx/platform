import {
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { Schema as ComponentStoreOptions } from './schema';
import {
  addProviderToComponent,
  addProviderToModule,
  buildRelativePath,
  findComponentFromOptions,
  findModuleFromOptions,
  getProjectPath,
  InsertChange,
  parseName,
  stringUtils,
  insertImport,
} from '../../schematics-core';

interface AddProviderContext {
  componentStoreRelativePath: string;
  componentStoreName: string;
}

function createProvidingContext(
  options: Pick<ComponentStoreOptions, 'name' | 'flat' | 'path'>,
  providingPath: string
): AddProviderContext {
  const componentStoreName = `${stringUtils.classify(`${options.name}Store`)}`;
  const componentStorePath =
    `/${options.path}/` +
    (options.flat ? '' : stringUtils.dasherize(options.name) + '/') +
    stringUtils.dasherize(options.name) +
    '.store';
  const componentStoreRelativePath = buildRelativePath(
    providingPath,
    componentStorePath
  );

  return {
    componentStoreRelativePath,
    componentStoreName,
  };
}

/**
 * Add component store to NgModule
 */
export function addComponentStoreProviderToNgModule(
  options: ComponentStoreOptions
): Rule {
  return (host: Tree) => {
    if (!options.module) {
      return host;
    }

    const modulePath = options.module;
    if (!host.exists(options.module)) {
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

    const context = createProvidingContext(options, options.module);

    const componentStore = insertImport(
      source,
      modulePath,
      context.componentStoreName,
      context.componentStoreRelativePath
    );
    const [storeNgModuleProvider] = addProviderToModule(
      source,
      modulePath,
      context.componentStoreName,
      context.componentStoreRelativePath
    );
    const changes = [componentStore, storeNgModuleProvider];
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

/**
 * Add component store to Component
 */
export function addComponentStoreProviderToComponent(
  options: ComponentStoreOptions
): Rule {
  return (host: Tree) => {
    if (!options.component) {
      return host;
    }

    const componentPath = options.component;
    if (!host.exists(options.component)) {
      throw new Error(
        `Specified component path ${componentPath} does not exist`
      );
    }

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

    const context = createProvidingContext(options, options.component);

    const componentStore = insertImport(
      source,
      componentPath,
      context.componentStoreName,
      context.componentStoreRelativePath
    );
    const [storeNgModuleProvider] = addProviderToComponent(
      source,
      componentPath,
      context.componentStoreName,
      context.componentStoreRelativePath
    );
    const changes = [componentStore, storeNgModuleProvider];
    const recorder = host.beginUpdate(componentPath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

export default function (options: ComponentStoreOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    if (options.component) {
      options.component = findComponentFromOptions(host, options);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      options.skipTests
        ? filter((path) => !path.endsWith('.spec.ts.template'))
        : noop(),
      applyTemplates({
        ...stringUtils,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return chain([
      branchAndMerge(
        chain([
          addComponentStoreProviderToNgModule(options),
          addComponentStoreProviderToComponent(options),
          mergeWith(templateSource),
        ])
      ),
    ])(host, context);
  };
}
