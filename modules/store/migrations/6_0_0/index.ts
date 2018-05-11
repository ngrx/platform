import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  chain,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const pkgPath = '/package.json';
    const buffer = tree.read(pkgPath);
    if (buffer == null) {
      throw new SchematicsException('Could not read package.json');
    }
    const content = buffer.toString();
    const pkg = JSON.parse(content);

    if (pkg === null || typeof pkg !== 'object' || Array.isArray(pkg)) {
      throw new SchematicsException('Error reading package.json');
    }

    if (!pkg.dependencies) {
      pkg.dependencies = {};
    }

    if (pkg.dependencies['@ngrx/store']) {
      const firstChar = pkg.dependencies['@ngrx/store'][0];
      const suffix = match(firstChar, '^') || match(firstChar, '~');

      // TODO: remove beta
      pkg.dependencies['@ngrx/store'] = `${suffix}6.0.0-beta.2`;
      tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
      context.addTask(new NodePackageInstallTask());
    }

    return tree;
  };
}

function match(value: string, test: string) {
  return value === test ? test : '';
}
