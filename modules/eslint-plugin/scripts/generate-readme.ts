import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { format, resolveConfig } from 'prettier';
import { rules } from '../src/rules';

const prettierConfig = resolveConfig.sync(__dirname);
const moduleRules = Object.entries(rules).reduce<Record<string, string[][]>>(
  (all, [ruleName, { meta }]) => {
    all[meta.ngrxModule] = (all[meta.ngrxModule] ?? []).concat([
      [
        `[ngrx/${ruleName}]${meta.docs?.url ? '(' + meta.docs.url + ')' : ''}`,
        meta.docs?.description ?? 'TODO',
        meta.type,
        `${meta.docs?.recommended}`,
        meta.fixable ? 'Yes' : 'No',
        meta.hasSuggestions ? 'Yes' : 'No',
        meta.schema.length ? 'Yes' : 'No',
        meta.docs?.requiresTypeChecking ? 'Yes' : 'No',
      ],
    ]);
    return all;
  },
  {}
);

const tableHeader = `| Name | Description | Recommended | Category | Fixable | Has suggestions | Configurable | Requires type information
| --- | --- | --- | --- | --- | --- | --- | --- |`;

const config = Object.entries(moduleRules).map(([ngrxModule, pluginRules]) => {
  const tableBody = pluginRules.map((rule) => `|${rule.join('|')}|`).join(EOL);
  const table = [tableHeader, tableBody].join(EOL);

  return [`### ${ngrxModule}`, table].join(EOL);
});

const readme = readFileSync('README.md', 'utf-8');
const start = readme.indexOf('<!-- RULES-CONFIG:START -->');
const end = readme.indexOf('<!-- RULES-CONFIG:END -->');

const newReadme = format(
  `${readme.substring(0, start + '<!-- RULES-CONFIG:START -->'.length)}
${config.join(EOL)}
${readme.substring(end)}`,
  {
    parser: 'markdown',
    ...prettierConfig,
  }
);

writeFileSync('README.md', newReadme);
