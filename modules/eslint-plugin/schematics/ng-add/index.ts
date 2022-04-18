import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import stripJsonComments from 'strip-json-comments';
import type { Schema } from './schema';

export default function addNgRxESLintPlugin(schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const eslintConfigPath = '.eslintrc.json';
    const docs = 'https://ngrx.io/guide/eslint-plugin';

    const eslint = host.read(eslintConfigPath)?.toString('utf-8');
    if (!eslint) {
      context.logger.warn(`
Could not find the ESLint config at \`${eslintConfigPath}\`.
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

      host.overwrite(eslintConfigPath, JSON.stringify(json, null, 2));

      context.logger.info(`
  The NgRx ESLint Plugin is installed and configured with the '${schema.config}' config.

  If you want to change the configuration, please see ${docs}.
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
  };
  function configurePlugin(config: Schema['config']): Record<string, unknown> {
    return {
      files: ['*.ts'],
      extends: [`plugin:@ngrx/${config}`],
    };
  }
}
