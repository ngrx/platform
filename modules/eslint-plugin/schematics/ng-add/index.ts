import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import stripJsonComments from 'strip-json-comments';
import type { Schema } from './schema';
import * as ts from 'typescript';

export default function addNgRxESLintPlugin(schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const jsonConfigPath = '.eslintrc.json';
    const flatConfigPath = 'eslint.config.js';
    const docs = 'https://ngrx.io/guide/eslint-plugin';

    if (host.exists(flatConfigPath)) {
      updateFlatConfig(host, context, flatConfigPath, schema, docs);
      return host;
    }

    if (!host.exists(jsonConfigPath)) {
      context.logger.warn(`
Could not find an ESLint config at \`${flatConfigPath}\` or \`${jsonConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.
      `);
      return host;
    }

    updateJsonConfig(host, context, jsonConfigPath, schema, docs);
    return host;
  };
}

/**
 * Updates a flat ESLint config file (e.g. eslint.config.js).
 *
 * It first adds the proper import for the NgRx plugin (CommonJS or ES module),
 * then it checks for a tseslint.config() call. If found, it uses the TypeScript AST to update it;
 * otherwise, it falls back to updating exported config arrays via regex.
 */
function updateFlatConfig(
  host: Tree,
  context: SchematicContext,
  flatConfigPath: string,
  schema: Schema,
  docs: string,
): void {
  let content = host.read(flatConfigPath)?.toString('utf-8');
  if (!content) {
    context.logger.warn(`Could not read the ESLint flat config at \`${flatConfigPath}\`.`);
    return;
  }

  // Add the NgRx plugin import if missing.
  if (
    !content.includes("from '@ngrx/eslint-plugin'") &&
    !content.includes("require('@ngrx/eslint-plugin')")
  ) {
    const useCommonJS = content.includes("require(");
    const importStatement = useCommonJS
      ? `const ngrx = require("@ngrx/eslint-plugin");\n`
      : `import ngrxEslintPlugin from '@ngrx/eslint-plugin';\n`;
    content = importStatement + content;
  }

  // NgRx configuration snippet (as a string) for regex-based updates.
  const ngrxConfig = `
{
  files: ['*.ts'],
  extends: [\`plugin:@ngrx/${schema.config}\`],
},`;

  // Prefer AST-based update if using tseslint.config(…)
  if (content.includes('tseslint.config(')) {
    content = updateTsEslintConfigCall(content, schema, context);
  } else if (!content.includes('plugin:@ngrx')) {
    // Fallback: update exported arrays using regex.
    const exportDefaultRegex = /export\s+default\s+\[([\s\S]*?)\];/;
    const moduleExportsRegex = /module\.exports\s*=\s*\[([\s\S]*?)\];?/;
    if (exportDefaultRegex.test(content)) {
      const match = content.match(exportDefaultRegex);
      if (match) {
        const existingConfigs = match[1].trim();
        const newConfigs = existingConfigs
          ? `${existingConfigs},\n${ngrxConfig}`
          : ngrxConfig;
        content = content.replace(
          exportDefaultRegex,
          `export default [\n${newConfigs}\n];`
        );
      }
    } else if (moduleExportsRegex.test(content)) {
      const match = content.match(moduleExportsRegex);
      if (match) {
        const existingConfigs = match[1].trim();
        const newConfigs = existingConfigs
          ? `${existingConfigs},\n${ngrxConfig}`
          : ngrxConfig;
        content = content.replace(
          moduleExportsRegex,
          `module.exports = [\n${newConfigs}\n];`
        );
      } else {
        // Append a new export if no array is found.
        content += `\nexport default [${ngrxConfig}\n];`;
      }
    }
  }

  host.overwrite(flatConfigPath, content);
  context.logger.info(`
The NgRx ESLint Plugin is installed and configured with the '${schema.config}' config in your flat config.
See ${docs} for more details.
  `);
}

/**
 * Uses the TypeScript AST to update a tseslint.config() call.
 *
 * It finds the call expression where the callee is "tseslint.config" and whose first argument is an array.
 * If that array does not already contain an object configuring the NgRx plugin, it appends one.
 *
 * @param content The original file content.
 * @param schema The provided schema (contains the config name).
 * @param context The schematic context (used for logging).
 * @returns The updated file content.
 */
