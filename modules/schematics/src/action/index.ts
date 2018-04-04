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
} from '@angular-devkit/schematics';
import * as stringUtils from '../utility/strings';

export const ActionOptions = require('./schema.json');
export type ActionOptions = {
  name: string;
  appRoot?: string;
  path?: string;
  sourceDir?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  flat?: boolean;
  group?: boolean;
};

export default function(options: ActionOptions): Rule {
  options.path = options.path ? normalize(options.path) : options.path;
  const sourceDir = options.sourceDir;
  if (!sourceDir) {
    throw new SchematicsException(`sourceDir option is required.`);
  }

  const templateSource = apply(url('./files'), [
    options.spec ? noop() : filter(path => !path.endsWith('__spec.ts')),
    template({
      'if-flat': (s: string) =>
        stringUtils.group(
          options.flat ? '' : s,
          options.group ? 'actions' : ''
        ),
      ...stringUtils,
      ...(options as object),
      dot: () => '.',
    } as any),
    move(sourceDir),
  ]);

  return chain([branchAndMerge(chain([mergeWith(templateSource)]))]);
}
