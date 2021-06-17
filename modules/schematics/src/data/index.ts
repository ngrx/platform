import {
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { getProjectPath, parseName, stringUtils } from '../../schematics-core';
import { Schema as DataOptions } from './schema';

export default function (options: DataOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      options.skipTests
        ? filter((path) => !path.endsWith('.spec.ts.template'))
        : noop(),
      applyTemplates({
        ...stringUtils,
        'if-flat': (s: string) =>
          stringUtils.group(options.flat ? '' : s, options.group ? 'data' : ''),
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(
      host,
      context
    );
  };
}
