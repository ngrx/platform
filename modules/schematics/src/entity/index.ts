import { normalize } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  template,
  url,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import * as stringUtils from '../utility/strings';
import {
  addReducerToState,
  addReducerImportToNgModule,
} from '../utility/ngrx-utils';
import { findModuleFromOptions } from '../utility/find-module';

export const EntityOptions = require('./schema.json');
export type EntityOptions = {
  name: string;
  appRoot?: string;
  path?: string;
  sourceDir?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  module?: string;
  reducers?: string;
  flat?: boolean;
  group?: boolean;
};

export default function(options: EntityOptions): Rule {
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
        'if-flat': (s: string) => (options.flat ? '' : s),
        'group-actions': (name: string) =>
          stringUtils.group(name, options.group ? 'actions' : ''),
        'group-models': (name: string) =>
          stringUtils.group(name, options.group ? 'models' : ''),
        'group-reducers': (s: string) =>
          stringUtils.group(s, options.group ? 'reducers' : ''),
        ...(options as object),
        dot: () => '.',
      } as any),
      move(sourceDir),
    ]);

    return chain([
      addReducerToState({ ...options }),
      addReducerImportToNgModule({ ...options }),
      branchAndMerge(chain([mergeWith(templateSource)])),
    ])(host, context);
  };
}
