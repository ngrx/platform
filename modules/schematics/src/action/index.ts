import {
  Rule,
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  url,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import { Schema as ActionOptions } from './schema';
import {
  getProjectPath,
  stringUtils,
  parseName,
  getPrefix,
} from '../../schematics-core';

export default function (options: ActionOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    options.prefix = getPrefix(options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(
      url(options.creators ? './creator-files' : './files'),
      [
        options.skipTests
          ? filter((path) => !path.endsWith('.spec.ts.template'))
          : noop(),
        applyTemplates({
          ...stringUtils,
          'if-flat': (s: string) =>
            stringUtils.group(
              options.flat ? '' : s,
              options.group ? 'actions' : ''
            ),
          ...options,
        }),
        move(parsedPath.path),
      ]
    );

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(
      host,
      context
    );
  };
}
