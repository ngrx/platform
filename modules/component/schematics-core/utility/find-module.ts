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

export interface ModuleOptions {
  module?: string;
  name: string;
  flat?: boolean;
  path?: string;
  skipImport?: boolean;
}

/**
 * Find the module referred by a set of options passed to the schematics.
 */
export function findModuleFromOptions(
  host: Tree,
  options: ModuleOptions
): Path | undefined {
  if (options.hasOwnProperty('skipImport') && options.skipImport) {
    return undefined;
  }

  if (!options.module) {
    const pathToCheck =
      (options.path || '') +
      (options.flat ? '' : '/' + strings.dasherize(options.name));

    return normalize(findModule(host, pathToCheck));
  } else {
    const modulePath = normalize('/' + options.path + '/' + options.module);
    const moduleBaseName = normalize(modulePath).split('/').pop();

    if (host.exists(modulePath)) {
      return normalize(modulePath);
    } else if (host.exists(modulePath + '.ts')) {
      return normalize(modulePath + '.ts');
    } else if (host.exists(modulePath + '.module.ts')) {
      return normalize(modulePath + '.module.ts');
    } else if (host.exists(modulePath + '/' + moduleBaseName + '.module.ts')) {
      return normalize(modulePath + '/' + moduleBaseName + '.module.ts');
    } else {
      throw new Error(`Specified module path ${modulePath} does not exist`);
    }
  }
}

/**
 * Function to find the "closest" module to a generated file's path.
 */
export function findModule(host: Tree, generateDir: string): Path {
  let dir: DirEntry | null = host.getDir('/' + generateDir);

  const moduleRe = /\.module\.ts$/;
  const routingModuleRe = /-routing\.module\.ts/;

  while (dir) {
    const matches = dir.subfiles.filter(
      (p) => moduleRe.test(p) && !routingModuleRe.test(p)
    );

    if (matches.length == 1) {
      return join(dir.path, matches[0]);
    } else if (matches.length > 1) {
      throw new Error(
        'More than one module matches. Use skip-import option to skip importing ' +
          'the component into the closest module.'
      );
    }

    dir = dir.parent;
  }

  throw new Error(
    'Could not find an NgModule. Use the skip-import ' +
      'option to skip importing in NgModule.'
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
