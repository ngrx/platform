import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
} from '@angular-devkit/schematics';
import { Schema as NgAddOptions } from './schema';

export default function(options: NgAddOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      externalSchematic('@ngrx/schematics', 'store', {
        ...options,
        root: true,
      }),
    ])(host, context);
  };
}
