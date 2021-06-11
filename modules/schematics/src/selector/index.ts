import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  url,
} from '@angular-devkit/schematics';
import { getProjectPath, parseName, stringUtils } from '../../schematics-core';
import { Schema as SelectorOptions } from './schema';

export default function (options: SelectorOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, options.name || '');
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      options.skipTests
        ? filter((path) => !path.endsWith('.spec.ts.template'))
        : noop(),
      applyTemplates({
        ...stringUtils,
        'if-flat': (s: string) =>
          stringUtils.group(
            options.flat ? '' : s,
            options.group ? 'selectors' : ''
          ),
        reducerPath: `${relativePath(options)}${stringUtils.dasherize(
          options.name
        )}.reducer`,
        ...(options as object),
      } as any),
      move(parsedPath.path),
    ]);

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(
      host,
      context
    );
  };
}

function relativePath(options: SelectorOptions) {
  if (options.feature) {
    return stringUtils.featurePath(
      options.group,
      options.flat,
      'reducers',
      stringUtils.dasherize(options.name)
    );
  }

  return '';
}
