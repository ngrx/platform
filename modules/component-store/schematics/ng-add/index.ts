import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageToPackageJson,
  platformVersion,
} from '../../schematics-core';
import { Schema as SchemaOptions } from './schema';

function addModuleToPackageJson() {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(
      host,
      'dependencies',
      '@ngrx/component-store',
      platformVersion
    );
    context.addTask(new NodePackageInstallTask());
    return host;
  };
}

export default function (options: SchemaOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      options && options.skipPackageJson ? noop() : addModuleToPackageJson(),
    ])(host, context);
  };
}
