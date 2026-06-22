import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import type { Schema } from './schema';

export const possibleFlatConfigPaths = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
];

export default function (schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const flatConfigPath = possibleFlatConfigPaths.find((path) =>
      host.exists(path)
    );
    const docs = 'https://ngrx.io/guide/eslint-plugin';

    if (flatConfigPath) {
      updateFlatConfig(host, context, flatConfigPath, schema, docs);
      return host;
    }

    context.logger.warn(`
Could not find an ESLint config at any of ${possibleFlatConfigPaths.join(', ')}.
The NgRx ESLint Plugin is installed but not configured.
Please see ${docs} to configure the NgRx ESLint Plugin.
      `);
    return host;
  };
}

function updateFlatConfig(
  host: Tree,
  context: SchematicContext,
  flatConfigPath: string,
  schema: Schema,
  docs: string
): void {
  const ngrxPlugin = '@ngrx/eslint-plugin';
  const content = host.read(flatConfigPath)?.toString('utf-8');
  if (!content) {
    context.logger.error(
      `Could not read the ESLint flat config at \`${flatConfigPath}\`.`
    );
    return;
  }
  const configContent = content;

  if (configContent.includes(ngrxPlugin)) {
    context.logger.info(
      `Skipping installation, the NgRx ESLint Plugin is already installed in your flat config.`
    );
    return;
  }

  if (!configContent.includes('tseslint.config')) {
    context.logger.warn(
      `No tseslint found, skipping the installation of the NgRx ESLint Plugin in your flat config.`
    );
    return;
  }

  const source = ts.createSourceFile(
    flatConfigPath,
    configContent,
    ts.ScriptTarget.Latest,
    true
  );

  const recorder = host.beginUpdate(flatConfigPath);
  addImport();
  addNgRxPlugin();

  host.commitUpdate(recorder);
  context.logger.info(`
The NgRx ESLint Plugin is installed and configured using the '${schema.config}' configuration in your flat config.
See ${docs} for more details.
  `);

  function addImport() {
    const isESM = configContent.includes('export default');
    if (isESM) {
      const lastImport = source.statements
        .filter((statement) => ts.isImportDeclaration(statement))
        .reverse()[0];
      recorder.insertRight(
        lastImport?.end ?? 0,
        `\nimport ngrx from '${ngrxPlugin}';`
      );
    } else {
      const lastRequireVariableDeclaration = source.statements
        .filter((statement) => {
          if (!ts.isVariableStatement(statement)) return false;
          const decl = statement.declarationList.declarations[0];
          if (!decl.initializer) return false;
          return (
            ts.isCallExpression(decl.initializer) &&
            decl.initializer.expression.getText() === 'require'
          );
        })
        .reverse()[0];

      recorder.insertRight(
        lastRequireVariableDeclaration?.end ?? 0,
        `\nconst ngrx = require('${ngrxPlugin}');`
      );
    }
  }

  function addNgRxPlugin() {
    let tseslintConfigCall: ts.CallExpression | null = null;
    function findTsEslintConfigCalls(node: ts.Node) {
      if (tseslintConfigCall) {
        return;
      }

      if (
        ts.isCallExpression(node) &&
        node.expression.getText() === 'tseslint.config'
      ) {
        tseslintConfigCall = node;
      }
      ts.forEachChild(node, findTsEslintConfigCalls);
    }
    findTsEslintConfigCalls(source);

    if (tseslintConfigCall) {
      tseslintConfigCall = tseslintConfigCall as ts.CallExpression;
      const lastArgument =
        tseslintConfigCall.arguments[tseslintConfigCall.arguments.length - 1];
      const plugin = `  {
    files: ['**/*.ts'],
    extends: [
      ...ngrx.configs.${schema.config},
    ],
    rules: {},
  }`;

      if (lastArgument) {
        recorder.remove(lastArgument.pos, lastArgument.end - lastArgument.pos);
        recorder.insertRight(
          lastArgument.pos,
          `${lastArgument.getFullText()},\n${plugin}`
        );
      } else {
        recorder.insertRight(tseslintConfigCall.end - 1, `\n${plugin}\n`);
      }
    }
  }
}
