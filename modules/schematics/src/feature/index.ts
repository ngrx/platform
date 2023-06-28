import {
  chain,
  Rule,
  schematic,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';

import { Schema as FeatureOptions } from './schema';

export default function (options: FeatureOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain(
      (options.entity
        ? [
            schematic('entity', {
              name: options.name,
              path: options.path,
              project: options.project,
              flat: options.flat,
              skipTests: options.skipTests,
              module: options.module,
              reducers: options.reducers,
              group: options.group,
              feature: true,
            }),
          ]
        : [
            schematic('action', {
              flat: options.flat,
              group: options.group,
              name: options.name,
              path: options.path,
              project: options.project,
              skipTests: options.skipTests,
              api: options.api,
              prefix: options.prefix,
            }),
            schematic('reducer', {
              flat: options.flat,
              group: options.group,
              module: options.module,
              name: options.name,
              path: options.path,
              project: options.project,
              skipTests: options.skipTests,
              reducers: options.reducers,
              feature: true,
              api: options.api,
              prefix: options.prefix,
            }),
            schematic('selector', {
              flat: options.flat,
              group: options.group,
              name: options.name,
              path: options.path,
              project: options.project,
              skipTests: options.skipTests,
              feature: true,
            }),
          ]
      ).concat([
        schematic('effect', {
          flat: options.flat,
          group: options.group,
          module: options.module,
          name: options.name,
          path: options.path,
          project: options.project,
          skipTests: options.skipTests,
          feature: true,
          api: options.api,
          prefix: options.prefix,
        }),
      ])
    )(host, context);
  };
}
