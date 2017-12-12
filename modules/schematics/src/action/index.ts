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
import * as stringUtils from '../strings';
import { Schema as ActionOptions } from './schema';

export default function(options: ActionOptions): Rule {
  options.path = options.path ? normalize(options.path) : options.path;
  const sourceDir = options.sourceDir;
  if (!sourceDir) {
    throw new SchematicsException(`sourceDir option is required.`);
  }

  const templateSource = apply(url('./files'), [
    options.spec ? noop() : filter(path => !path.endsWith('__spec.ts')),
    template({
      'if-flat': (s: string) => (options.flat ? '' : s),
      ...stringUtils,
      ...(options as object),
      dot: () => '.',
    }),
    move(sourceDir),
  ]);

  return chain([branchAndMerge(chain([mergeWith(templateSource)]))]);
}
