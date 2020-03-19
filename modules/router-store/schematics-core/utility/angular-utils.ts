import {
  JsonParseMode,
  dirname,
  normalize,
  parseJsonAst,
  resolve,
} from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { findPropertyInAstObject } from './json-utilts';

// https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/migrations/update-9/utils.ts
export function isIvyEnabled(tree: Tree, tsConfigPath: string): boolean {
  // In version 9, Ivy is turned on by default
  // Ivy is opted out only when 'enableIvy' is set to false.

  const buffer = tree.read(tsConfigPath);
  if (!buffer) {
    return true;
  }

  const tsCfgAst = parseJsonAst(buffer.toString(), JsonParseMode.Loose);

  if (tsCfgAst.kind !== 'object') {
    return true;
  }

  const ngCompilerOptions = findPropertyInAstObject(
    tsCfgAst,
    'angularCompilerOptions'
  );
  if (ngCompilerOptions && ngCompilerOptions.kind === 'object') {
    const enableIvy = findPropertyInAstObject(ngCompilerOptions, 'enableIvy');

    if (enableIvy) {
      return !!enableIvy.value;
    }
  }

  const configExtends = findPropertyInAstObject(tsCfgAst, 'extends');
  if (configExtends && configExtends.kind === 'string') {
    const extendedTsConfigPath = resolve(
      dirname(normalize(tsConfigPath)),
      normalize(configExtends.value)
    );

    return isIvyEnabled(tree, extendedTsConfigPath);
  }

  return true;
}
