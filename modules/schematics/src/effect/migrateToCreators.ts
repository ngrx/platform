import * as ts from 'typescript';
import { SchematicContext, Tree, Rule } from '@angular-devkit/schematics';
import {
  createChangeRecorder,
  InsertChange,
  RemoveChange,
  replaceImport,
} from '@ngrx/schematics/schematics-core';
import { Path } from '@angular-devkit/core';

export function migrateToCreators(host: Tree, context: SchematicContext) {
  return host.visit(path => {
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

    if (path !== '/some.effects.ts') return;

    const effectsPerClass = sourceFile.statements
      .filter(ts.isClassDeclaration)
      .map(clazz =>
        clazz.members
          .filter(ts.isPropertyDeclaration)
          .filter(
            property =>
              property.decorators && property.decorators.some(isEffectDecorator)
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

    const recorder = createChangeRecorder(host, path, [
      ...importChanges,
      ...createEffectsChanges,
    ]);
    host.commitUpdate(recorder);
    return host;
  });
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
    .map(decorators =>
      (decorators || []).filter(isEffectDecorator).map(decorator => {
        return new RemoveChange(
          path,
          decorator.expression.pos - 1, // also get the @ sign
          decorator.expression.end
        );
      })
    )
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
