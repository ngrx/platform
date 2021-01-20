/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Path,
  join,
  normalize,
  relative,
  strings,
  basename,
  extname,
  dirname,
} from '@angular-devkit/core';
import { DirEntry, Tree } from '@angular-devkit/schematics';

export interface ComponentOptions {
  component?: string;
  name: string;
  flat?: boolean;
  path?: string;
  skipImport?: boolean;
}

/**
 * Find the component referred by a set of options passed to the schematics.
 */
export function findComponentFromOptions(
  host: Tree,
  options: ComponentOptions
): Path | undefined {
  if (options.hasOwnProperty('skipImport') && options.skipImport) {
    return undefined;
  }

  if (!options.component) {
    const pathToCheck =
      (options.path || '') +
      (options.flat ? '' : '/' + strings.dasherize(options.name));

    return normalize(findComponent(host, pathToCheck));
  } else {
    const componentPath = normalize(
      '/' + options.path + '/' + options.component
    );
    const componentBaseName = normalize(componentPath).split('/').pop();

    if (host.exists(componentPath)) {
      return normalize(componentPath);
    } else if (host.exists(componentPath + '.ts')) {
      return normalize(componentPath + '.ts');
    } else if (host.exists(componentPath + '.component.ts')) {
      return normalize(componentPath + '.component.ts');
    } else if (
      host.exists(componentPath + '/' + componentBaseName + '.component.ts')
    ) {
      return normalize(
        componentPath + '/' + componentBaseName + '.component.ts'
      );
    } else {
      throw new Error(
        `Specified component path ${componentPath} does not exist`
      );
    }
  }
}

/**
 * Function to find the "closest" component to a generated file's path.
 */
export function findComponent(host: Tree, generateDir: string): Path {
  let dir: DirEntry | null = host.getDir('/' + generateDir);

  const componentRe = /\.component\.ts$/;

  while (dir) {
    const matches = dir.subfiles.filter((p) => componentRe.test(p));

    if (matches.length == 1) {
      return join(dir.path, matches[0]);
    } else if (matches.length > 1) {
      throw new Error(
        'More than one component matches. Use skip-import option to skip importing ' +
          'the component store into the closest component.'
      );
    }

    dir = dir.parent;
  }

  throw new Error(
    'Could not find an Component. Use the skip-import ' +
      'option to skip importing in Component.'
  );
}

/**
 * Build a relative path from one file path to another file path.
 */
export function buildRelativePath(from: string, to: string): string {
  const {
    path: fromPath,
    filename: fromFileName,
    directory: fromDirectory,
  } = parsePath(from);
  const {
    path: toPath,
    filename: toFileName,
    directory: toDirectory,
  } = parsePath(to);
  const relativePath = relative(fromDirectory, toDirectory);
  const fixedRelativePath = relativePath.startsWith('.')
    ? relativePath
    : `./${relativePath}`;

  return !toFileName || toFileName === 'index.ts'
    ? fixedRelativePath
    : `${
        fixedRelativePath.endsWith('/')
          ? fixedRelativePath
          : fixedRelativePath + '/'
      }${convertToTypeScriptFileName(toFileName)}`;
}

function parsePath(path: string) {
  const pathNormalized = normalize(path) as Path;
  const filename = extname(pathNormalized) ? basename(pathNormalized) : '';
  const directory = filename ? dirname(pathNormalized) : pathNormalized;
  return {
    path: pathNormalized,
    filename,
    directory,
  };
}
/**
 * Strips the typescript extension and clears index filenames
 * foo.ts -> foo
 * index.ts -> empty
 */
function convertToTypeScriptFileName(filename: string | undefined) {
  return filename ? filename.replace(/(\.ts)|(index\.ts)$/, '') : '';
}
