import * as ts from 'typescript';
import {
  Rule,
  chain,
  Tree,
  SchematicsException,
} from '@angular-devkit/schematics';
import {
  RemoveChange,
  InsertChange,
  visitTSSourceFiles,
  commitChanges,
} from '../../schematics-core';

function replaceWithRuntimeChecks(): Rule {
  return (tree: Tree) => {
    // only add runtime checks when ngrx-store-freeze is used
    visitTSSourceFiles<boolean>(tree, removeUsages) &&
      visitTSSourceFiles(tree, insertRuntimeChecks);
  };
}

function removeNgRxStoreFreezePackage(): Rule {
  return (tree: Tree) => {
    const pkgPath = '/package.json';
    const buffer = tree.read(pkgPath);
    if (buffer === null) {
      throw new SchematicsException('Could not read package.json');
    }
    const content = buffer.toString();
    const pkg = JSON.parse(content);

    if (pkg === null || typeof pkg !== 'object' || Array.isArray(pkg)) {
      throw new SchematicsException('Error reading package.json');
    }

    const dependencyCategories = ['dependencies', 'devDependencies'];

    dependencyCategories.forEach((category) => {
      if (pkg[category] && pkg[category]['ngrx-store-freeze']) {
        delete pkg[category]['ngrx-store-freeze'];
      }
    });

    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
    return tree;
  };
}

export default function (): Rule {
  return chain([removeNgRxStoreFreezePackage(), replaceWithRuntimeChecks()]);
}

function removeUsages(
  sourceFile: ts.SourceFile,
  tree: Tree,
  ngrxStoreFreezeIsUsed?: boolean
) {
  if (
    sourceFile.fileName.endsWith('.spec.ts') ||
    sourceFile.fileName.endsWith('.test.ts')
  ) {
    return ngrxStoreFreezeIsUsed;
  }

  const importRemovements = findStoreFreezeImportsToRemove(sourceFile);
  if (importRemovements.length === 0) {
    return ngrxStoreFreezeIsUsed;
  }

  const usageReplacements = findStoreFreezeUsagesToRemove(sourceFile);
  const changes = [...importRemovements, ...usageReplacements];
  return commitChanges(tree, sourceFile.fileName, changes);
}

function insertRuntimeChecks(sourceFile: ts.SourceFile, tree: Tree) {
  if (
    sourceFile.fileName.endsWith('.spec.ts') ||
    sourceFile.fileName.endsWith('.test.ts')
  ) {
    return;
  }

  const changes = findRuntimeCHecksToInsert(sourceFile);
  return commitChanges(tree, sourceFile.fileName, changes);
}

function findStoreFreezeImportsToRemove(sourceFile: ts.SourceFile) {
  const imports = sourceFile.statements
    .filter(ts.isImportDeclaration)
    .filter(({ moduleSpecifier }) => {
      return (
        moduleSpecifier.getText(sourceFile) === `'ngrx-store-freeze'` ||
        moduleSpecifier.getText(sourceFile) === `"ngrx-store-freeze"`
      );
    });

  const removements = imports.map(
    (i) =>
      new RemoveChange(sourceFile.fileName, i.getStart(sourceFile), i.getEnd())
  );
  return removements;
}

function findStoreFreezeUsagesToRemove(sourceFile: ts.SourceFile) {
  const changes: (RemoveChange | InsertChange)[] = [];
  ts.forEachChild(sourceFile, crawl);
  return changes;

  function crawl(node: ts.Node) {
    ts.forEachChild(node, crawl);

    if (!ts.isArrayLiteralExpression(node)) return;

    const elements = node.elements.map((elem) => elem.getText(sourceFile));
    const elementsWithoutStoreFreeze = elements.filter(
      (elemText) => elemText !== 'storeFreeze'
    );

    if (elements.length !== elementsWithoutStoreFreeze.length) {
      changes.push(
        new RemoveChange(
          sourceFile.fileName,
          node.getStart(sourceFile),
          node.getEnd()
        )
      );
      changes.push(
        new InsertChange(
          sourceFile.fileName,
          node.getStart(sourceFile),
          `[${elementsWithoutStoreFreeze.join(', ')}]`
        )
      );
    }
  }
}

function findRuntimeCHecksToInsert(sourceFile: ts.SourceFile) {
  const changes: InsertChange[] = [];
  ts.forEachChild(sourceFile, crawl);
  return changes;

  function crawl(node: ts.Node) {
    ts.forEachChild(node, crawl);

    if (!ts.isCallExpression(node)) return;

    const expression = node.expression;
    if (
      !(
        ts.isPropertyAccessExpression(expression) &&
        expression.expression.getText(sourceFile) === 'StoreModule' &&
        expression.name.getText(sourceFile) === 'forRoot'
      )
    ) {
      return;
    }

    const runtimeChecks = `runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true }`;

    // covers StoreModule.forRoot(ROOT_REDUCERS)
    if (node.arguments.length === 1) {
      changes.push(
        new InsertChange(
          sourceFile.fileName,
          node.arguments[0].getEnd(),
          `, { ${runtimeChecks}}`
        )
      );
    } else if (node.arguments.length === 2) {
      const storeConfig = node.arguments[1];
      if (ts.isObjectLiteralExpression(storeConfig)) {
        // covers StoreModule.forRoot(ROOT_REDUCERS, {})
        if (storeConfig.properties.length === 0) {
          changes.push(
            new InsertChange(
              sourceFile.fileName,
              storeConfig.getEnd() - 1,
              `${runtimeChecks} `
            )
          );
        } else {
          // covers StoreModule.forRoot(ROOT_REDUCERS, { metaReducers })
          const lastProperty =
            storeConfig.properties[storeConfig.properties.length - 1];

          changes.push(
            new InsertChange(
              sourceFile.fileName,
              lastProperty.getEnd(),
              `, ${runtimeChecks}`
            )
          );
        }
      }
    }
  }
}