function updateTsEslintConfigCall(content: string, schema: Schema, context: SchematicContext): string {
  const sourceFile = ts.createSourceFile(
    'eslint.config.js',
    content,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.JS
  );

  let updated = false;

  // Define a minimal transformation context first.
  const transformationContext: ts.TransformationContext = {
    enableSubstitution() {},
    enableEmitNotification() {},
    endLexicalEnvironment() { return []; },
    hoistFunctionDeclaration() {},
    hoistVariableDeclaration() {},
    isEmitNotificationEnabled: () => false,
    isSubstitutionEnabled: () => false,
    onEmitNode: (_: any, node: any) => node,
    onSubstituteNode: (_: any, node: any) => node,
    readEmitHelpers: () => undefined,
    requestEmitHelper() {},
    resumeLexicalEnvironment() {},
    startLexicalEnvironment() {},
    suspendLexicalEnvironment() {},
    factory: ts.factory,
    getCompilerOptions: () => ({} as ts.CompilerOptions),
  };

  // Visitor function: find tseslint.config() and update its array argument.
  function visitor(node: ts.Node): ts.Node {
    if (ts.isCallExpression(node)) {
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === 'config' &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === 'tseslint'
      ) {
        // Found tseslint.config( ... )
        if (node.arguments.length > 0 && ts.isArrayLiteralExpression(node.arguments[0])) {
          const arrayLiteral = node.arguments[0];

          // Check if any element already configures the NgRx plugin.
          const hasNgrx = arrayLiteral.elements.some(elem => {
            if (ts.isObjectLiteralExpression(elem)) {
              return elem.properties.some(prop => {
                if (
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === 'extends'
                ) {
                  if (ts.isStringLiteral(prop.initializer)) {
                    return prop.initializer.text.startsWith('plugin:@ngrx');
                  } else if (ts.isArrayLiteralExpression(prop.initializer)) {
                    return prop.initializer.elements.some(el =>
                      ts.isStringLiteral(el) && el.text.startsWith('plugin:@ngrx')
                    );
                  }
                }
                return false;
              });
            }
            return false;
          });

          if (!hasNgrx) {
            // Create a new configuration object: { files: ['*.ts'], extends: [`plugin:@ngrx/<config>`] }
            const newObject = ts.factory.createObjectLiteralExpression(
              [
                ts.factory.createPropertyAssignment(
                  ts.factory.createIdentifier('files'),
                  ts.factory.createArrayLiteralExpression([
                    ts.factory.createStringLiteral('*.ts')
                  ])
                ),
                ts.factory.createPropertyAssignment(
                  ts.factory.createIdentifier('extends'),
                  ts.factory.createArrayLiteralExpression([
                    ts.factory.createNoSubstitutionTemplateLiteral(`plugin:@ngrx/${schema.config}`)
                  ])
                )
              ],
              true
            );

            // Append the new object to the array.
            const newElements = ts.factory.createNodeArray([...arrayLiteral.elements, newObject]);
            const newArrayLiteral = ts.factory.updateArrayLiteralExpression(arrayLiteral, newElements);
            const newArgs = [newArrayLiteral, ...node.arguments.slice(1)];
            updated = true;
            return ts.factory.updateCallExpression(node, node.expression, node.typeArguments, newArgs);
          }
        }
      }
    }
    return ts.visitEachChild(node, visitor, transformationContext);
  }

  const transformed = ts.visitNode(sourceFile, visitor);
  if (updated) {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const newContent = printer.printFile(transformed as ts.SourceFile);
    context.logger.info('Updated tseslint.config() call with NgRx config.');
    return newContent;
  }
  return content;
}

/**
 * Updates a JSON ESLint config (e.g. .eslintrc.json).
 *
 * It either adds a new override for the NgRx plugin or appends to an existing list.
 */
function updateJsonConfig(
  host: Tree,
  context: SchematicContext,
  jsonConfigPath: string,
  schema: Schema,
  docs: string,
): void {
  const eslint = host.read(jsonConfigPath)?.toString('utf-8');
  if (!eslint) {
    context.logger.warn(`
Could not read the ESLint config at \`${jsonConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.
    `);
    return;
  }

  try {
    const json = JSON.parse(stripJsonComments(eslint));
    if (json.overrides) {
      if (
        !json.overrides.some((override: any) =>
          override.extends?.some((extend: any) => extend.startsWith('plugin:@ngrx'))
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
  } catch (err) {
    const detailsContent =
      err instanceof Error
        ? `\nDetails:\n${err.message}\n`
        : '';
    context.logger.warn(`
Something went wrong while adding the NgRx ESLint Plugin.
The NgRx ESLint Plugin is installed but not configured.
Please see ${docs} to configure the NgRx ESLint Plugin.
${detailsContent}
    `);
  }
}

/**
 * Returns the configuration object to add for the JSON ESLint config.
 */
function configurePlugin(config: Schema['config']): Record<string, unknown> {
  return {
    files: ['*.ts'],
    extends: [`plugin:@ngrx/${config}`],
  };
}

