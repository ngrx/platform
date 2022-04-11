import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import { ASTUtils } from '@typescript-eslint/experimental-utils';
import {
  isCallExpression,
  isIdentifier,
  isIdentifierOrMemberExpression,
  isImportDeclaration,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isImportSpecifier,
  isLiteral,
  isMethodDefinition,
  isProgram,
  isProperty,
  isPropertyDefinition,
  isTemplateElement,
  isTemplateLiteral,
  isTSTypeAnnotation,
  isTSTypeReference,
} from './guards';
import { NGRX_MODULE_PATHS } from './ngrx-modules';

type ConstructorFunctionExpression = TSESTree.FunctionExpression & {
  parent: TSESTree.MethodDefinition & { kind: 'constructor' };
};
type InjectedParameter =
  | TSESTree.Identifier & {
      typeAnnotation: TSESTree.TSTypeAnnotation;
      parent:
        | ConstructorFunctionExpression
        | (TSESTree.TSParameterProperty & {
            parent: ConstructorFunctionExpression;
          });
    };
type InjectedParameterWithSourceCode = Readonly<{
  identifiers?: readonly InjectedParameter[];
  sourceCode: Readonly<TSESLint.SourceCode>;
}>;

export function getNearestUpperNodeFrom<T extends TSESTree.Node>(
  { parent }: TSESTree.Node,
  predicate: (parent: TSESTree.Node) => parent is T
): T | undefined {
  while (parent && !isProgram(parent)) {
    if (predicate(parent)) {
      return parent;
    }

    parent = parent.parent;
  }

  return undefined;
}

export function getImportDeclarationSpecifier(
  importDeclarations: readonly TSESTree.ImportDeclaration[],
  importName: string
) {
  for (const importDeclaration of importDeclarations) {
    const importSpecifier = importDeclaration.specifiers.find(
      (importClause): importClause is TSESTree.ImportSpecifier => {
        return (
          isImportSpecifier(importClause) &&
          importClause.imported.name === importName
        );
      }
    );

    if (importSpecifier) {
      return { importDeclaration, importSpecifier } as const;
    }
  }

  return undefined;
}

export function getImportDeclarations(
  node: TSESTree.Node,
  moduleName: string
): readonly TSESTree.ImportDeclaration[] | undefined {
  let parentNode: TSESTree.Node | undefined = node;

  while (parentNode && !isProgram(parentNode)) {
    parentNode = parentNode.parent;
  }

  return parentNode?.body.filter((node): node is TSESTree.ImportDeclaration => {
    return isImportDeclaration(node) && node.source.value === moduleName;
  });
}

function getCorrespondentImportClause(
  importDeclarations: readonly TSESTree.ImportDeclaration[],
  compatibleWithTypeOnlyImport = false
) {
  let importClause: TSESTree.ImportClause | undefined;

  for (const { importKind, specifiers } of importDeclarations) {
    const lastImportSpecifier = getLast(specifiers);

    if (
      (!compatibleWithTypeOnlyImport && importKind === 'type') ||
      isImportNamespaceSpecifier(lastImportSpecifier)
    ) {
      continue;
    }

    importClause = lastImportSpecifier;
  }

  return importClause;
}

export function getImportAddFix({
  compatibleWithTypeOnlyImport = false,
  fixer,
  importName,
  moduleName,
  node,
}: {
  compatibleWithTypeOnlyImport?: boolean;
  fixer: TSESLint.RuleFixer;
  importName: string;
  moduleName: string;
  node: TSESTree.Node;
}): TSESLint.RuleFix | TSESLint.RuleFix[] {
  const fullImport = `import { ${importName} } from '${moduleName}';\n`;
  const importDeclarations = getImportDeclarations(node, moduleName);

  if (!importDeclarations?.length) {
    return fixer.insertTextAfterRange([0, 0], fullImport);
  }

  const importDeclarationSpecifier = getImportDeclarationSpecifier(
    importDeclarations,
    importName
  );

  if (importDeclarationSpecifier) {
    return [];
  }

  const importClause = getCorrespondentImportClause(
    importDeclarations,
    compatibleWithTypeOnlyImport
  );

  if (!importClause) {
    return fixer.insertTextAfterRange([0, 0], fullImport);
  }

  const replacementText = isImportDefaultSpecifier(importClause)
    ? `, { ${importName} }`
    : `, ${importName}`;
  return fixer.insertTextAfter(importClause, replacementText);
}

export function getImportRemoveFix(
  sourceCode: Readonly<TSESLint.SourceCode>,
  importDeclarations: readonly TSESTree.ImportDeclaration[],
  importedName: string,
  fixer: TSESLint.RuleFixer
): TSESLint.RuleFix | TSESLint.RuleFix[] {
  const { importDeclaration, importSpecifier } =
    getImportDeclarationSpecifier(importDeclarations, importedName) ?? {};

  if (!importDeclaration || !importSpecifier) {
    return [];
  }

  const isFirstImportSpecifier =
    importDeclaration.specifiers[0] === importSpecifier;
  const isLastImportSpecifier =
    getLast(importDeclaration.specifiers) === importSpecifier;
  const isSingleImportSpecifier =
    isFirstImportSpecifier && isLastImportSpecifier;

  if (isSingleImportSpecifier) {
    return fixer.remove(importDeclaration);
  }

  const tokenAfterImportSpecifier = sourceCode.getTokenAfter(importSpecifier);

  if (isFirstImportSpecifier && tokenAfterImportSpecifier) {
    return fixer.removeRange([
      importSpecifier.range[0],
      tokenAfterImportSpecifier.range[1],
    ]);
  }

  const tokenBeforeImportSpecifier = sourceCode.getTokenBefore(importSpecifier);

  if (!tokenBeforeImportSpecifier) {
    return [];
  }

  return fixer.removeRange([
    tokenBeforeImportSpecifier.range[0],
    importSpecifier.range[1],
  ]);
}

