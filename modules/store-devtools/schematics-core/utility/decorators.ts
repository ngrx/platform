import * as ts from 'typescript';

/**
 * In TS 4.8 the `decorators` are combined with the `modifiers` array.
 * Once we drop support for older versions, we can remove this function
 * and use `ts.getDecorators` directly.
 */
export function getNodeDecorators(node: ts.Node): ts.Decorator[] | undefined {
  return (ts as any).getDecorators?.(node) || node.decorators;
}
