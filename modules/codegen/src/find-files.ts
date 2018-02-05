import * as path from 'path';
const glob = require('glob');

export function findFiles(globPattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(
      globPattern,
      { cwd: process.cwd(), ignore: ['**/node_modules/**'] },
      (error: any, files: string[]) => {
        if (error) {
          return reject(error);
        }

        resolve(files);
      }
    );
  });
}
