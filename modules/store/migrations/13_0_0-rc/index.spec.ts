import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createSelector } from '@ngrx/store';

describe('Store Migration 13_0_1', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const pkgName = 'store';

  it(`should replace createSelector with explicit generics usages with explicit generics using Slices tuple`, async () => {
    const contents = `
import {createSelector} from '@ngrx/store'

// untouched
const selectorWithoutGenericArgs = createSelector(() => 1, a => a);
const selectorWithPropsWithGenericArgs = createSelector<State, number, number, number>(() => 1, (a, b) => a + b);

// modified
const selectorWithOneSliceWithGenericArgs = createSelector<State,number,string>(() => 1, a => a);
const selectorWithTwoSlicesWithGenericArgs = createSelector<State,number,string,number>(() => 1, () => '2', (a, b) => a + b);
const selectorWithOneSliceWithGenericArgsWithWhitespace = createSelector<State, number, string>(() => 1, a => a);
const selectorWithTwoSlicesWithGenericArgsWithWhitespace = createSelector<State,  number, string, number>(() => 1, () => '2', (a, b) => a + b);
`;

    const expected = `
import {createSelector} from '@ngrx/store'

// untouched
const selectorWithoutGenericArgs = createSelector(() => 1, a => a);
const selectorWithPropsWithGenericArgs = createSelector<State, number, number, number>(() => 1, (a, b) => a + b);

// modified
const selectorWithOneSliceWithGenericArgs = createSelector<State,[number],string>(() => 1, a => a);
const selectorWithTwoSlicesWithGenericArgs = createSelector<State,[number,string],number>(() => 1, () => '2', (a, b) => a + b);
const selectorWithOneSliceWithGenericArgsWithWhitespace = createSelector<State,[number],string>(() => 1, a => a);
const selectorWithTwoSlicesWithGenericArgsWithWhitespace = createSelector<State,[number,string],number>(() => 1, () => '2', (a, b) => a + b);
`;
    const appTree = new UnitTestTree(Tree.empty());
    appTree.create('./fixture.ts', contents);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-13-rc`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('fixture.ts');

    expect(file).toBe(expected);
  });
});
