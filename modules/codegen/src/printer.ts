import * as ts from 'typescript';
import * as _ from 'lodash';
import { ActionMetadata } from './collect-metadata';

export function createActionOutput(
  filename: string,
  metadata: ActionMetadata[]
) {
  const actionInterfaceSymbols = metadata.map(m => m.name);

  const importDeclaration = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports(
        metadata.map(m =>
          ts.createImportSpecifier(undefined, ts.createIdentifier(m.name))
        )
      )
    ),
    ts.createIdentifier(`'./${filename.replace('.ts', '')}'`)
  );

  const { category } = parseActionType(metadata[0].type);

  const enumName = `${_.upperFirst(_.camelCase(category))}ActionType`;
  const enumDeclaration = ts.createEnumDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    enumName,
    metadata.map(m => {
      const { name } = parseActionType(m.type);

      return ts.createEnumMember(
        _.capitalize(_.snakeCase(name)),
        ts.createLiteral(_.trim(m.type, `'"\``))
      );
    })
  );

  const typeUnionDeclaration = ts.createTypeAliasDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    `${_.upperFirst(_.camelCase(category))}Actions`,
    undefined,
    ts.createUnionTypeNode(
      metadata.map(m => ts.createTypeReferenceNode(m.name, undefined))
    )
  );

  const typeLookupDeclaration = ts.createTypeAliasDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    `${_.upperFirst(_.camelCase(category))}ActionLookup`,
    undefined,
    ts.createTypeLiteralNode(
      metadata.map(m => {
        return ts.createPropertySignature(
          undefined,
          m.type,
          undefined,
          ts.createTypeReferenceNode(m.name, undefined),
          undefined
        );
      })
    )
  );

  const actionFactories = metadata.map(m => {
    return ts.createFunctionDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      undefined,
      `create${m.name}`,
      undefined,
      m.properties.map(({ name, optional }) => {
        return ts.createParameter(
          undefined,
          undefined,
          undefined,
          name,
          optional ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined,
          ts.createTypeReferenceNode(`${m.name}["${name}"]`, undefined),
          undefined
        );
      }),
      ts.createTypeReferenceNode(m.name, undefined),
      ts.createBlock(
        [
          ts.createReturn(
            ts.createObjectLiteral([
              ts.createPropertyAssignment(
                'type',
                ts.createPropertyAccess(
                  ts.createIdentifier(enumName),
                  ts.createIdentifier(
                    _.capitalize(_.snakeCase(parseActionType(m.type).name))
                  )
                )
              ),
              ...m.properties.map(({ name }) => {
                return ts.createShorthandPropertyAssignment(name, undefined);
              }),
            ])
          ),
        ],
        true
      )
    );
  });

  return [
    importDeclaration,
    enumDeclaration,
    typeUnionDeclaration,
    typeLookupDeclaration,
    ...actionFactories,
  ];
}

const actionTypeRegex = new RegExp(/\[(.*?)\](.*)/);
function parseActionType(type: string) {
  const result = actionTypeRegex.exec(type);

  if (result === null) {
    throw new Error(`Could not parse action type "${type}"`);
  }

  return {
    category: result[1] as string,
    name: result[2] as string,
  };
}
