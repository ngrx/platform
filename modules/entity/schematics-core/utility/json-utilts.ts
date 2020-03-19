import { JsonAstNode, JsonAstObject } from '@angular-devkit/core';

// https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/utility/json-utils.ts
export function findPropertyInAstObject(
  node: JsonAstObject,
  propertyName: string
): JsonAstNode | null {
  let maybeNode: JsonAstNode | null = null;
  for (const property of node.properties) {
    if (property.key.value == propertyName) {
      maybeNode = property.value;
    }
  }

  return maybeNode;
}
