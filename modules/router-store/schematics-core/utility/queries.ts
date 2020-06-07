import * as ts from 'typescript';

export function findNgImports(
  node: ts.Node,
  callback: (importNode: ts.PropertyAssignment) => void
) {
  ts.forEachChild(node, (n) => {
    if (
      ts.isPropertyAssignment(n) &&
      ts.isArrayLiteralExpression(n.initializer) &&
      ts.isIdentifier(n.name) &&
      n.name.text === 'imports'
    ) {
      callback(n);
    }
  });
}
