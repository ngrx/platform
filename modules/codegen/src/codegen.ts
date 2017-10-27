import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { collectMetadata, printActionFactory } from './collect-metadata';
import { findFiles } from './find-files';
const ora = require('ora');

async function readFile(file: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(file, 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

async function writeFile(file: string, contents: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, contents, { encoding: 'utf8' }, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function createSourceFile(data: string) {
  return ts.createSourceFile('', data, ts.ScriptTarget.ES2015, true);
}

export async function codegen(glob: string) {
  const filesIndicator = ora(`Searching for files matching "${glob}"`).start();
  const files = await findFiles(glob);
  filesIndicator.succeed(`Found ${files.length} files for pattern "${glob}"`);

  for (let file of files) {
    const indicator = ora(file).start();

    try {
      const parsedPath = path.parse(file);
      const contents = await readFile(file);
      const sourceFile = createSourceFile(contents);
      const ast = collectMetadata(parsedPath.name, sourceFile);

      if (!ast) {
        throw new Error(`No actions found for file "${file}"`);
      }

      const output = printActionFactory(ast);
      const target = path.resolve(
        parsedPath.dir,
        `./${parsedPath.name}.helpers.ts`
      );
      await writeFile(target, output);

      indicator.succeed(`Found ${ast.length} actions in ${file}`);
    } catch (e) {
      indicator.fail((e as Error).message);
    }
  }
}
