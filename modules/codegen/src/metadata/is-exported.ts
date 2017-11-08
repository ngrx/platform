import * as ts from 'typescript';

function hasExportModifier(node: ts.Node): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}

function isTopLevel(node: ts.Node): boolean {
  return !!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile;
}

export function isExported(node: ts.Node): boolean {
  return hasExportModifier(node) && isTopLevel(node);
}
