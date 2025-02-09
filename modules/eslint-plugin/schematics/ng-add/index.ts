import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import stripJsonComments from 'strip-json-comments';
import type { Schema } from './schema';

export default function addNgRxESLintPlugin(schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const jsonConfigPath = '.eslintrc.json';
    const flatConfigPath = 'eslint.config.js';
    const docs = 'https://ngrx.io/guide/eslint-plugin';

    // If a flat config exists, update it
    if (host.exists(flatConfigPath)) {
      let content = host.read(flatConfigPath)?.toString('utf-8');
      if (!content) {
        context.logger.warn(`Could not read the ESLint flat config at \`${flatConfigPath}\`.`);
        return host;
      }

      // Add the import for the NgRx ESLint plugin if not already present.
      if (!content.includes("from '@ngrx/eslint-plugin'")) {
        content = `import ngrxEslintPlugin from '@ngrx/eslint-plugin';\n` + content;
      }

      // Create the NgRx configuration to be added.
      // (This mirrors your current JSON override but adapted to flat config syntax.)
      const ngrxConfig = `
{
  files: ['*.ts'],
  extends: [\`plugin:@ngrx/${schema.config}\`],
},`;

      // Check if the flat config already contains an NgRx config.
      if (!content.includes('plugin:@ngrx')) {
        // Look for an exported default array.
        const exportDefaultRegex = /export\s+default\s+\[([\s\S]*?)\];/;
        const match = content.match(exportDefaultRegex);
        if (match) {
          // Append the new configuration object to the existing array.
          const existingConfigs = match[1].trim();
          const newConfigs = existingConfigs
            ? `${existingConfigs},\n${ngrxConfig}`
            : ngrxConfig;
          content = content.replace(
            exportDefaultRegex,
            `export default [\n${newConfigs}\n];`
          );
        } else {
          // If no export default array is found, append one.
          content += `\nexport default [${ngrxConfig}\n];`;
        }
      }

      host.overwrite(flatConfigPath, content);
      context.logger.info(`
The NgRx ESLint Plugin is installed and configured with the '${schema.config}' config in your flat config.
See ${docs} for more details.
      `);
      return host;
    }

    // Fallback to updating the JSON config if no flat config exists.
    if (!host.exists(jsonConfigPath)) {
      context.logger.warn(`
Could not find an ESLint config at \`${flatConfigPath}\` or \`${jsonConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.
      `);
      return host;
    }

    const eslint = host.read(jsonConfigPath)?.toString('utf-8');
    if (!eslint) {
      context.logger.warn(`
Could not read the ESLint config at \`${jsonConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.
      `);
      return host;
    }

    try {
      const json = JSON.parse(stripJsonComments(eslint));
      if (json.overrides) {
        if (
          !json.overrides.some((override: any) =>
            override.extends?.some((extend: any) =>
              extend.startsWith('plugin:@ngrx')
            )
          )
        ) {
          json.overrides.push(configurePlugin(schema.config));
        }
      } else if (
        !json.extends?.some((extend: any) => extend.startsWith('plugin:@ngrx'))
      ) {
        json.overrides = [configurePlugin(schema.config)];
      }

      host.overwrite(jsonConfigPath, JSON.stringify(json, null, 2));

      context.logger.info(`
The NgRx ESLint Plugin is installed and configured with the '${schema.config}' config.

Take a look at the docs at ${docs} if you want to change the default configuration.
      `);
      return host;
    } catch (err) {
      const detailsContent =
        err instanceof Error
          ? `
Details:
${err.message}
`
          : '';
      context.logger.warn(`
Something went wrong while adding the NgRx ESLint Plugin.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.
${detailsContent}
      `);
    }
    return host;
  };

  // Helper function to configure the plugin for JSON config.
  function configurePlugin(config: Schema['config']): Record<string, unknown> {
    return {
      files: ['*.ts'],
      extends: [`plugin:@ngrx/${config}`],
    };
  }
}
