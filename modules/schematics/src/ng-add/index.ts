import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
} from '@angular-devkit/schematics';
import { Schema as NgAddOptions } from './schema';

export default function(options: NgAddOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const schematicsToRun = [
      schematic('store', {
        flat: options.flat,
        module: options.module,
        name: options.name,
        path: options.path,
        sourceDir: options.sourceDir,
        spec: options.spec,
        statePath: options.statePath,
        root: true,
      }),
    ];

    if (options.effect) {
      schematicsToRun.push(
        schematic('effect', {
          flat: options.flat,
          group: options.group,
          module: options.module,
          name: options.effectName,
          path: options.path,
          sourceDir: options.sourceDir,
          spec: options.spec,
          root: true,
        })
      );
    }

    return chain(schematicsToRun)(host, context);
  };
}
