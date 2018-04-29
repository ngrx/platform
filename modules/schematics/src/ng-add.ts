import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    return host;
  };
}
