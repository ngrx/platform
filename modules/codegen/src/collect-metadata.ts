import * as ts from 'typescript';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import { createActionOutput } from './printer';

export interface ActionMetadata {
  name: string;
  type: string;
  properties: { name: string; optional: boolean }[];
}

export function collectMetadata(sourceFile: ts.SourceFile): ActionMetadata[] {
  const statements = sourceFile.statements;

  const interfacesExtendingAction: ts.InterfaceDeclaration[] = statements.filter(
    (statement): statement is ts.InterfaceDeclaration => {
      const isInterface = statement.kind === ts.SyntaxKind.InterfaceDeclaration;

      if (ts.isInterfaceDeclaration(statement)) {
        const heritageClauses = statement.heritageClauses;

        if (heritageClauses) {
          return heritageClauses.some(clause => {
            return clause.types.some(
              type => type.expression.getText() === 'Action'
            );
          });
        }
      }

      return false;
    }
  );

  const metadata = interfacesExtendingAction.map(int => {
    const interfaceProperties: ts.PropertySignature[] = int.members.filter(
      ts.isPropertySignature
    );

    const typeProperty = interfaceProperties.find(member => {
      return member.name.getText() === 'type';
    });

    if (typeProperty === undefined) {
      throw new Error(
        `Could not find "type" property on interface "${int.name.getText()}"`
      );
    }

    const requiredProperties = interfaceProperties
      .filter(member => {
        return member.name.getText() !== 'type' && !member.questionToken;
      })
      .map(member => member.name.getText());

    const optionalProperties = interfaceProperties
      .filter(member => {
        return member.questionToken;
      })
      .map(member => member.name.getText());

    return {
      name: int.name.getText(),
      type: (typeProperty.type as ts.LiteralTypeNode).literal.getText(),
      properties: [
        ...requiredProperties.map(name => ({ name, optional: false })),
        ...optionalProperties.map(name => ({ name, optional: true })),
      ],
    };
  });

  return metadata;
}

const sourceFile = ts.createSourceFile(
  'test.ts',
  fs.readFileSync(path.resolve(__dirname, './test.ts')).toString(),
  ts.ScriptTarget.ES2015,
  true
);
const metadata = collectMetadata(sourceFile);
const ast = createActionOutput('test.ts', metadata);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const resultFile = ts.createSourceFile(
  'test.ts',
  '',
  ts.ScriptTarget.ES2015,
  false,
  ts.ScriptKind.TS
);
const sourceText = ast
  .map(statement =>
    printer.printNode(ts.EmitHint.Unspecified, statement, resultFile)
  )
  .join('\n\n');
fs.writeFileSync(path.resolve(__dirname, './test.generated.ts'), sourceText, {
  encoding: 'utf8',
});
