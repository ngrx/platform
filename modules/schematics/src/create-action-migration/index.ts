import * as ts from 'typescript';
import { Path, tags } from '@angular-devkit/core';
import { Tree, Rule, chain } from '@angular-devkit/schematics';
import {
  InsertChange,
  RemoveChange,
  replaceImport,
  commitChanges,
} from '@ngrx/schematics/schematics-core';
import { camelize } from 'modules/effects/schematics-core/utility/strings';
import {
  createRemoveChange,
  ReplaceChange,
} from 'modules/schematics-core/utility/change';

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

          const matchingTypeVar = actionTypeVariables.filter(
            statement =>
              statement.declarationList.declarations.filter(
                node => (node.name as ts.Identifier).text === typeProperty
              ).length
          );

          const typeValue = matchingTypeVar
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

          return [
            new RemoveChange(
              sourceFile.fileName,
              matchingTypeVar[0].getStart(sourceFile),
              matchingTypeVar[0].getEnd()
            ),
            new RemoveChange(
              sourceFile.fileName,
              actionClass.getStart(sourceFile),
              actionClass.getEnd()
            ),
            new InsertChange(
              path,
              actionClass.getStart(sourceFile),
              createActionDefinition
            ),
          ];
        })
        .filter(Boolean) as []).reduce(
        (imports, curr) => imports.concat(curr),
        []
      );

      let replaceImportChanges: (ReplaceChange | RemoveChange)[] = [];
      if (changes.length > 0)
        replaceImportChanges = replaceImport(
          sourceFile,
          path,
          '@ngrx/store',
          'Action',
          'createAction'
        );

      return commitChanges(host, sourceFile.fileName, [
        ...changes,
        ...replaceImportChanges,
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
props<{ payload: ${payloadType}} }>()`;
  }
  createAction += `
);
`;
  return createAction;
};

function removeActionTypeVariables(
  host: Tree,
  path: Path,
  typeVariables: ts.VariableStatement[]
) {
  const removes = typeVariables;
  //   const removes = effects
  //   .map(effect => effect.decorators)
  //   .filter(decorators => decorators)
  //   .map(decorators => {
  //     const effectDecorators = decorators!.filter(isEffectDecorator);
  //     return effectDecorators.map(decorator => {
  //       return new RemoveChange(
  //         path,
  //         decorator.expression.pos - 1, // also get the @ sign
  //         decorator.expression.end
  //       );
  //     });
  //   })
  //   .reduce((acc, removes) => acc.concat(removes), []);

  // return [...removes];
}

function replaceEffectDecorators(
  host: Tree,
  path: Path,
  effects: ts.PropertyDeclaration[]
) {
  const inserts = effects
    .filter(effect => !!effect.initializer)
    .map(effect => {
      const decorator = (effect.decorators || []).find(isEffectDecorator)!;
      const effectArguments = getDispatchProperties(host, path, decorator);
      const end = effectArguments ? `, ${effectArguments})` : ')';

      return [
        new InsertChange(path, effect.initializer!.pos, ' createEffect(() =>'),
        new InsertChange(path, effect.initializer!.end, end),
      ];
    })
    .reduce((acc, inserts) => acc.concat(inserts), []);

  const removes = effects
    .map(effect => effect.decorators)
    .filter(decorators => decorators)
    .map(decorators => {
      const effectDecorators = decorators!.filter(isEffectDecorator);
      return effectDecorators.map(decorator => {
        return new RemoveChange(
          path,
          decorator.expression.pos - 1, // also get the @ sign
          decorator.expression.end
        );
      });
    })
    .reduce((acc, removes) => acc.concat(removes), []);

  return [...inserts, ...removes];
}

function isEffectDecorator(decorator: ts.Decorator) {
  return (
    ts.isCallExpression(decorator.expression) &&
    ts.isIdentifier(decorator.expression.expression) &&
    decorator.expression.expression.text === 'Effect'
  );
}

function getDispatchProperties(
  host: Tree,
  path: Path,
  decorator: ts.Decorator
) {
  if (!decorator.expression || !ts.isCallExpression(decorator.expression)) {
    return '';
  }

  // just copy the effect properties
  const content = host.read(path)!.toString('utf8');
  const args = content
    .substring(
      decorator.expression.arguments.pos,
      decorator.expression.arguments.end
    )
    .trim();
  return args;
}

export default function(): Rule {
  return chain([migrateToCreators()]);
}
