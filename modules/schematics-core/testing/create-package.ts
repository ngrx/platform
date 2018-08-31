import { Tree } from '@angular-devkit/schematics';
import {
  UnitTestTree,
  SchematicTestRunner,
} from '@angular-devkit/schematics/testing';

export const packagePath = '/package.json';

export function createPackageJson(
  prefix: string,
  pkg: string,
  tree: UnitTestTree,
  version = '5.2.0',
  packagePath = '/package.json'
) {
  tree.create(
    packagePath,
    `{
      "dependencies": {
        "@ngrx/${pkg}": "${prefix}${version}"
      }
    }`
  );

  return tree;
}
