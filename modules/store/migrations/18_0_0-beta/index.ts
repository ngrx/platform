import * as ts from 'typescript';
import {
  Tree,
  Rule,
  chain,
  SchematicContext,
} from '@angular-devkit/schematics';
import {
  Change,
  commitChanges,
  createReplaceChange,
  InsertChange,
  visitTSSourceFiles,
} from '../../schematics-core';
import { createRemoveChange } from '../../schematics-core/utility/change';

const storeModelsPath = '@ngrx/store/src/models';
const filesWithChanges: string[] = [];

export function migrateStoreTypedAction(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: Change[] = [];

      const importDeclarations = new Array<ts.ImportDeclaration>();
      getImportDeclarations(sourceFile, importDeclarations);

      const storeModelsImportsAndDeclaration = importDeclarations
        .map((storeModelsImportDeclaration) => {
          const storeModelsImports = getStoreModelsNamedBindings(
            storeModelsImportDeclaration
          );
          if (storeModelsImports) {
            return { storeModelsImports, storeModelsImportDeclaration };
          } else {
            return undefined;
          }
        })
        .find(Boolean);

      if (!storeModelsImportsAndDeclaration) {
        return;
      }

      const { storeModelsImports, storeModelsImportDeclaration } =
        storeModelsImportsAndDeclaration;

      const storeImportDeclaration = importDeclarations.find(
        (node) =>
          node.moduleSpecifier.getText().includes('@ngrx/store') &&
          !node.moduleSpecifier.getText().includes('@ngrx/store/')
      );

      const otherStoreModelImports = storeModelsImports.elements
        .filter((element) => element.name.getText() !== 'TypedAction')
        .map((element) => element.name.getText())
        .join(', ');

      // Remove `TypedAction` from @ngrx/store/src/models and leave the other imports
      if (otherStoreModelImports) {
        changes.push(
          createReplaceChange(
            sourceFile,
            storeModelsImportDeclaration,
            storeModelsImportDeclaration.getText(),
            `import { ${otherStoreModelImports} } from '${storeModelsPath}';`
          )
        );
      }
      // Remove complete import because it's empty
      else {
        changes.push(
          createRemoveChange(
            sourceFile,
            storeModelsImportDeclaration,
            storeModelsImportDeclaration.getStart(),
            storeModelsImportDeclaration.getEnd() + 1
          )
        );
      }

      let importAppendedInExistingDeclaration = false;
      if (storeImportDeclaration?.importClause?.namedBindings) {
        const bindings = storeImportDeclaration.importClause.namedBindings;
        if (ts.isNamedImports(bindings)) {
          // Add import to existing @ngrx/operators
          const updatedImports = new Set([
            ...bindings.elements.map((element) => element.name.getText()),
            'Action',
          ]);
          const importStatement = `import { ${[...updatedImports].join(
            ', '
          )} } from '@ngrx/store';`;
          changes.push(
            createReplaceChange(
              sourceFile,
              storeImportDeclaration,
              storeImportDeclaration.getText(),
              importStatement
            )
          );
          importAppendedInExistingDeclaration = true;
        }
      }

      if (!importAppendedInExistingDeclaration) {
        // Add new @ngrx/operators import line
        const importStatement = `import { Action } from '@ngrx/store';`;
        changes.push(
          new InsertChange(
            sourceFile.fileName,
            storeModelsImportDeclaration.getEnd() + 1,
            `${importStatement}\n`
          )
        );
      }

      commitChanges(tree, sourceFile.fileName, changes);

      if (changes.length) {
        filesWithChanges.push(sourceFile.fileName);
        ctx.logger.info(
          `[@ngrx/store] ${sourceFile.fileName}: Replaced TypedAction to Action`
        );
      }
    });
  };
}

export function migrateStoreTypedActionReferences(): Rule {
  return (tree: Tree, _ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      if (!filesWithChanges.includes(sourceFile.fileName)) {
        return;
      }
      const changes: Change[] = [];
      const typedActionIdentifiers = new Array<ts.Identifier>();
      getTypedActionUsages(sourceFile, typedActionIdentifiers);

      typedActionIdentifiers.forEach((identifier) => {
        changes.push(
          createReplaceChange(
            sourceFile,
            identifier,
            identifier.getText(),
            'Action'
          )
        );
      });
      commitChanges(tree, sourceFile.fileName, changes);
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

function getTypedActionUsages(
  node: ts.Node,
  nodeIdentifiers: ts.Identifier[]
): void {
  if (ts.isIdentifier(node) && node.getText() === 'TypedAction') {
    nodeIdentifiers.push(node);
  }

  ts.forEachChild(node, (childNode) =>
    getTypedActionUsages(childNode, nodeIdentifiers)
  );
}

function getStoreModelsNamedBindings(
  node: ts.ImportDeclaration
): ts.NamedImports | null {
  const namedBindings = node?.importClause?.namedBindings;
  if (
    node.moduleSpecifier.getText().includes(storeModelsPath) &&
    namedBindings &&
    ts.isNamedImports(namedBindings)
  ) {
    return namedBindings;
  }

  return null;
}

export default function (): Rule {
  return chain([
    migrateStoreTypedAction(),
    migrateStoreTypedActionReferences(),
  ]);
}
