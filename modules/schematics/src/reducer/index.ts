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
import {
  getProjectPath,
  findModuleFromOptions,
  stringUtils,
  addReducerToState,
  addReducerImportToNgModule,
  parseName,
  getProject,
  getPrefix,
} from '../../schematics-core';
import { Schema as ReducerOptions } from './schema';

export default function (options: ReducerOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const projectConfig = getProject(host, options);
    options.path = getProjectPath(host, options);

    options.prefix = getPrefix(options);

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
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
      ...(options as object),
    };

    const templateSource = apply(url('./files'), [
      options.skipTests
        ? filter((path) => !path.endsWith('.spec.ts.template'))
        : noop(),
      applyTemplates(templateOptions),
      move(parsedPath.path),
    ]);

    return chain([
      branchAndMerge(chain([addReducerToState(options)])),
      branchAndMerge(
        chain([addReducerImportToNgModule(options), mergeWith(templateSource)])
      ),
    ])(host, context);
  };
}
