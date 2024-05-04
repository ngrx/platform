import * as ts from 'typescript';
import {
  Tree,
  Rule,
  chain,
  SchematicContext,
} from '@angular-devkit/schematics';
import {
  addPackageToPackageJson,
  Change,
  commitChanges,
  createReplaceChange,
  InsertChange,
  visitTSSourceFiles,
} from '../../schematics-core';
import * as os from 'os';

export function migrateConcatLatestFromImport(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    const changes: Change[] = [];
    addPackageToPackageJson(tree, 'dependencies', '@ngrx/operators', '^18.0.0');

    visitTSSourceFiles(tree, (sourceFile) => {
      visitImportDeclarations(sourceFile, (node) => {
        const namedBindings = getEffectsNamedBinding(node);

        if (!namedBindings) {
          return;
        }

        const otherImports = namedBindings.elements
          .filter((element) => element.name.getText() !== 'concatLatestFrom')
          .map((element) => element.name.getText())
          .join(', ');

        namedBindings.elements.forEach((element) => {
          if (element.name.getText() === 'concatLatestFrom') {
            const originalImport = node.getText();
            const newEffectsImport = `import { ${otherImports} } from '@ngrx/effects';`;
            const newOperatorsImport = `import { concatLatestFrom } from '@ngrx/operators';`;

            // Replace the original import with the new import from '@ngrx/effects'
            if (otherImports) {
              changes.push(
                createReplaceChange(
                  sourceFile,
                  node,
                  originalImport,
                  newEffectsImport
                ),
                new InsertChange(
                  sourceFile.fileName,
                  node.getEnd() + 1,
                  `${newOperatorsImport}${os.EOL}`
                )
              );
            } else {
              changes.push(
                createReplaceChange(
                  sourceFile,
                  node,
                  node.getText(),
                  `import { concatLatestFrom } from '@ngrx/operators';`
                )
              );
            }
          }
        });
      });

      commitChanges(tree, sourceFile.fileName, changes);

      if (changes.length) {
        ctx.logger.info(
          `[@ngrx/effects] Updated concatLatestFrom to import from '@ngrx/operators'`
        );
      }
    });
  };
}

function visitImportDeclarations(
  node: ts.Node,
  visitor: (node: ts.ImportDeclaration) => void
) {
  if (ts.isImportDeclaration(node)) {
    visitor(node);
  }

  ts.forEachChild(node, (childNode) =>
    visitImportDeclarations(childNode, visitor)
  );
}

function getEffectsNamedBinding(
  node: ts.ImportDeclaration
): ts.NamedImports | null {
  const namedBindings = node?.importClause?.namedBindings;
  if (
    node.moduleSpecifier.getText().includes('@ngrx/effects') &&
    namedBindings &&
    ts.isNamedImports(namedBindings)
  ) {
    return namedBindings;
  }

  return null;
}

export default function (): Rule {
  return chain([migrateConcatLatestFromImport()]);
}
