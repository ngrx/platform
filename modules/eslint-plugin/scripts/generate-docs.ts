import { readFileSync, writeFileSync, existsSync } from 'fs';
import * as path from 'path';
import { format, resolveConfig } from 'prettier';
import { rulesForGenerate } from '../src/utils/helper-functions/rules';

const prettierConfig = resolveConfig.sync(__dirname);
const PLACEHOLDER = '<!-- MANUAL-DOC:START -->';
const RULES_PATH = './projects/ngrx.io/content/guide/eslint-plugin/rules';

for (const [ruleName, { meta }] of Object.entries(rulesForGenerate)) {
  const docPath = path.join(RULES_PATH, `${ruleName}.md`);
  if (!existsSync(docPath)) {
    writeFileSync(docPath, ``);
  }
  const doc = readFileSync(docPath, 'utf-8');
  const docContent = doc.substring(
    doc.indexOf(PLACEHOLDER) + PLACEHOLDER.length
  );
  const newDoc = format(
    `# ${ruleName}

${meta.version ? '> Required NgRx Version Range: ${meta.version}' : ''} 

${meta.docs?.description}

- **Type**: ${meta.type}
- **Fixable**: ${meta.fixable ? 'Yes' : 'No'}
- **Suggestion**: ${meta.hasSuggestions ? 'Yes' : 'No'}
- **Requires type checking**: ${meta.docs?.requiresTypeChecking ? 'Yes' : 'No'}
- **Configurable**: ${
      Array.isArray(meta.schema) && meta.schema.length ? 'Yes' : 'No'
    }

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
