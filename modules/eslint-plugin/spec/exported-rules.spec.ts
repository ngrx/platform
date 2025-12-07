import * as path from 'path';
import * as lib from '../src/rules';
import { traverseFolder } from '../src/utils';
import { configs } from '../v9';

const rulesDirectory = path.join(__dirname, '../src/rules');
const configsDirectory = path.join(__dirname, '../src/configs');

function getAllRules() {
  return [...traverseFolder(rulesDirectory, ['.ts'])]
    .map((rule) => rule.file)
    .filter((rule) => rule !== 'index');
}
function getAllConfigs() {
  return [...traverseFolder(configsDirectory, ['.ts'])];
}

describe('ESLint V8', () => {
  test('exports all rules', () => {
    const rules = getAllRules();
    expect(Object.keys(lib.rules).length).toBe(rules.length);
  });
  test('exports all configurations', () => {
    const configs = getAllConfigs();
    expect(configs.length).toBe(9);
  });
});

describe('ESLint V9', () => {
  test('exports all rules ', () => {
    const rules = getAllRules();
    expect(Object.keys((configs.allTypeChecked[1] as any).rules).length).toBe(
      rules.length
    );
  });
  test('there is a difference between typed checked rules ', () => {
    expect(
      Object.keys((configs.allTypeChecked[1] as any).rules).length
    ).toBeGreaterThan(Object.keys((configs.all[1] as any).rules).length);
  });
  test('exports all configurations', () => {
    expect(Object.keys(configs).length).toBe(9);
  });
});
