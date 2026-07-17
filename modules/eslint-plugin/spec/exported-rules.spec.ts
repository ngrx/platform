import * as path from 'path';
import { traverseFolder } from '../src/utils';
import { configs, rules as exportedRules } from '../src';

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

describe('ESLint flat config', () => {
  test('exports all rules', () => {
    const rules = getAllRules();
    expect(Object.keys(exportedRules).length).toBe(rules.length);
  });
  test('exports all configurations', () => {
    const configFiles = getAllConfigs();
    expect(configFiles.length).toBe(9);
    expect(Object.keys(configs).length).toBe(9);
  });
  test('exports all rules in the all type-checked config', () => {
    const rules = getAllRules();
    expect(Object.keys((configs.allTypeChecked[1] as any).rules).length).toBe(
      rules.length
    );
  });
  test('there is a difference between type-checked rules', () => {
    expect(
      Object.keys((configs.allTypeChecked[1] as any).rules).length
    ).toBeGreaterThan(Object.keys((configs.all[1] as any).rules).length);
  });
});