export function getNodeToCommaRemoveFix(
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  node: TSESTree.Node
) {
  const nextToken = sourceCode.getTokenAfter(node);
  const isNextTokenComma = nextToken && ASTUtils.isCommaToken(nextToken);
  return [
    fixer.remove(node),
    ...(isNextTokenComma ? [fixer.remove(nextToken)] : []),
  ] as const;
}

export function getInterfaceName(
  interfaceMember: TSESTree.Identifier | TSESTree.MemberExpression
): string | undefined {
  if (isIdentifier(interfaceMember)) {
    return interfaceMember.name;
  }

  return isIdentifier(interfaceMember.property)
    ? interfaceMember.property.name
    : undefined;
}

export function getInterfaces({
  implements: classImplements,
}: TSESTree.ClassDeclaration): readonly (
  | TSESTree.Identifier
  | TSESTree.MemberExpression
)[] {
  return (classImplements ?? [])
    .map(({ expression }) => expression)
    .filter(isIdentifierOrMemberExpression);
}

export function getInterface(
  node: TSESTree.ClassDeclaration,
  interfaceName: string
): TSESTree.Identifier | TSESTree.MemberExpression | undefined {
  return getInterfaces(node).find(
    (interfaceMember) => getInterfaceName(interfaceMember) === interfaceName
  );
}

export function getImplementsSchemaFixer(
  { id, implements: classImplements }: TSESTree.ClassDeclaration,
  interfaceName: string
) {
  const [implementsNodeReplace, implementsTextReplace] = classImplements
    ? [getLast(classImplements), `, ${interfaceName}`]
    : [id as TSESTree.Identifier, ` implements ${interfaceName}`];

  return { implementsNodeReplace, implementsTextReplace } as const;
}

export function getLast<T extends readonly unknown[]>(items: T): T[number] {
  return items.slice(-1)[0];
}

export function getDecoratorArguments({ expression }: TSESTree.Decorator) {
  return isCallExpression(expression) ? expression.arguments : [];
}

export function getDecoratorName({
  expression,
}: TSESTree.Decorator): string | undefined {
  if (isIdentifier(expression)) {
    return expression.name;
  }

  return isCallExpression(expression) && isIdentifier(expression.callee)
    ? expression.callee.name
    : undefined;
}

export function getDecorator(
  {
    decorators,
  }:
    | TSESTree.PropertyDefinition
    | TSESTree.ClassDeclaration
    | TSESTree.MethodDefinition,
  decoratorName: string
): TSESTree.Decorator | undefined {
  return decorators?.find(
    (decorator) => getDecoratorName(decorator) === decoratorName
  );
}

export function getRawText(node: TSESTree.Node): string | null {
  if (isIdentifier(node)) {
    return node.name;
  }

  if (
    isPropertyDefinition(node) ||
    isMethodDefinition(node) ||
    isProperty(node)
  ) {
    return getRawText(node.key);
  }

  if (isLiteral(node)) {
    return node.raw;
  }

  if (isTemplateElement(node)) {
    return `\`${node.value.raw}\``;
  }

  if (isTemplateLiteral(node)) {
    return `\`${node.quasis[0].value.raw}\``;
  }

  return null;
}

export function capitalize<T extends string>(text: T): Capitalize<T> {
  return `${text[0].toUpperCase()}${text.slice(1)}` as Capitalize<T>;
}

function getInjectedParametersWithSourceCode(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
  moduleName: string,
  importName: string
): InjectedParameterWithSourceCode {
  const sourceCode = context.getSourceCode();
  const importDeclarations =
    getImportDeclarations(sourceCode.ast, moduleName) ?? [];
  const { importSpecifier } =
    getImportDeclarationSpecifier(importDeclarations, importName) ?? {};

  if (!importSpecifier) {
    return { sourceCode };
  }

  const variables = context.getDeclaredVariables(importSpecifier);
  const typedVariable = variables.find(({ name }) => name === importName);
  const identifiers = typedVariable?.references?.reduce<
    readonly InjectedParameter[]
  >((identifiers, { identifier: { parent } }) => {
    if (
      parent &&
      isTSTypeReference(parent) &&
      parent.parent &&
      isTSTypeAnnotation(parent.parent) &&
      parent.parent.parent &&
      isIdentifier(parent.parent.parent)
    ) {
      return identifiers.concat(parent.parent.parent as InjectedParameter);
    }

    return identifiers;
  }, []);
  return { identifiers, sourceCode };
}

export function getNgRxEffectActions(
  context: TSESLint.RuleContext<string, readonly unknown[]>
): InjectedParameterWithSourceCode {
  return getInjectedParametersWithSourceCode(
    context,
    NGRX_MODULE_PATHS.effects,
    'Actions'
  );
}

export function getNgRxComponentStores(
  context: TSESLint.RuleContext<string, readonly unknown[]>
): InjectedParameterWithSourceCode {
  return getInjectedParametersWithSourceCode(
    context,
    NGRX_MODULE_PATHS['component-store'],
    'ComponentStore'
  );
}

export function getNgRxStores(
  context: TSESLint.RuleContext<string, readonly unknown[]>
): InjectedParameterWithSourceCode {
  return getInjectedParametersWithSourceCode(
    context,
    NGRX_MODULE_PATHS.store,
    'Store'
  );
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
export function escapeText(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function asPattern(identifiers: readonly InjectedParameter[]): RegExp {
  const escapedNames = identifiers.map(({ name }) => escapeText(name));
  return new RegExp(`^(${escapedNames.join('|')})$`);
}
