import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
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
} from '@ngrx/schematics/schematics-core';
import { Schema as ReducerOptions } from './schema';

export default function(options: ReducerOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('__spec.ts')),
      template({
        ...stringUtils,
        'if-flat': (s: string) =>
          stringUtils.group(
            options.flat ? '' : s,
            options.group ? 'reducers' : ''
          ),
        ...(options as object),
        dot: () => '.',
      } as any),
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
