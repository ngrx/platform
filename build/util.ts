import * as fs from 'fs';
import * as cp from 'child_process';
import * as glob from 'glob';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import * as rimraf from 'rimraf';
import { Config } from './config';


export function copy(target: string, destination: string) {
  fsExtra.copySync(target, destination);
}

export function remove(target: string) {
  fsExtra.removeSync(target);
}

export function writeFile(target: string, contents: string) {
  fs.writeFileSync(target, contents);
}

export function mkdir(target: string) {
  fs.mkdirSync(target);
}

export function rmdir(target: string) {
  fs.rmdirSync(target);
}

export function getListOfFiles(globPath: string, exclude?: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const options = exclude ? { ignore: exclude } : { };

    glob(globPath, options, (error, matches) => {
      if (error) {
        return reject(error);
      }

      resolve(matches);
    });
  });
}

export function removeRecursively(glob: string) {
  return new Promise((resolve, reject) => {
    rimraf(glob, err => {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

export function exec(command: string, args: string[], base: (command: string) => string = fromNpm): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(base(command) + ' ' + args.join(' '), (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      resolve(stdout.toString());
    });
  });
}

export function cmd(command: string, args: string[]): Promise<string> {
  return exec(command, args, (command: string) => command);
}

export function git(args: string[]): Promise<string> {
  return exec('git', args, (command: string) => command);
}

export async function ignoreErrors<T>(promise: Promise<T>): Promise<T | null> {
  try {
    const result = await promise;
    return result;
  }
  catch (err) {
    return null;
  }
}

export function fromNpm(command: string) {
  return `./node_modules/.bin/${command}`;
}

export function getPackageFilePath(pkg: string, filename: string) {
  return path.resolve(process.cwd(), `./modules/${pkg}/${filename}`);
}

const sorcery = require('sorcery');
export function mapSources(file: string) {
  return new Promise((resolve, reject) => {
    sorcery.load(file)
      .then((chain: any) => {
        chain.write();
        resolve();
      })
      .catch(reject);
  });
}

const ora = require('ora');
async function runTask(name: string, taskFn: () => Promise<any>) {
  const spinner = ora(name);

  try {
    spinner.start();

    await taskFn();

    spinner.succeed();
  } catch (e) {
    spinner.fail();

    throw e;
  }
}

export function createBuilder(tasks: [ string, (config: Config) => Promise<any> ][]) {
  return async function (config: Config) {
    for (let [ name, runner ] of tasks) {
      await runTask(name, () => runner(config));
    }
  };
}
