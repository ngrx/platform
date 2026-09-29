import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {
  createPackageJson,
  packagePath,
} from '@ngrx/schematics-core/testing/create-package';
import {
  upgradeVersion,
  versionPrefixes,
} from '@ngrx/schematics-core/testing/update';

describe('Entity Migration 6_0_0', () => {
  let appTree;
  const pkgName = 'entity';

  versionPrefixes.forEach((prefix) => {
    it(`should install version ${prefix}6.0.0`, async () => {
      appTree = new UnitTestTree(Tree.empty());
      const collectionPath = path.join(
        process.cwd(),
        'dist/modules/entity/migrations/migration.json'
      );
      const schematicRunner = new SchematicTestRunner(
        'schematics',
        collectionPath
      );
      const tree = createPackageJson(prefix, pkgName, appTree);

      const newTree = await schematicRunner.runSchematic(
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
