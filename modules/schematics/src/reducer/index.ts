import { normalize } from '@angular-devkit/core';
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
import * as stringUtils from '../utility/strings';
import { findModuleFromOptions } from '../utility/find-module';
import {
  addReducerToStateInferface,
  addReducerToActionReducerMap,
  addReducerToState,
  addReducerImportToNgModule,
} from '../utility/ngrx-utils';

export const ReducerOptions = require('./schema.json');
export type ReducerOptions = {
  name: string;
  appRoot?: string;
  path?: string;
  sourceDir?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Flag to indicate if a dir is created.
   */
  flat?: boolean;
  module?: string;
  feature?: boolean;
  reducers?: string;
  group?: boolean;
};

export default function(options: ReducerOptions): Rule {
  options.path = options.path ? normalize(options.path) : options.path;
  const sourceDir = options.sourceDir;
  if (!sourceDir) {
    throw new SchematicsException(`sourceDir option is required.`);
  }

  return (host: Tree, context: SchematicContext) => {
    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

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
      move(sourceDir),
    ]);

    return chain([
      branchAndMerge(
        chain([
          filter(path => !path.includes('node_modules')),
          addReducerToState(options),
        ])
      ),
      branchAndMerge(
        chain([
          filter(
            path =>
              path.endsWith('.module.ts') &&
              !path.endsWith('-routing.module.ts')
          ),
          addReducerImportToNgModule(options),
          mergeWith(templateSource),
        ])
      ),
    ])(host, context);
  };
}
