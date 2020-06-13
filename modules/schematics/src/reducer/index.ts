import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import {
  getProjectPath,
  findModuleFromOptions,
  stringUtils,
  addReducerToState,
  addReducerImportToNgModule,
  parseName,
  isIvyEnabled,
  getProject,
} from '@ngrx/schematics/schematics-core';
import { Schema as ReducerOptions } from './schema';

export default function (options: ReducerOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const projectConfig = getProject(host, options);
    options.path = getProjectPath(host, options);

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    if (!options.skipTests && options.skipTest) {
      options.skipTests = options.skipTest;
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateOptions = {
      ...stringUtils,
      'if-flat': (s: string) =>
        stringUtils.group(
          options.flat ? '' : s,
          options.group ? 'reducers' : ''
        ),
      isIvyEnabled:
        isIvyEnabled(host, 'tsconfig.json') &&
        isIvyEnabled(host, `${projectConfig.root}/tsconfig.app.json`),
      ...(options as object),
    };

    const commonTemplate = apply(url('./common-files'), [
      options.skipTests
        ? filter((path) => !path.endsWith('.spec.ts.template'))
        : noop(),
      applyTemplates(templateOptions),
      move(parsedPath.path),
    ]);

    const templateSource = apply(
      url(options.creators ? './creator-files' : './files'),
      [applyTemplates(templateOptions), move(parsedPath.path)]
    );

    return chain([
      branchAndMerge(chain([addReducerToState(options)])),
      branchAndMerge(
        chain([
          addReducerImportToNgModule(options),
          mergeWith(commonTemplate),
          mergeWith(templateSource),
        ])
      ),
    ])(host, context);
  };
}
