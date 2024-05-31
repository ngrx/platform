import { NgRxRuleModule } from '../../rule-creator';
import { traverseFolder } from './folder';
import { NGRX_MODULE } from './ngrx-modules';
import * as path from 'path';

const interopRequireDefault = (obj: any): { default: unknown } =>
  obj && obj.__esModule ? obj : { default: obj };

const importDefault = (moduleName: string) =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  interopRequireDefault(require(moduleName)).default;

const rulesDir = path.join(__dirname, '../../rules');
const configsDir = path.join(__dirname, '../../configs');
const excludedFiles = ['index'];

export const rulesForGenerate = Array.from(traverseFolder(rulesDir, ['.ts']))
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

export const configsForGenerate = Array.from(
  traverseFolder(configsDir, ['.json'])
).map((config) => config.file);
