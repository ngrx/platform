import { createBuilder } from './util';
import { packages } from './config';
import * as shelljs from 'shelljs';
import { readFileSync } from 'fs-extra';

/**
 * Publish release to NPM on "latest" tag
 */
export async function publishLatestToNpm() {
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
      '--tag=latest',
    ];

    shelljs.exec(cmd.join(' '));
  }
}

const publishLatest = createBuilder([
  ['Publish packages on latest\n', publishLatestToNpm],
]);

publishLatest({
  scope: '@ngrx',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
