import { createBuilder } from './util';
import { packages } from './config';
import * as shelljs from 'shelljs';
import { readFileSync } from 'fs-extra';

/**
 * Publish release to NPM on "next" tag
 */
export async function publishNextToNpm() {
  const configJSON = JSON.parse(readFileSync('./angular.json').toString());
  const projects = configJSON.projects;
  const publishablePackages = Object.keys(projects).filter(
    (project) => !!projects[project].architect['build-package']
  );

  for (let pkg of publishablePackages) {
    console.log(`Publishing @ngrx/${pkg}`);

    const cmd = [
      'npm publish',
      `./dist/modules/${pkg}`,
      '--access=public',
      '--tag=next',
    ];

    shelljs.exec(cmd.join(' '));
  }
}

const publishNext = createBuilder([
  ['Publish packages on next\n', publishNextToNpm],
]);

publishNext({
  scope: '@ngrx',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
