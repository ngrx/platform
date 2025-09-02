import * as path from 'node:path';
import * as cp from 'child_process';
import ora from 'ora';
import { Config } from './config';

export type RunnerFn = (config: Config) => Promise<any>;
export type TaskDef = [string, RunnerFn];
export type BaseFn = (command: string) => string;

export function createBuilder(tasks: TaskDef[]) {
  return async function (config: Config) {
    for (const [name, runner] of tasks) {
      await runTask(name, () => runner(config));
    }
  };
}

export function exec(
  command: string,
  args: string[],
  base: BaseFn = fromNpm
): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(base(command) + ' ' + args.join(' '), (err, stdout) => {
      if (err) {
        return reject(err);
      }

      resolve(stdout.toString());
    });
  });
}

export function getTopLevelPackages(config: Config) {
  return config.packages.map((packageDescription) => packageDescription.name);
}

export function cmd(command: string, args: string[]): Promise<string> {
  return exec(command, args, (command: string) => command);
}

export function git(args: string[]): Promise<string> {
  return cmd('git', args);
}

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

function baseDir(...dirs: string[]): string {
  return `"${path.resolve(__dirname, '../', ...dirs)}"`;
}

function fromNpm(command: string) {
  return baseDir(`./node_modules/.bin/${command}`);
}
