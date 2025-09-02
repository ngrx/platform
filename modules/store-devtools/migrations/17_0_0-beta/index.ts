import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  commitChanges,
  InsertChange,
  Change,
  createReplaceChange,
} from '../..//schematics-core';

function migrate() {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const devtoolsImports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(({ moduleSpecifier }) =>
          moduleSpecifier.getText(sourceFile).includes('@ngrx/store-devtools')
        );

      if (devtoolsImports.length === 0) {
        return;
      }

      const changes = [...findAndUpdateConfigs(sourceFile)];

      commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

function findAndUpdateConfigs(sourceFile: ts.SourceFile) {
  const changes: Change[] = [];
  ts.forEachChild(sourceFile, (node) => find(node, changes));
  return changes;

  function find(node: ts.Node, changes: Change[]) {
    if (
      ts.isPropertyAccessExpression(node) &&
      node.name.text === 'instrument' &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'StoreDevtoolsModule' &&
      ts.isCallExpression(node.parent)
    ) {
      if (node.parent.arguments.length) {
        const [devtoolsConfig] = node.parent.arguments;

        if (ts.isObjectLiteralExpression(devtoolsConfig)) {
          updateConfig(sourceFile, devtoolsConfig, (change) =>
            changes.push(change)
          );
        }
      } else {
        createDevtoolsConfig(sourceFile, node.parent, (change) =>
          changes.push(change)
        );
      }
    }

    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'provideStoreDevtools'
    ) {
      if (node.arguments.length) {
        const [devtoolsConfig] = node.arguments;

        if (ts.isObjectLiteralExpression(devtoolsConfig)) {
          updateConfig(sourceFile, devtoolsConfig, (change) =>
            changes.push(change)
          );
        }
      } else {
        createDevtoolsConfig(sourceFile, node, (change) =>
          changes.push(change)
        );
      }
    }

    ts.forEachChild(node, (childNode) => find(childNode, changes));
  }
}

function updateConfig(
  sourceFile: ts.SourceFile,
  devtoolsConfig: ts.ObjectLiteralExpression,
  addChange: (changes: Change) => number
) {
  const connectOutsideZoneProperty = devtoolsConfig.properties.find(
    (p) =>
      ts.isPropertyAssignment(p) &&
      ts.isIdentifier(p.name) &&
      p.name.text === 'connectOutsideZone'
  );

  if (!connectOutsideZoneProperty) {
    addConnectInZoneProperty();
  } else if (ts.isPropertyAssignment(connectOutsideZoneProperty)) {
    replaceConnectOutsideZoneConfig(connectOutsideZoneProperty);
  }

  function addConnectInZoneProperty() {
    const configText = devtoolsConfig.getText(sourceFile);
    const comma =
      !devtoolsConfig.properties.length ||
      configText
        .substring(0, configText.length - 1)
        .trim()
        .endsWith(',')
        ? ''
        : ',';

    addChange(
      new InsertChange(
        sourceFile.fileName,
        devtoolsConfig.getEnd() - 1,
        `${comma} connectInZone: true`.trim()
      )
    );
  }

  function replaceConnectOutsideZoneConfig(
    connectOutsideZone: ts.PropertyAssignment
  ) {
    const currentValue = connectOutsideZone.initializer
      .getText(sourceFile)
      .trim();
    addChange(
      createReplaceChange(
        sourceFile,
        connectOutsideZone.name,
        'connectOutsideZone',
        'connectInZone'
      )
    );
    addChange(
      createReplaceChange(
        sourceFile,
        connectOutsideZone.initializer,
        currentValue,
        currentValue === 'true'
          ? 'false'
          : currentValue === 'false'
            ? 'true'
            : `!${currentValue}`
      )
    );
  }
}

function createDevtoolsConfig(
  sourceFile: ts.SourceFile,
  callExpression: ts.CallExpression,
  addChange: (...items: Change[]) => number
) {
  addChange(
    new InsertChange(
      sourceFile.fileName,
      callExpression.getEnd() - 1,
      `{connectInZone: true}`
    )
  );
}

export default function (): Rule {
  return chain([migrate()]);
}
