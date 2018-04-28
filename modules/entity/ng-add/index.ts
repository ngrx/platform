import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
} from '@angular-devkit/schematics';
import { Schema as NgAddOptions } from './schema';

// good example: https://github.com/angular/material2/blob/master/src/lib/schematics/shell/index.ts

export default function(options: NgAddOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return host;
  };
}
