import * as path from 'path';
import type { NgRxRuleModule } from '../rule-creator';
import type { NGRX_MODULE } from '../utils';
import { traverseFolder } from '../utils';

// Copied from https://github.com/jest-community/eslint-plugin-jest/blob/main/src/index.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interopRequireDefault = (obj: any): { default: unknown } =>
  obj?.__esModule ? obj : { default: obj };

const importDefault = (moduleName: string) =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  interopRequireDefault(require(moduleName)).default;

const rulesDir = __dirname;
const excludedFiles = ['index'];

export const rules = Array.from(traverseFolder(rulesDir))
  .filter((rule) => !excludedFiles.includes(rule.file))
  .reduce<Record<string, NgRxRuleModule<[], string>>>((allRules, rule) => {
    const ruleModule = importDefault(rule.path) as NgRxRuleModule<[], string>;
    ruleModule.meta.ngrxModule = path.basename(
      path.dirname(rule.path)
    ) as NGRX_MODULE;
    return {
      ...allRules,
      [rule.file]: ruleModule,
    };
  }, {});
