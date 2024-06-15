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
import * as os from 'node:os';

export function migrateTapResponseImport(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    addPackageToPackageJson(tree, 'dependencies', '@ngrx/operators', '^18.0.0');

    visitTSSourceFiles(tree, (sourceFile) => {
      const importDeclarations = new Array<ts.ImportDeclaration>();
      getImportDeclarations(sourceFile, importDeclarations);

      const componentStoreImportsAndDeclarations = importDeclarations
        .map((componentStoreImportDeclaration) => {
          const componentStoreImports = getComponentStoreNamedBinding(
            componentStoreImportDeclaration
          );
          if (componentStoreImports) {
            if (
              componentStoreImports.elements.some(
                (element) => element.name.getText() === 'tapResponse'
              )
            ) {
              return { componentStoreImports, componentStoreImportDeclaration };
            }
            return undefined;
          } else {
            return undefined;
          }
        })
        .filter(Boolean);

      if (componentStoreImportsAndDeclarations.length === 0) {
        return;
      } else if (componentStoreImportsAndDeclarations.length > 1) {
        ctx.logger.warn(
          '[@ngrx/component-store] Skipping because of multiple `tapResponse` imports'
        );
        return;
      }

      const [componentStoreImportsAndDeclaration] =
        componentStoreImportsAndDeclarations;
      if (!componentStoreImportsAndDeclaration) {
        return;
      }
      const { componentStoreImports, componentStoreImportDeclaration } =
        componentStoreImportsAndDeclaration;

      const operatorsImportDeclaration = importDeclarations.find((node) =>
        node.moduleSpecifier.getText().includes('@ngrx/operators')
      );

      const otherComponentStoreImports = componentStoreImports.elements
        .filter((element) => element.name.getText() !== 'tapResponse')
        .map((element) => element.name.getText())
        .join(', ');

      const changes: Change[] = [];
      // Remove `tapResponse` from @ngrx/component-store and leave the other imports
      if (otherComponentStoreImports) {
        changes.push(
          createReplaceChange(
            sourceFile,
            componentStoreImportDeclaration,
            componentStoreImportDeclaration.getText(),
            `import { ${otherComponentStoreImports} } from '@ngrx/component-store';`
          )
        );
      }
      // Remove complete @ngrx/component-store import because it contains only `tapResponse`
      else {
        changes.push(
          createRemoveChange(
            sourceFile,
            componentStoreImportDeclaration,
            componentStoreImportDeclaration.getStart(),
            componentStoreImportDeclaration.getEnd() + 1
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
            'tapResponse',
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
        const newOperatorsImport = `import { tapResponse } from '@ngrx/operators';`;
        changes.push(
          new InsertChange(
            sourceFile.fileName,
            componentStoreImportDeclaration.getEnd() + 1,
            `${newOperatorsImport}${os.EOL}`
          )
        );
      }

      commitChanges(tree, sourceFile.fileName, changes);

      if (changes.length) {
        ctx.logger.info(
          `[@ngrx/component-store] Updated tapResponse to import from '@ngrx/operators'`
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

function getComponentStoreNamedBinding(
  node: ts.ImportDeclaration
): ts.NamedImports | null {
  const namedBindings = node?.importClause?.namedBindings;
  if (
    node.moduleSpecifier.getText().includes('@ngrx/component-store') &&
    namedBindings &&
    ts.isNamedImports(namedBindings)
  ) {
    return namedBindings;
  }

  return null;
}

export default function (): Rule {
  return chain([migrateTapResponseImport()]);
}
