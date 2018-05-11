import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const packagePath = '/package.json';
const collectionPath = path.join(__dirname, '../migration.json');

describe('Migration 6_0_0', () => {
  function setup(prefix: string) {
    const tree = Tree.empty() as UnitTestTree;
    tree.create(
      packagePath,
      `{
        "dependencies": {
          "@ngrx/store": "${prefix}5.2.0"
        }
      }`
    );

    return {
      tree,
      runner: new SchematicTestRunner('schematics', collectionPath),
    };
  }

  const prefixes = ['~', '^', ''];
  prefixes.forEach(prefix => {
    it(`should install version ${prefix}6.0.0`, () => {
      const { runner, tree } = setup(prefix);
      const newTree = runner.runSchematic('ngrx-store-migration-01', {}, tree);
      const pkg = JSON.parse(newTree.readContent(packagePath));
      expect(pkg.dependencies['@ngrx/store']).toBe(`${prefix}6.0.0-beta.2`);
    });
  });
});
