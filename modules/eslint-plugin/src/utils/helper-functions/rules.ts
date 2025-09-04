import { traverseFolder } from './folder';
import { NGRX_MODULE } from './ngrx-modules';
import * as path from 'path';
import { NgRxRule } from '../../rule-creator';

const interopRequireDefault = (obj: any): { default: unknown } =>
  obj && obj.__esModule ? obj : { default: obj };

const importDefault = (moduleName: string) =>
  interopRequireDefault(require(moduleName)).default;

const rulesDir = path.join(__dirname, '../../rules');
const configsDir = path.join(__dirname, '../../configs');
const excludedFiles = ['index'];

export const rulesForGenerate = Array.from(traverseFolder(rulesDir, ['.ts']))
  .filter((rule) => !excludedFiles.includes(rule.file))
  .reduce<Record<string, NgRxRule>>((allRules, rule) => {
    const ruleModule = importDefault(rule.path) as NgRxRule;
    if (!ruleModule.meta.docs) {
      throw new Error(`Rule ${rule.file} is missing meta.docs information`);
    }
    ruleModule.meta.docs.ngrxModule = path.basename(
      path.dirname(rule.path)
    ) as NGRX_MODULE;
    return {
      ...allRules,
      [rule.file]: ruleModule,
    };
  }, {});

export const configsForGenerate = Array.from(
  traverseFolder(configsDir, ['.json'])
).map((config) => config.file);
