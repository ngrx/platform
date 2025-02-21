import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import stripJsonComments from 'strip-json-comments';
import type { Schema } from './schema';
import * as ts from 'typescript';

export default function addNgRxESLintPlugin(schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const possibleFlatConfigPaths = [
      'eslint.config.js',
      'eslint.config.mjs',
      'eslint.config.cjs',
    ];
    const jsonConfigPath = '.eslintrc.json';
    const flatConfigPath = possibleFlatConfigPaths.find((path) => host.exists(path));
    const docs = 'https://ngrx.io/guide/eslint-plugin';

    if (flatConfigPath) {
      updateFlatConfig(host, context, flatConfigPath, schema, docs);
      return host;
    }

    if (!host.exists(jsonConfigPath)) {
      context.logger.warn(`
Could not find an ESLint config at any of ${possibleFlatConfigPaths.join(', ')} or \`${jsonConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.
      `);
      return host;
    }

    updateJsonConfig(host, context, jsonConfigPath, schema, docs);
    return host;
  };
}

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

  // Add the NgRx plugin import if missing
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

  // Attempt AST-based update for tseslint.config()
  if (content.includes('tseslint.config(')) {
    const updatedContent = updateTsEslintConfigCall(content, schema, context);
    if (updatedContent !== content) {
      host.overwrite(flatConfigPath, updatedContent);
      context.logger.info(`
The NgRx ESLint Plugin is installed and configured with the '${schema.config}' config in your flat config.
See ${docs} for more details.
      `);
      return;
    }
  }

  // Warn if configuration wasn't updated
  context.logger.warn(`
The NgRx ESLint Plugin is installed, but we couldn't automatically configure it.
Your ESLint config uses a format that isn't currently supported by this schematic.

Please manually add the NgRx ESLint Plugin configuration to your \`${flatConfigPath}\`.
See ${docs} for setup instructions.
  `);
}

function updateTsEslintConfigCall(
  content: string,
  schema: Schema,
  context: SchematicContext,
): string {
  const sourceFile = ts.createSourceFile(
    'eslint.config.js',
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );

  let updated = false;
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

  function visitor(node: ts.Node): ts.Node {
    if (ts.isCallExpression(node)) {
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === 'config' &&
        ts.isIdentifier(node.expression.expression) &&
        node.expression.expression.text === 'tseslint'
      ) {
        if (node.arguments.length > 0 && ts.isArrayLiteralExpression(node.arguments[0])) {
          const arrayLiteral = node.arguments[0];
          const hasNgrx = arrayLiteral.elements.some((elem) => {
            if (ts.isObjectLiteralExpression(elem)) {
              return elem.properties.some((prop) => {
                if (
                  ts.isPropertyAssignment(prop) &&
                  ts.isIdentifier(prop.name) &&
                  prop.name.text === 'extends'
                ) {
                  if (ts.isStringLiteral(prop.initializer)) {
                    return prop.initializer.text.startsWith('plugin:@ngrx');
                  }
                  if (ts.isArrayLiteralExpression(prop.initializer)) {
                    return prop.initializer.elements.some(
                      (el) => ts.isStringLiteral(el) && el.text.startsWith('plugin:@ngrx'),
                    );
                  }
                }
                return false;
              });
            }
            return false;
          });

          if (!hasNgrx) {
            const newObject = ts.factory.createObjectLiteralExpression(
              [
                ts.factory.createPropertyAssignment(
                  ts.factory.createIdentifier('files'),
                  ts.factory.createArrayLiteralExpression([
                    ts.factory.createStringLiteral('*.ts'),
                  ]),
                ),
                ts.factory.createPropertyAssignment(
                  ts.factory.createIdentifier('extends'),
                  ts.factory.createArrayLiteralExpression([
                    ts.factory.createNoSubstitutionTemplateLiteral(
                      `plugin:@ngrx/${schema.config}`,
                    ),
                  ]),
                ),
              ],
              true,
            );

            const newElements = ts.factory.createNodeArray([
              ...arrayLiteral.elements,
              newObject,
            ]);
            const newArrayLiteral = ts.factory.updateArrayLiteralExpression(
              arrayLiteral,
              newElements,
            );
            const newArgs = [newArrayLiteral, ...node.arguments.slice(1)];
            updated = true;
            return ts.factory.updateCallExpression(
              node,
              node.expression,
              node.typeArguments,
              newArgs,
            );
          }
        }
      }
    }
    return ts.visitEachChild(node, visitor, transformationContext);
  }

  const transformed = ts.visitNode(sourceFile, visitor);
  if (updated) {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    return printer.printFile(transformed as ts.SourceFile);
  }
  return content;
}

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
      ))
       {
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
    const detailsContent = err instanceof Error ? `\nDetails:\n${err.message}\n` : '';
    context.logger.warn(`
Something went wrong while adding the NgRx ESLint Plugin.
The NgRx ESLint Plugin is installed but not configured.
Please see ${docs} to configure the NgRx ESLint Plugin.
${detailsContent}
    `);
  }
}

function configurePlugin(config: Schema['config']): Record<string, unknown> {
  return {
    files: ['*.ts'],
    extends: [`plugin:@ngrx/${config}`],
  };
}
