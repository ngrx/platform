import * as ts from 'typescript';
import { Path, tags } from '@angular-devkit/core';
import { camelize } from '@angular-devkit/core/src/utils/strings';
import { Tree, Rule, chain } from '@angular-devkit/schematics';
import {
  InsertChange,
  RemoveChange,
  ReplaceChange,
  replaceImport,
  commitChanges,
  Change,
} from '@ngrx/schematics/schematics-core';

export function migrateToCreators(): Rule {
  return (host: Tree) =>
    host.visit(path => {
      if (!path.endsWith('.ts') || path.includes('node_modules')) {
        return;
      }

      const sourceFile = ts.createSourceFile(
        path,
        host.read(path)!.toString(),
        ts.ScriptTarget.Latest
      );

      if (sourceFile.isDeclarationFile || !isActionImported(sourceFile)) {
        return;
      }

      const actionClasses = getActionClasses(sourceFile);
      const actionTypeVariables = sourceFile.statements.filter(
        ts.isVariableStatement
      );

      let importProps = false;

      let changes = (actionClasses
        .map(actionClass => {
          let typeProperty = actionClass.members
            .filter(ts.isPropertyDeclaration)
            .filter(member => (member.name as ts.Identifier).text === 'type')
            .map(member => (member.initializer as ts.Identifier).text)[0];

          if (!typeProperty) {
            return undefined;
          }

          const typeVariable = actionTypeVariables.filter(
            statement =>
              statement.declarationList.declarations.filter(
                node => (node.name as ts.Identifier).text === typeProperty
              ).length
          );

          const typeValue = typeVariable
            .map(statement => statement.declarationList.declarations)
            .map(decl => (decl[0].initializer as ts.Identifier).text)[0];

          if (!typeValue) {
            return undefined;
          }

          const payloadType = getConstructorPayloadType(
            host,
            path,
            actionClass
          );
          if (payloadType) {
            importProps = true;
          }

          const createActionDefinition = composeCreateAction(
            typeValue,
            payloadType,
            actionClass
          );

          if (createActionDefinition.includes('props')) {
            importProps = true;
          }

          return [
            new RemoveChange(
              sourceFile.fileName,
              typeVariable[0].getStart(sourceFile),
              typeVariable[0].getEnd()
            ),
            new RemoveChange(
              sourceFile.fileName,
              actionClass.getStart(sourceFile),
              actionClass.getEnd()
            ),
            new InsertChange(
              path,
              typeVariable[0].getStart(sourceFile),
              createActionDefinition
            ),
          ];
        })
        .filter(Boolean) as []).reduce(
        (imports, curr) => imports.concat(curr),
        []
      );

      let importChanges: (ReplaceChange | RemoveChange | Change)[] = [];
      const imports = [];
      if (changes.length > 0) {
        imports.push('createAction');
        if (importProps) {
          imports.push('props');
        }
        importChanges = replaceImport(
          sourceFile,
          path,
          '@ngrx/store',
          'Action',
          imports.join(', ')
        );
      }

      return commitChanges(host, sourceFile.fileName, [
        ...changes,
        ...importChanges,
      ]);
    });
}

const isActionImported = (sourceFile: ts.SourceFile): boolean => {
  return !!sourceFile.statements
    .filter(ts.isImportDeclaration)
    .filter(({ moduleSpecifier }) =>
      moduleSpecifier.getText(sourceFile).includes('@ngrx/store')
    )
    .filter(p => {
      return (p.importClause!
        .namedBindings! as ts.NamedImports).elements.filter(spec => {
        if (spec.name.text) {
          return spec.name.text === 'Action';
        }
      }).length;
    }).length;
};

const getActionClasses = (sourceFile: ts.SourceFile): ts.ClassDeclaration[] => {
  return sourceFile.statements
    .filter(ts.isClassDeclaration)
    .filter(
      statement => statement.heritageClauses && statement.heritageClauses.length
    )
    .filter(statement => {
      return statement.heritageClauses!.filter(clause => {
        return (clause.types || []).filter(type => {
          return (
            type.expression && type.expression.getText(sourceFile) === 'Action'
          );
        }).length;
      }).length;
    });
};

const getConstructorPayloadType = (
  host: Tree,
  path: Path,
  actionClass: ts.ClassDeclaration
): string => {
  let payloadType = '';

  let payloadInConstructor = actionClass.members
    .filter(ts.isConstructorDeclaration)
    .filter(member => member.parameters.filter(param => param.type).length)
    .map(member => member.parameters[0].type)[0];

  if (payloadInConstructor) {
    payloadType = host
      .read(path)!
      .toString('utf8')
      .substring(payloadInConstructor.pos, payloadInConstructor.end)
      .trim();
  }

  return payloadType;
};

const composeCreateAction = (
  typeValue: string,
  payloadType: string,
  actionClass: ts.ClassDeclaration
): string => {
  let actionName = camelize(actionClass.name!.text.replace('Action', ''));
  let createAction = tags.stripIndent`
        export const ${actionName} = createAction(
          '${typeValue}'`;
  if (payloadType) {
    createAction += `,
  props<{ payload: ${payloadType} }>()`;
  }
  createAction += `
);
`;
  return createAction;
};

export default function(): Rule {
  return chain([migrateToCreators()]);
}
