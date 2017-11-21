import {
  MergeStrategy,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  schematic,
  template,
  url,
} from '@angular-devkit/schematics';
import * as ts from 'typescript';
import * as stringUtils from '../strings';
import { addBootstrapToModule, addImportToModule } from '../utility/ast-utils';
import { InsertChange } from '../utility/change';
import { Schema as FeatureOptions } from './schema';
import { insertImport } from '../utility/route-utils';
import { buildRelativePath } from '../utility/find-module';

export default function(options: FeatureOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      schematic('action', {
        name: options.name,
        path: options.path,
        sourceDir: options.sourceDir,
        spec: false,
      }),
      schematic('reducer', {
        flat: options.flat,
        module: options.module,
        name: options.name,
        path: options.path,
        sourceDir: options.sourceDir,
        spec: options.spec,
        reducers: options.reducers,
        feature: true,
      }),
      schematic('effect', {
        flat: options.flat,
        module: options.module,
        name: options.name,
        path: options.path,
        sourceDir: options.sourceDir,
        spec: options.spec,
        feature: true,
      }),
    ])(host, context);
  };
}
