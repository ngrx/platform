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
  mergeWith,
  url,
  noop,
  move,
  filter,
} from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import {
  InsertChange,
  addImportToModule,
  buildRelativePath,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  stringUtils,
  addPackageToPackageJson,
  platformVersion,
  parseName,
} from '../../schematics-core';
import { Schema as RootStoreOptions } from './schema';
import {
  addFunctionalProvidersToStandaloneBootstrap,
  callsProvidersFunction,
} from '@schematics/angular/private/standalone';
import { getProjectMainFile } from '../../schematics-core/utility/project';

function addImportToNgModule(options: RootStoreOptions): Rule {
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

    const storeModuleReducers = options.minimal ? `{}` : `reducers`;

    const storeModuleConfig = options.minimal
      ? `{}`
      : `{
      metaReducers
    }`;
    const storeModuleSetup = `StoreModule.forRoot(${storeModuleReducers}, ${storeModuleConfig})`;

    const statePath = `/${options.path}/${options.statePath}`;
    const relativePath = buildRelativePath(modulePath, statePath);
    const [storeNgModuleImport] = addImportToModule(
      source,
      modulePath,
      storeModuleSetup,
      relativePath
    );

    let changes = [
      insertImport(source, modulePath, 'StoreModule', '@ngrx/store'),
      storeNgModuleImport,
    ];

    if (!options.minimal) {
      changes = changes.concat([
        insertImport(
          source,
          modulePath,
          'reducers, metaReducers',
          relativePath
        ),
      ]);
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

function addNgRxStoreToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/store',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function addNgRxESLintPlugin() {
  return (host: Tree, context: SchematicContext) => {
    const eslint = host.read('.eslintrc.json')?.toString('utf-8');
    if (eslint) {
      addPackageToPackageJson(
        host,
        'devDependencies',
        '@ngrx/eslint-plugin',
        platformVersion
      );

      const installTaskId = context.addTask(new NodePackageInstallTask());
      context.addTask(
        new RunSchematicTask('@ngrx/eslint-plugin', 'ng-add', {}),
        [installTaskId]
      );
    }
    return host;
  };
}

function addStandaloneConfig(options: RootStoreOptions): Rule {
  return (host: Tree) => {
    const mainFile = getProjectMainFile(host, options);

    if (host.exists(mainFile)) {
      const storeProviderFn = 'provideStore';

      if (callsProvidersFunction(host, mainFile, storeProviderFn)) {
        // exit because the store config is already provided
        return host;
      }
      const storeProviderOptions = options.minimal
        ? []
        : [
            ts.factory.createIdentifier('reducers'),
            ts.factory.createIdentifier('{ metaReducers }'),
          ];
      const patchedConfigFile = addFunctionalProvidersToStandaloneBootstrap(
        host,
        mainFile,
        storeProviderFn,
        '@ngrx/store',
        storeProviderOptions
      );

      if (options.minimal) {
        // no need to add imports if it is minimal
        return host;
      }

      // insert reducers import into the patched file
      const configFileContent = host.read(patchedConfigFile);
      const source = ts.createSourceFile(
        patchedConfigFile,
        configFileContent?.toString('utf-8') || '',
        ts.ScriptTarget.Latest,
        true
      );
      const statePath = `/${options.path}/${options.statePath}`;
      const relativePath = buildRelativePath(
        `/${patchedConfigFile}`,
        statePath
      );

      const recorder = host.beginUpdate(patchedConfigFile);

      const change = insertImport(
        source,
        patchedConfigFile,
        'reducers, metaReducers',
        relativePath
      );

      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }

      host.commitUpdate(recorder);

      return host;
    }
    throw new SchematicsException(
      `Main file not found for a project ${options.project}`
    );
  };
}

export default function (options: RootStoreOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, '');
    options.path = parsedPath.path;

    if (options.module && !options.standalone) {
      options.module = findModuleFromOptions(host, {
        name: '',
        module: options.module,
        path: options.path,
      });
    }

    if (options.stateInterface && options.stateInterface !== 'State') {
      options.stateInterface = stringUtils.classify(options.stateInterface);
    }

    const templateSource = apply(url('./files'), [
      filter(() => (options.minimal ? false : true)),
      applyTemplates({
        ...stringUtils,
        ...options,
      }),
      move(parsedPath.path),
    ]);

    const configOrModuleUpdate = options.standalone
      ? addStandaloneConfig(options)
      : addImportToNgModule(options);

    return chain([
      branchAndMerge(chain([configOrModuleUpdate, mergeWith(templateSource)])),
      options && options.skipPackageJson ? noop() : addNgRxStoreToPackageJson(),
      options && options.skipESLintPlugin ? noop() : addNgRxESLintPlugin(),
    ])(host, context);
  };
}
