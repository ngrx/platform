import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  mergeWith,
  template,
  url,
  move,
  filter,
  noop,
} from '@angular-devkit/schematics';
import { Path, dirname } from '@angular-devkit/core';
import * as ts from 'typescript';
import {
  stringUtils,
  buildRelativePath,
  insertImport,
  Change,
  InsertChange,
  getProjectPath,
  isLib,
  findModuleFromOptions,
  addImportToModule,
  parseName,
  visitNgModuleImports,
} from '../../schematics-core';
import { Schema as StoreOptions } from './schema';

function addImportToNgModule(options: StoreOptions): Rule {
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

    const statePath = `${options.path}/${options.statePath}`;
    const relativePath = buildRelativePath(modulePath, statePath);

    const environmentsPath = buildRelativePath(
      statePath,
      `${options.path}/environments/environment`
    );

    const rootStoreReducers = options.minimal ? `{}` : `reducers`;
    const rootStoreConfig = options.minimal ? `` : `, { metaReducers }`;

    const storeNgModuleImport = addImportToModule(
      source,
      modulePath,
      options.root
        ? `StoreModule.forRoot(${rootStoreReducers}${rootStoreConfig})`
        : `StoreModule.forFeature(from${stringUtils.classify(
            options.name
          )}.${stringUtils.camelize(
            options.name
          )}FeatureKey, from${stringUtils.classify(
            options.name
          )}.reducers, { metaReducers: from${stringUtils.classify(
            options.name
          )}.metaReducers })`,
      relativePath
    ).shift();

    let commonImports = [
      insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
      storeNgModuleImport,
    ];

    if (options.root && !options.minimal) {
      commonImports = commonImports.concat([
        insertImport(
          source,
          modulePath,
          'reducers, metaReducers',
          relativePath
        ),
      ]);
    } else if (!options.root) {
      commonImports = commonImports.concat([
        insertImport(
          source,
          modulePath,
          `* as from${stringUtils.classify(options.name)}`,
          relativePath,
          true
        ),
      ]);
    }

    let rootImports: (Change | undefined)[] = [];

    if (options.root) {
      let hasImports = false;
      visitNgModuleImports(source, (_, importNodes) => {
        hasImports = importNodes.length > 0;
      });

      // `addImportToModule` adds a comma to imports when there are already imports present
      // because at this time the store import hasn't been committed yet, `addImportToModule` wont add a comma
      // so we have to add it here for empty import arrays
      const adjectiveComma = hasImports ? '' : ', ';

      const storeDevtoolsNgModuleImport = addImportToModule(
        source,
        modulePath,
        `${adjectiveComma}!environment.production ? StoreDevtoolsModule.instrument() : []`,
        relativePath
      ).shift();

      rootImports = rootImports.concat([
        insertImport(
          source,
          modulePath,
          'StoreDevtoolsModule',
          '@ngrx/store-devtools'
        ),
        insertImport(source, modulePath, 'environment', environmentsPath),
        storeDevtoolsNgModuleImport,
      ]);
    }

    const changes = [...commonImports, ...rootImports];
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

export default function (options: StoreOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.name && !options.root) {
      throw new Error(`Please provide a name for the feature state`);
    }

    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, options.name || '');
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const statePath = `/${options.path}/${options.statePath}/index.ts`;
    const srcPath = dirname(options.path as Path);
    const environmentsPath = buildRelativePath(
      statePath,
      `${srcPath}/environments/environment`
    );

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    if (
      options.root &&
      options.stateInterface &&
      options.stateInterface !== 'State'
    ) {
      options.stateInterface = stringUtils.classify(options.stateInterface);
    }

    const templateSource = apply(url('./files'), [
      options.root && options.minimal ? filter((_) => false) : noop(),
      applyTemplates({
        ...stringUtils,
        ...(options as object),
        isLib: isLib(host, options),
        environmentsPath,
      }),
      move(parsedPath.path),
    ]);

    return chain([
      branchAndMerge(
        chain([addImportToNgModule(options), mergeWith(templateSource)])
      ),
    ])(host, context);
  };
}
