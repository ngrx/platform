import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

const OLD_IMPORT = '@ngrx/eslint-plugin/v9';
const NEW_IMPORT = '@ngrx/eslint-plugin';
const SUPPORTED_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
];

export default function renameEslintPluginV9Imports(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    tree.visit((filePath) => {
      if (isInNodeModules(filePath) || !shouldMigrate(filePath)) {
        return;
      }

      const content = tree.read(filePath)?.toString('utf-8');
      if (!content?.includes(OLD_IMPORT)) {
        return;
      }

      tree.overwrite(filePath, content.replaceAll(OLD_IMPORT, NEW_IMPORT));
      context.logger.info(
        `[@ngrx/eslint-plugin] Renamed '${OLD_IMPORT}' to '${NEW_IMPORT}' in ${formatPath(filePath)}`
      );
    });
  };
}

function shouldMigrate(filePath: string): boolean {
  return SUPPORTED_EXTENSIONS.some((extension) => filePath.endsWith(extension));
}

function isInNodeModules(filePath: string): boolean {
  return filePath.split('/').includes('node_modules');
}

function formatPath(filePath: string): string {
  return filePath.startsWith('/') ? filePath : `/${filePath}`;
}
