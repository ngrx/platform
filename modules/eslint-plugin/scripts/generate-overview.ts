import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { format, resolveConfig } from 'prettier';
import {
  configsForGenerate,
  rulesForGenerate,
} from '../src/utils/helper-functions/rules';

const prettierConfig = resolveConfig.sync(__dirname);
const OVERVIEW = './projects/ngrx.io/content/guide/eslint-plugin/index.md';
const GH_CONFIGS =
  'https://github.com/ngrx/platform/blob/main/modules/eslint-plugin/src/configs';

generateRules();
generateConfigurations();

function generateRules() {
  const moduleRules = Object.entries(rulesForGenerate).reduce<
    Record<string, string[][]>
  >((all, [ruleName, { meta }]) => {
    all[meta.ngrxModule] = (all[meta.ngrxModule] ?? []).concat([
      [
        `[@ngrx/${ruleName}]${
          meta.docs?.url
            ? '(' +
              meta.docs.url.replace('https://ngrx.io', '').replace('.md', '') +
              ')'
            : ''
        }`,
        meta.docs?.description ?? 'TODO',
        meta.type,
        meta.fixable ? 'Yes' : 'No',
        meta.hasSuggestions ? 'Yes' : 'No',
        Array.isArray(meta.schema) && meta.schema.length ? 'Yes' : 'No',
        meta.docs?.requiresTypeChecking ? 'Yes' : 'No',
      ],
    ]);
    return all;
  }, {});

  const tableHeader = `| Name | Description | Category | Fixable | Has suggestions | Configurable | Requires type information
| --- | --- | --- | --- | --- | --- | --- |`;

  const configTable = Object.entries(moduleRules).map(
    ([ngrxModule, pluginRules]) => {
      const tableBody = pluginRules
        .map((rule) => `|${rule.join('|')}|`)
        .join(EOL);
      const table = [tableHeader, tableBody].join(EOL);

      return [`### ${ngrxModule}`, table].join(EOL);
    }
  );

  const overview = readFileSync(OVERVIEW, 'utf-8');
  const start = overview.indexOf('<!-- RULES-CONFIG:START -->');
  const end = overview.indexOf('<!-- RULES-CONFIG:END -->');

  const newOverview = format(
    `${overview.substring(0, start + '<!-- RULES-CONFIG:START -->'.length)}
${configTable.join(EOL)}
${overview.substring(end)}`,
    {
      parser: 'markdown',
      ...prettierConfig,
    }
  );

  writeFileSync(OVERVIEW, newOverview);
}

function generateConfigurations() {
  const tableHeader = `| Name |
  | --- |`;

  const overview = readFileSync(OVERVIEW, 'utf-8');
  const start = overview.indexOf('<!-- CONFIGURATIONS-CONFIG:START -->');
  const end = overview.indexOf('<!-- CONFIGURATIONS-CONFIG:END -->');

  const configTable = configsForGenerate.map(
    (configName) => `| [${configName}](${GH_CONFIGS}/${configName}.json) |`
  );
  const newOverview = format(
    `${overview.substring(
      0,
      start + '<!-- CONFIGURATIONS-CONFIG:START -->'.length
    )}
  ${[tableHeader, ...configTable].join(EOL)}
  ${overview.substring(end)}`,
    {
      parser: 'markdown',
      ...prettierConfig,
    }
  );

  writeFileSync(OVERVIEW, newOverview);
}
