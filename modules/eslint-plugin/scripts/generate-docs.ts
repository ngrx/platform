import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { format, resolveConfig } from 'prettier';
import { rules } from '../src/rules';

const prettierConfig = resolveConfig.sync(__dirname);
const placeholder = '<!-- MANUAL-DOC:START -->';

for (const [ruleName, { meta }] of Object.entries(rules)) {
  const docPath = path.join('docs', 'rules', `${ruleName}.md`);
  const doc = readFileSync(docPath, 'utf-8');
  const docContent = doc.substr(doc.indexOf(placeholder) + placeholder.length);
  const frontMatter = [
    `Fixable: ${meta.fixable ? 'yes' : 'no'}`,
    meta.version ? `Required NgRx Version Range: ${meta.version}` : '',
  ];
  const newDoc = format(
    `---
${frontMatter.filter(Boolean).join('\n')}
---
# ${ruleName}

> ${meta.docs?.description}

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

${docContent}`,
    {
      parser: 'markdown',
      ...prettierConfig,
    }
  );

  writeFileSync(docPath, newDoc);
}
