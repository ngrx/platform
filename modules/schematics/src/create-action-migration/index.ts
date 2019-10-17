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

      if (sourceFile.isDeclarationFile) {
        return;
      }

      const actionTypeVariables = sourceFile.statements.filter(
        ts.isVariableStatement
      );

      // const actionEnumsRemovals = removeActionTypeVariables(
      //   host,
      //   path,
      //   actionTypeVariables
      // );

      const actionsClasses = getActionsClasses(sourceFile);

      let inserts: InsertChange[] = [];
      actionsClasses.forEach(clas => {
        let type = clas.members
          .filter(ts.isPropertyDeclaration)
          .filter(member => (member.name as ts.Identifier).text === 'type')
          .map(member => (member.initializer as ts.Identifier).text)[0];

        if (type) {
          let constructorTypeObj = clas.members
            .filter(ts.isConstructorDeclaration)
            .filter(
              member => member.parameters.filter(param => param.type).length
            )
            .map(member => member.parameters[0].type)[0];

          let payloadType;
          if (constructorTypeObj) {
            payloadType = host
              .read(path)!
              .toString('utf8')
              .substring(constructorTypeObj.pos, constructorTypeObj.end)
              .trim();
          }

          const typeValue = actionTypeVariables
            .map(statement => statement.declarationList.declarations)
            .filter(
              decl =>
                decl.filter(node => (node.name as ts.Identifier).text === type)
                  .length
            )
            .map(decl => (decl[0].initializer as ts.Identifier).text)[0];

          if (typeValue) {
            let actionName = camelize(clas.name!.text.replace('Action', ''));
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
            inserts.push(new InsertChange(path, sourceFile.end, createAction));
          }
        }
      });

      const replaceChanges = replaceImport(
        sourceFile,
        path,
        '@ngrx/store',
        'Action',
        'createAction'
      );

      return commitChanges(host, sourceFile.fileName, [
        ...replaceChanges,
        ...inserts,
      ]);
    });
}

function getActionsClasses(sourceFile: ts.SourceFile) {
  return sourceFile.statements
    .filter(ts.isClassDeclaration)
    .filter(
      statement => statement.heritageClauses && statement.heritageClauses.length
    )
    .filter(statement => {
      return statement.heritageClauses!.filter(clause => {
        return (clause.types || []).filter(type => {
          return (
            type.expression &&
            (type.expression as ts.Identifier).text === 'Action'
          );
        }).length;
      }).length;
    });
}

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
