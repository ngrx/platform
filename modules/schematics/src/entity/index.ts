import {
  Rule,
  SchematicsException,
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
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import {
  stringUtils,
  addReducerToState,
  addReducerImportToNgModule,
  getProjectPath,
  findModuleFromOptions,
  parseName,
} from '@ngrx/schematics/schematics-core';
import { Schema as EntityOptions } from './schema';

export default function(options: EntityOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const templateOptions = {
      ...stringUtils,
      'if-flat': (s: string) => (options.flat ? '' : s),
      'group-actions': (name: string) =>
        stringUtils.group(name, options.group ? 'actions' : ''),
      'group-models': (name: string) =>
        stringUtils.group(name, options.group ? 'models' : ''),
      'group-reducers': (s: string) =>
        stringUtils.group(s, options.group ? 'reducers' : ''),
      ...(options as object),
    };

    const commonTemplates = apply(url('./common-files'), [
      options.spec
        ? noop()
        : filter(path => !path.endsWith('.spec.ts.template')),
      applyTemplates(templateOptions),
      move(parsedPath.path),
    ]);

    const templateSource = apply(
      url(options.creators ? './creator-files' : './files'),
      [applyTemplates(templateOptions), move(parsedPath.path)]
    );

    return chain([
      addReducerToState({ ...options, plural: true }),
      addReducerImportToNgModule({ ...options, plural: true }),
      branchAndMerge(
        chain([mergeWith(commonTemplates), mergeWith(templateSource)])
      ),
    ])(host, context);
  };
}
