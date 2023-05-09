import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  branchAndMerge,
  chain,
  noop,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  InsertChange,
  addImportToModule,
  findModuleFromOptions,
  getProjectPath,
  insertImport,
  addPackageToPackageJson,
  platformVersion,
  parseName,
} from '../../schematics-core';
import { Schema as StoreDevtoolsOptions } from './schema';
import {
  addFunctionalProvidersToStandaloneBootstrap,
  callsProvidersFunction,
} from '@schematics/angular/private/standalone';
import { getProjectMainFile } from '../../schematics-core/utility/project';
import { isStandaloneApp } from '../../schematics-core/utility/standalone';

function addImportToNgModule(options: StoreDevtoolsOptions): Rule {
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

    const [instrumentNgModuleImport] = addImportToModule(
      source,
      modulePath,
      `StoreDevtoolsModule.instrument({ maxAge: ${options.maxAge}, logOnly: !isDevMode() })`,
      modulePath
    );

    const changes = [
      insertImport(
        source,
        modulePath,
        'StoreDevtoolsModule',
        '@ngrx/store-devtools'
      ),
      insertImport(source, modulePath, 'isDevMode', '@angular/core'),
      instrumentNgModuleImport,
    ];
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

function addNgRxStoreDevToolsToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/store-devtools',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

function addStandaloneConfig(options: StoreDevtoolsOptions): Rule {
  return (host: Tree) => {
    const mainFile = getProjectMainFile(host, options);

    if (host.exists(mainFile)) {
      const providerFn = 'provideStoreDevtools';

      if (callsProvidersFunction(host, mainFile, providerFn)) {
        // exit because the store config is already provided
        return host;
      }

      const providerOptions = [
        ts.factory.createIdentifier(
          `{ maxAge: ${options.maxAge}, logOnly: !isDevMode() }`
        ),
      ];

      const patchedConfigFile = addFunctionalProvidersToStandaloneBootstrap(
        host,
        mainFile,
        providerFn,
        '@ngrx/store-devtools',
        providerOptions
      );

      // insert reducers import into the patched file
      const configFileContent = host.read(patchedConfigFile);
      const source = ts.createSourceFile(
        patchedConfigFile,
        configFileContent?.toString('utf-8') || '',
        ts.ScriptTarget.Latest,
        true
      );

      const recorder = host.beginUpdate(patchedConfigFile);

      const changes = [
        insertImport(source, patchedConfigFile, 'isDevMode', '@angular/core'),
      ];

      for (const change of changes) {
        if (change instanceof InsertChange) {
          recorder.insertLeft(change.pos, change.toAdd);
        }
      }

      host.commitUpdate(recorder);

      return host;
    }

    throw new SchematicsException(
      `Main file not found for a project ${options.project}`
    );
  };
}

export default function (options: StoreDevtoolsOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const mainFile = getProjectMainFile(host, options);
    const isStandalone = isStandaloneApp(host, mainFile);

    options.path = getProjectPath(host, options);

    if (options.module && !isStandalone) {
      options.module = findModuleFromOptions(host, {
        name: '',
        module: options.module,
        path: options.path,
      });
    }

    const parsedPath = parseName(options.path, '');
    options.path = parsedPath.path;

    if (options.maxAge && (options.maxAge < 0 || options.maxAge === 1)) {
      throw new SchematicsException(
        `maxAge should be an integer greater than 1.`
      );
    }

    const configOrModuleUpdate = isStandalone
      ? addStandaloneConfig(options)
      : addImportToNgModule(options);

    return chain([
      branchAndMerge(chain([configOrModuleUpdate])),
      options && options.skipPackageJson
        ? noop()
        : addNgRxStoreDevToolsToPackageJson(),
    ])(host, context);
  };
}
