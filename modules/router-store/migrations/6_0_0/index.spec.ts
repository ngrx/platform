import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {
  createPackageJson,
  packagePath,
} from '../../../schematics-core/testing/create-package';
import {
  upgradeVersion,
  versionPrefixes,
} from '../../../schematics-core/testing/update';

const collectionPath = path.join(__dirname, '../migration.json');

describe('Router Store Migration 6_0_0', () => {
  let appTree;
  const pkgName = 'router-store';

  versionPrefixes.forEach(prefix => {
    it(`should install version ${prefix}6.0.0`, () => {
      appTree = new UnitTestTree(Tree.empty());
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = createPackageJson(prefix, pkgName, appTree);

      const newTree = runner.runSchematic(
        `ngrx-${pkgName}-migration-01`,
        {},
        tree
      );
      const pkg = JSON.parse(newTree.readContent(packagePath));
      expect(pkg.dependencies[`@ngrx/${pkgName}`]).toBe(
        `${prefix}${upgradeVersion}`
      );
    });
  });
});
