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
import * as stringUtils from '../strings';
import { Schema as ActionOptions } from './schema';
import { getProjectPath } from '../utility/project';

export default function(options: ActionOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

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
    ]);

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(
      host,
      context
    );
  };
}
