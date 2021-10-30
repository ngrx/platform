import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

describe('Store Migration 13_0_0 beta', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const pkgName = 'store';

  it(`should replace createFeatureSelector usages with 2 generics`, async () => {
    const contents = `
import {createFeatureSelector} from '@ngrx/store'

const featureSelector1 = createFeatureSelector('feature1');
const featureSelector2 = createFeatureSelector<Feature>(feature2);
const featureSelector3 = createFeatureSelector<State, Feature>('feature3');
const featureSelector4 = createFeatureSelector<State,Feature>(feature4);
const featureSelector5 = createFeatureSelector<State,Feature,SomethingElse>(feature5);
`;

    const expected = `
import {createFeatureSelector} from '@ngrx/store'

const featureSelector1 = createFeatureSelector('feature1');
const featureSelector2 = createFeatureSelector<Feature>(feature2);
const featureSelector3 = createFeatureSelector< Feature>('feature3');
const featureSelector4 = createFeatureSelector<Feature>(feature4);
const featureSelector5 = createFeatureSelector<State,Feature,SomethingElse>(feature5);
`;

    const appTree = new UnitTestTree(Tree.empty());
    appTree.create('./fixture.ts', contents);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-13-beta`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('fixture.ts');

    expect(file).toBe(expected);
  });
});
