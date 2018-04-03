import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
} from '@angular-devkit/schematics';

export const FeatureOptions = require('./schema.json');
export type FeatureOptions = {
  path?: string;
  sourceDir?: string;
  name: string;
  module?: string;
  flat?: boolean;
  spec?: boolean;
  reducers?: string;
  group?: boolean;
};

export default function(options: FeatureOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      schematic('action', {
        flat: options.flat,
        group: options.group,
        name: options.name,
        path: options.path,
        sourceDir: options.sourceDir,
        spec: false,
      }),
      schematic('reducer', {
        flat: options.flat,
        group: options.group,
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
        group: options.group,
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
