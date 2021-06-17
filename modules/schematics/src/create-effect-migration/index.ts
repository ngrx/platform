import * as ts from 'typescript';
import { Path } from '@angular-devkit/core';
import { Tree, Rule, chain } from '@angular-devkit/schematics';
import {
  InsertChange,
  RemoveChange,
  replaceImport,
  commitChanges,
  visitTSSourceFiles,
} from '../../schematics-core';

export function migrateToCreators(): Rule {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const effectsPerClass = sourceFile.statements
        .filter(ts.isClassDeclaration)
        .map((clas) =>
          clas.members
            .filter(ts.isPropertyDeclaration)
            .filter(
              (property) =>
                property.decorators &&
                property.decorators.some(isEffectDecorator)
            )
        );

      const effects = effectsPerClass.reduce(
        (acc, effects) => acc.concat(effects),
        []
      );

      const createEffectsChanges = replaceEffectDecorators(
        tree,
        sourceFile,
        effects
      );
      const importChanges = replaceImport(
        sourceFile,
        sourceFile.fileName as Path,
        '@ngrx/effects',
        'Effect',
        'createEffect'
      );

      commitChanges(tree, sourceFile.fileName, [
        ...importChanges,
        ...createEffectsChanges,
      ]);
    });
  };
}

function replaceEffectDecorators(
  host: Tree,
  sourceFile: ts.SourceFile,
  effects: ts.PropertyDeclaration[]
) {
  const inserts = effects
    .filter((effect) => !!effect.initializer)
    .map((effect) => {
      if (!effect.initializer) {
        return [];
      }
      const decorator = (effect.decorators || []).find(isEffectDecorator);
      if (!decorator) {
        return [];
      }
      const effectArguments = getDispatchProperties(
        host,
        sourceFile.text,
        decorator
      );
      const end = effectArguments ? `, ${effectArguments})` : ')';

      return [
        new InsertChange(
          sourceFile.fileName,
          effect.initializer.pos,
          ' createEffect(() =>'
        ),
        new InsertChange(sourceFile.fileName, effect.initializer.end, end),
      ];
    })
    .reduce((acc, inserts) => acc.concat(inserts), []);

  const removes = effects
    .map((effect) => effect.decorators)
    .map((decorators) => {
      if (!decorators) {
        return [];
      }
      const effectDecorators = decorators.filter(isEffectDecorator);
      return effectDecorators.map((decorator) => {
        return new RemoveChange(
          sourceFile.fileName,
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
  fileContent: string,
  decorator: ts.Decorator
) {
  if (!decorator.expression || !ts.isCallExpression(decorator.expression)) {
    return '';
  }

  // just copy the effect properties
  const args = fileContent
    .substring(
      decorator.expression.arguments.pos,
      decorator.expression.arguments.end
    )
    .trim();
  return args;
}

export default function (): Rule {
  return chain([migrateToCreators()]);
}
