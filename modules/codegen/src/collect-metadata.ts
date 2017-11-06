import * as ts from 'typescript';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import * as collector from './metadata/index';
import * as printers from './printers/index';
import { ActionInterface } from './action-interface';

export interface ActionMetadata {
  name: string;
  type: string;
  properties: { name: string; optional: boolean }[];
}

export function collectMetadata(
  fileName: string,
  sourceFile: ts.SourceFile
): ts.Node[] | undefined {
  const interfaces = sourceFile.statements
    .filter(ts.isInterfaceDeclaration)
    .filter(collector.isExported)
    .filter(collector.isActionDescendent)
    .filter(m => !!collector.getType(m))
    .map((enterface): ActionInterface => ({
      name: enterface.name.getText(),
      actionType: _.trim(
        collector.getType(enterface)!.literal.getFullText(),
        ' \'"`'
      ),
      properties: [
        ...collector.getRequiredProperties(collector.getProperties(enterface)),
        ...collector.getOptionalProperties(collector.getProperties(enterface)),
      ],
    }));

  if (interfaces.length === 0) {
    undefined;
  }

  return [
    printers.printImportDeclaration(fileName, interfaces),
    printers.printEnumDeclaration(interfaces),
    printers.printTypeUnionDeclaration(interfaces),
    printers.printTypeDictionaryDeclaration(interfaces),
    ...interfaces.map(action => printers.printActionFactoryDeclaration(action)),
  ];
}

export function printActionFactory(ast: ts.Node[]) {
  const resultFile = ts.createSourceFile(
    '',
    '',
    ts.ScriptTarget.ES2015,
    false,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return ast
    .map(statement =>
      printer.printNode(ts.EmitHint.Unspecified, statement, resultFile)
    )
    .join('\n\n');
}
