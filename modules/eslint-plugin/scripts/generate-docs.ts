import { readFileSync, writeFileSync, existsSync } from 'fs';
import * as path from 'path';
import { format, resolveConfig } from 'prettier';
import { rulesForGenerate } from '../src/utils/helper-functions/rules';

(async () => {
  const prettierConfig = await resolveConfig(__dirname);
  const PLACEHOLDER = '<!-- MANUAL-DOC:START -->';
  const RULES_PATHS = [
    './projects/ngrx.io/content/guide/eslint-plugin/rules',
    './projects/www/src/app/pages/guide/eslint-plugin/rules',
  ];

  for (const rules of RULES_PATHS) {
    for (const [ruleName, { meta }] of Object.entries(rulesForGenerate)) {
      const docPath = path.join(rules, `${ruleName}.md`);
      if (!existsSync(docPath)) {
        writeFileSync(docPath, ``);
      }
      const doc = readFileSync(docPath, 'utf-8');
      const docContent = doc.substring(
        doc.indexOf(PLACEHOLDER) + PLACEHOLDER.length
      );
      const newDoc = await format(
        `# ${ruleName}

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
  }
})();
