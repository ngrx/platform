import * as ts from 'typescript';
import {
  Rule,
  chain,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import {
  createChangeRecorder,
  RemoveChange,
  InsertChange,
} from '@ngrx/store/schematics-core';
import { Path } from '@angular-devkit/core';

function removeNgrxStoreFreezeImport(): Rule {
  return (tree: Tree) => {
    // only add runtime checks when ngrx-store-freeze is used
    removeUsages(tree) && insertRuntimeChecks(tree);
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

    dependencyCategories.forEach(category => {
      if (pkg[category] && pkg[category]['ngrx-store-freeze']) {
        delete pkg[category]['ngrx-store-freeze'];
      }
    });

    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
    return tree;
  };
}

export default function(): Rule {
  return chain([removeNgrxStoreFreezeImport(), removeNgRxStoreFreezePackage()]);
}

function removeUsages(tree: Tree) {
  let ngrxStoreFreezeIsUsed = false;

  tree.visit(path => {
    if (!path.endsWith('.ts')) {
      return;
    }

    const sourceFile = ts.createSourceFile(
      path,
      tree.read(path)!.toString(),
      ts.ScriptTarget.Latest
    );

    if (sourceFile.isDeclarationFile) {
      return;
    }

    const importRemovements = findStoreFreezeImportsToRemove(sourceFile, path);
    if (importRemovements.length === 0) {
      return [];
    }

    ngrxStoreFreezeIsUsed = true;
    const usageReplacements = findStoreFreezeUsagesToRemove(sourceFile, path);
    const runtimeChecksInserts = findRuntimeCHecksToInsert(sourceFile, path);

    const changes = [
      ...importRemovements,
      ...usageReplacements,
      ...runtimeChecksInserts,
    ];
    const recorder = createChangeRecorder(tree, path, changes);
    tree.commitUpdate(recorder);
  });

  return ngrxStoreFreezeIsUsed;
}

function insertRuntimeChecks(tree: Tree) {
  tree.visit(path => {
    if (!path.endsWith('.ts')) {
      return;
    }

    const sourceFile = ts.createSourceFile(
      path,
      tree.read(path)!.toString(),
      ts.ScriptTarget.Latest
    );

    if (sourceFile.isDeclarationFile) {
      return;
    }

    const runtimeChecksInserts = findRuntimeCHecksToInsert(sourceFile, path);
    const recorder = createChangeRecorder(tree, path, runtimeChecksInserts);
    tree.commitUpdate(recorder);
  });
}

function findStoreFreezeImportsToRemove(sourceFile: ts.SourceFile, path: Path) {
  const imports = sourceFile.statements
    .filter(ts.isImportDeclaration)
    .filter(({ moduleSpecifier }) => {
      return (
        moduleSpecifier.getText(sourceFile) === `'ngrx-store-freeze'` ||
        moduleSpecifier.getText(sourceFile) === `"ngrx-store-freeze"`
      );
    });

  const removements = imports.map(
    i => new RemoveChange(path, i.getStart(sourceFile), i.getEnd())
  );
  return removements;
}

function findStoreFreezeUsagesToRemove(sourceFile: ts.SourceFile, path: Path) {
  let changes: (RemoveChange | InsertChange)[] = [];
  ts.forEachChild(sourceFile, node => crawl(node, changes));
  return changes;

  function crawl(node: ts.Node, changes: (RemoveChange | InsertChange)[]) {
    if (!ts.isArrayLiteralExpression(node)) {
      ts.forEachChild(node, childNode => crawl(childNode, changes));
      return;
    }

    const elements = node.elements.map(elem => elem.getText(sourceFile));
    const elementsWithoutStoreFreeze = elements.filter(
      elemText => elemText !== 'storeFreeze'
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
          path,
          node.getStart(sourceFile),
          `[${elementsWithoutStoreFreeze.join(', ')}]`
        )
      );
    }
  }
}

function findRuntimeCHecksToInsert(sourceFile: ts.SourceFile, path: Path) {
  let changes: (InsertChange)[] = [];
  ts.forEachChild(sourceFile, node => crawl(node, changes));
  return changes;

  function crawl(node: ts.Node, changes: (InsertChange)[]) {
    if (!ts.isCallExpression(node)) {
      ts.forEachChild(node, childNode => crawl(childNode, changes));
      return;
    }

    const expression = node.expression;
    if (
      !(
        ts.isPropertyAccessExpression(expression) &&
        expression.expression.getText(sourceFile) === 'StoreModule' &&
        expression.name.getText(sourceFile) === 'forRoot'
      )
    ) {
      ts.forEachChild(node, childNode => crawl(childNode, changes));
      return;
    }

    const runtimeChecks = `runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true }`;

    // covers StoreModule.forRoot(ROOT_REDUCERS)
    if (node.arguments.length === 1) {
      changes.push(
        new InsertChange(
          path,
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
              path,
              storeConfig.getEnd() - 1,
              `${runtimeChecks} `
            )
          );
        } else {
          // covers StoreModule.forRoot(ROOT_REDUCERS, { metaReducers })
          const lastProperty =
            storeConfig.properties[storeConfig.properties.length - 1];

          changes.push(
            new InsertChange(path, lastProperty.getEnd(), `, ${runtimeChecks}`)
          );
        }
      }
    }

    ts.forEachChild(node, childNode => crawl(childNode, changes));
  }
}
