import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  Change,
  commitChanges,
  createReplaceChange,
  visitTSSourceFiles,
} from '../../schematics-core';
import {
  visitCallExpression,
  visitImportDeclaration,
  visitImportSpecifier,
  visitTypeLiteral,
  visitTypeReference,
} from '../../schematics-core/utility/visitors';
import * as ts from 'typescript';

function migratedToEntityProps(sourceFile: ts.SourceFile) {
  const changes: Change[] = [];
  visitImportDeclaration(sourceFile, (importDeclaration, moduleName) => {
    if (moduleName !== '@ngrx/signals/entities') {
      return;
    }

    visitImportSpecifier(importDeclaration, (importSpecifier) => {
      if (importSpecifier.name.getText() === 'EntityComputed') {
        changes.push(
          createReplaceChange(
            sourceFile,
            importSpecifier,
            importSpecifier.getText(),
            'EntityProps'
          )
        );

        visitTypeReference(sourceFile, (type) => {
          if (type.typeName.getText() === 'EntityComputed') {
            changes.push(
              createReplaceChange(
                sourceFile,
                type,
                type.typeName.getText(),
                'EntityProps'
              )
            );
          }
        });
      }

      if (importSpecifier.name.getText() === 'NamedEntityComputed') {
        changes.push(
          createReplaceChange(
            sourceFile,
            importSpecifier,
            importSpecifier.getText(),
            'NamedEntityProps'
          )
        );

        visitTypeReference(sourceFile, (typeReference) => {
          if (typeReference.typeName.getText() === 'NamedEntityComputed') {
            changes.push(
              createReplaceChange(
                sourceFile,
                typeReference.typeName,
                typeReference.typeName.getText(),
                'NamedEntityProps'
              )
            );
          }
        });
      }
    });
  });

  return changes;
}

function migrateToPropsInSignalStoreFeatureType(
  sourceFile: ts.SourceFile
): Change[] {
  const changes: Change[] = [];
  visitTypeReference(sourceFile, (typeReference) => {
    if (typeReference.typeName.getText() !== 'SignalStoreFeature') {
      return;
    }

    visitTypeLiteral(typeReference, (typeLiteral) => {
      const typeLiteralChildren = typeLiteral.members;
      for (const propertySignature of typeLiteralChildren) {
        if (ts.isPropertySignature(propertySignature)) {
          if (propertySignature.name.getText() === 'computed') {
            changes.push(
              createReplaceChange(
                sourceFile,
                propertySignature.name,
                'computed',
                'props'
              )
            );
          }
        }
      }
    });
  });

  return changes;
}

function migrateToPropsInSignalStoreFeatureWithObjectLiteral(
  objectLiteral: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile
): Change[] {
  const computedKey = objectLiteral.properties
    .filter(ts.isPropertyAssignment)
    .find((property) => property.name.getText() === 'computed');
  if (computedKey) {
    return [createReplaceChange(sourceFile, computedKey, 'computed', 'props')];
  }

  return [];
}

function migrateToPropsInSignalStoreFeatureWithCallExpression(
  callExpression: ts.CallExpression,
  sourceFile: ts.SourceFile
): Change[] {
  if (callExpression.expression.getText() === 'type') {
    const typeArgument = callExpression.typeArguments?.at(0);

    if (typeArgument && ts.isTypeLiteralNode(typeArgument)) {
      const computedKey = typeArgument.members
        .filter(ts.isPropertySignature)
        .find(
          (propertySignature) => propertySignature.name.getText() === 'computed'
        );

      if (computedKey) {
        return [
          createReplaceChange(sourceFile, computedKey, 'computed', 'props'),
        ];
      }
    }
  }

  return [];
}

function migrateToPropsInSignalStoreFeatureFunction(
  sourceFile: ts.SourceFile
): Change[] {
  const changes: Change[] = [];
  visitCallExpression(sourceFile, (callExpression) => {
    if (callExpression.expression.getText() !== 'signalStoreFeature') {
      return;
    }

    const objectLiteralOrCallExpression = callExpression.arguments[0];
    if (!objectLiteralOrCallExpression) {
      return;
    }

    if (ts.isObjectLiteralExpression(objectLiteralOrCallExpression)) {
      changes.push(
        ...migrateToPropsInSignalStoreFeatureWithObjectLiteral(
          objectLiteralOrCallExpression,
          sourceFile
        )
      );
    } else if (ts.isCallExpression(objectLiteralOrCallExpression)) {
      changes.push(
        ...migrateToPropsInSignalStoreFeatureWithCallExpression(
          objectLiteralOrCallExpression,
          sourceFile
        )
      );
    }
  });

  return changes;
}

export function migrate(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const entityPropsChanges = migratedToEntityProps(sourceFile);
      const propsInSignalStoreFeatureTypeChanges =
        migrateToPropsInSignalStoreFeatureType(sourceFile);
      const propsInSignalStoreFeatureFunctionChanges =
        migrateToPropsInSignalStoreFeatureFunction(sourceFile);
      const changes = [
        ...entityPropsChanges,
        ...propsInSignalStoreFeatureTypeChanges,
        ...propsInSignalStoreFeatureFunctionChanges,
      ];

      commitChanges(tree, sourceFile.fileName, changes);

      if (entityPropsChanges.length) {
        ctx.logger.info(
          `[@ngrx/signals] Renamed '(Named)EntityComputed' to '(Named)EntityProps' in ${sourceFile.fileName}`
        );
      }
      if (propsInSignalStoreFeatureTypeChanges.length) {
        ctx.logger.info(
          `[@ngrx/signals] Renamed 'computed' to 'props' in SignalStoreFeature<> in ${sourceFile.fileName}`
        );
      }
      if (propsInSignalStoreFeatureFunctionChanges.length) {
        ctx.logger.info(
          `[@ngrx/signals] Renamed 'computed' to 'props' in signalStoreFeature() in ${sourceFile.fileName}`
        );
      }
    });
  };
}

export default function (): Rule {
  return chain([migrate()]);
}
