import * as ts from 'typescript';
import {
  Rule,
  chain,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  commitChanges,
  InsertChange,
  visitNgModuleImports,
  insertImport,
  Change,
  containsProperty,
} from '../../schematics-core';

function addDefaultSerializer(): Rule {
  const SERIALIZER_PROPERTY = 'serializer: DefaultRouterStateSerializer';
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: Change[] = [];

      visitNgModuleImports(sourceFile, (importsNode, elementsNode) => {
        elementsNode
          .filter(
            (element) =>
              ts.isCallExpression(element) &&
              ts.isPropertyAccessExpression(element.expression) &&
              ts.isIdentifier(element.expression.expression) &&
              element.expression.expression.text ===
                'StoreRouterConnectingModule'
          )
          .forEach((element) => {
            const callExpression = element as ts.CallExpression;
            const callArgument = callExpression.arguments[0];

            // StoreRouterConnectingModule.forRoot() without arguments
            if (callArgument === undefined) {
              changes.push(
                new InsertChange(
                  sourceFile.fileName,
                  callExpression.getEnd() - 1,
                  `{ ${SERIALIZER_PROPERTY} }`
                )
              );
            } else if (ts.isObjectLiteralExpression(callArgument)) {
              // StoreRouterConnectingModule.forRoot({ key: 'router' }) with arguments
              const serializerSet = containsProperty(
                callArgument,
                'serializer'
              );
              const routerStateSet = containsProperty(
                callArgument,
                'routerState'
              );

              if (serializerSet || routerStateSet) {
                return;
              }

              changes.push(
                new InsertChange(
                  sourceFile.fileName,
                  callArgument.getStart() + 1,
                  ` ${SERIALIZER_PROPERTY},`
                )
              );
            }
          });
      });

      if (changes.length) {
        changes.push(
          insertImport(
            sourceFile,
            sourceFile.fileName,
            'DefaultRouterStateSerializer',
            '@ngrx/router-store'
          )
        );
      }

      commitChanges(tree, sourceFile.fileName, changes);

      if (changes.length) {
        ctx.logger.info(
          `[@ngrx/router-store] Updated StoreRouterConnectingModule's configuration, see the migration guide (https://ngrx.io/guide/migration/v9#ngrxrouter-store) for more info`
        );
      }
    });
  };
}

export default function (): Rule {
  return chain([addDefaultSerializer()]);
}
