import * as ts from 'typescript';
import { Path } from '@angular-devkit/core';
import { Tree, Rule, chain } from '@angular-devkit/schematics';
import {
  InsertChange,
  RemoveChange,
  replaceImport,
  commitChanges,
} from '@ngrx/schematics/schematics-core';

export function migrateToCreators(): Rule {
  return (host: Tree) =>
    host.visit((path) => {
      if (!path.endsWith('.ts')) {
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

      const createEffectsChanges = replaceEffectDecorators(host, path, effects);
      const importChanges = replaceImport(
        sourceFile,
        path,
        '@ngrx/effects',
        'Effect',
        'createEffect'
      );

      return commitChanges(host, sourceFile.fileName, [
        ...importChanges,
        ...createEffectsChanges,
      ]);
    });
}

function replaceEffectDecorators(
  host: Tree,
  path: Path,
  effects: ts.PropertyDeclaration[]
) {
  const inserts = effects
    .filter((effect) => !!effect.initializer)
    .map((effect) => {
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
    .map((effect) => effect.decorators)
    .filter((decorators) => decorators)
    .map((decorators) => {
      const effectDecorators = decorators!.filter(isEffectDecorator);
      return effectDecorators.map((decorator) => {
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

export default function (): Rule {
  return chain([migrateToCreators()]);
}
