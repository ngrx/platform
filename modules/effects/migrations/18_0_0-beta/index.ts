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
import { createRemoveChange } from '../../schematics-core/utility/change';

export function migrateConcatLatestFromImport(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    addPackageToPackageJson(tree, 'dependencies', '@ngrx/operators', '^18.0.0');

    visitTSSourceFiles(tree, (sourceFile) => {
      const importDeclarations = new Array<ts.ImportDeclaration>();

      getImportDeclarations(sourceFile, importDeclarations);

      const effectsImportsAndDeclarations = importDeclarations
        .map((effectsImportDeclaration) => {
          const effectsImports = getEffectsNamedBinding(
            effectsImportDeclaration
          );
          if (effectsImports) {
            if (
              effectsImports.elements.some(
                (element) => element.name.getText() === 'concatLatestFrom'
              )
            ) {
              return { effectsImports, effectsImportDeclaration };
            }
            return undefined;
          } else {
            return undefined;
          }
        })
        .filter(Boolean);

      if (effectsImportsAndDeclarations.length === 0) {
        return;
      } else if (effectsImportsAndDeclarations.length > 1) {
        ctx.logger.info(
          '[@ngrx/effects] Skipping because of multiple `concatLatestFrom` imports'
        );
        return;
      }

      const [effectsImportsAndDeclaration] = effectsImportsAndDeclarations;
      if (!effectsImportsAndDeclaration) {
        return;
      }

      const { effectsImports, effectsImportDeclaration } =
        effectsImportsAndDeclaration;

      const operatorsImportDeclaration = importDeclarations.find((node) =>
        node.moduleSpecifier.getText().includes('@ngrx/operators')
      );

      const otherEffectsImports = effectsImports.elements
        .filter((element) => element.name.getText() !== 'concatLatestFrom')
        .map((element) => element.name.getText())
        .join(', ');

      const changes: Change[] = [];
      // Remove `concatLatestFrom` from @ngrx/effects and leave the other imports
      if (otherEffectsImports) {
        changes.push(
          createReplaceChange(
            sourceFile,
            effectsImportDeclaration,
            effectsImportDeclaration.getText(),
            `import { ${otherEffectsImports} } from '@ngrx/effects';`
          )
        );
      }
      // Remove complete @ngrx/effects import because it contains only `concatLatestFrom`
      else {
        changes.push(
          createRemoveChange(
            sourceFile,
            effectsImportDeclaration,
            effectsImportDeclaration.getStart(),
            effectsImportDeclaration.getEnd() + 1
          )
        );
      }

      let importAppendedInExistingDeclaration = false;
      if (operatorsImportDeclaration?.importClause?.namedBindings) {
        const bindings = operatorsImportDeclaration.importClause.namedBindings;
        if (ts.isNamedImports(bindings)) {
          // Add import to existing @ngrx/operators
          const updatedImports = [
            ...bindings.elements.map((element) => element.name.getText()),
            'concatLatestFrom',
          ];
          const newOperatorsImport = `import { ${updatedImports.join(
            ', '
          )} } from '@ngrx/operators';`;
          changes.push(
            createReplaceChange(
              sourceFile,
              operatorsImportDeclaration,
              operatorsImportDeclaration.getText(),
              newOperatorsImport
            )
          );
          importAppendedInExistingDeclaration = true;
        }
      }

      if (!importAppendedInExistingDeclaration) {
        // Add new @ngrx/operators import line
        const newOperatorsImport = `import { concatLatestFrom } from '@ngrx/operators';`;
        changes.push(
          new InsertChange(
            sourceFile.fileName,
            effectsImportDeclaration.getEnd() + 1,
            `${newOperatorsImport}\n` // not os-independent for snapshot tests
          )
        );
      }

      commitChanges(tree, sourceFile.fileName, changes);

      if (changes.length) {
        ctx.logger.info(
          `[@ngrx/effects] Updated concatLatestFrom to import from '@ngrx/operators'`
        );
      }
    });
  };
}

function getImportDeclarations(
  node: ts.Node,
  imports: ts.ImportDeclaration[]
): void {
  if (ts.isImportDeclaration(node)) {
    imports.push(node);
  }

  ts.forEachChild(node, (childNode) =>
    getImportDeclarations(childNode, imports)
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
