// https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/utility/json-utils.ts
export function findPropertyInAstObject(
  node: any,
  propertyName: string
): any | null {
  let maybeNode: any | null = null;
  for (const property of node.properties) {
    if (property.key.value == propertyName) {
      maybeNode = property.value;
    }
  }

  return maybeNode;
}
