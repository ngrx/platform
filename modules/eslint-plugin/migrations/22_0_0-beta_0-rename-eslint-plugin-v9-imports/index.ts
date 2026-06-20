import type { DirEntry } from '@angular-devkit/schematics';
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
    for (const filePath of visitFiles(tree.root)) {
      if (!shouldMigrate(filePath)) {
        continue;
      }

      const content = tree.read(filePath)?.toString('utf-8');
      if (!content?.includes(OLD_IMPORT)) {
        continue;
      }

      tree.overwrite(filePath, content.replaceAll(OLD_IMPORT, NEW_IMPORT));
      context.logger.info(
        `[@ngrx/eslint-plugin] Renamed '${OLD_IMPORT}' to '${NEW_IMPORT}' in ${formatPath(filePath)}`
      );
    }
  };
}

function* visitFiles(directory: DirEntry): Iterable<string> {
  for (const fileName of directory.subfiles) {
    const file = directory.file(fileName);
    if (file) {
      yield file.path;
    }
  }

  for (const directoryName of directory.subdirs) {
    if (directoryName === 'node_modules') {
      continue;
    }

    yield* visitFiles(directory.dir(directoryName));
  }
}

function shouldMigrate(filePath: string): boolean {
  return SUPPORTED_EXTENSIONS.some((extension) => filePath.endsWith(extension));
}

function formatPath(filePath: string): string {
  return filePath.startsWith('/') ? filePath : `/${filePath}`;
}
