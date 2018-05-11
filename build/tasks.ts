import { Config, modulesDir } from './config';
import * as util from './util';
import * as fs from 'fs';
import { ncp } from 'ncp';

/**
 *
 * Copies the schematics-core package into any package that provides
 * schematics or migrations
 */
export async function copySchematicsCore(config: Config) {
  (ncp as any).limit = 1;
  for (let pkg of util.getTopLevelPackages(config)) {
    const packageJson = fs
      .readFileSync(`${modulesDir}${pkg}/package.json`)
      .toString('utf-8');
    const pkgConfig = JSON.parse(packageJson);

    if (pkgConfig.schematics || pkgConfig['ng-update'].migrations) {
      ncp(
        `${modulesDir}/schematics-core`,
        `${modulesDir}/${pkg}/schematics-core`,
        function(err: any) {
          if (err) {
            return console.error(err);
          }
        }
      );
    }
  }
}

/**
 * Deploy build artifacts to repos
 */
export async function publishToRepo(config: Config) {
  for (let pkg of util.getTopLevelPackages(config)) {
    const SOURCE_DIR = `./dist/bin/modules/${pkg}/npm_package`;
    const REPO_URL = `git@github.com:ngrx/${pkg}-builds.git`;
    const REPO_DIR = `./tmp/${pkg}`;
    const SHA = await util.git([`rev-parse HEAD`]);
    const SHORT_SHA = await util.git([`rev-parse --short HEAD`]);
    const COMMITTER_USER_NAME = await util.git([
      `--no-pager show -s --format='%cN' HEAD`,
    ]);
    const COMMITTER_USER_EMAIL = await util.git([
      `--no-pager show -s --format='%cE' HEAD`,
    ]);

    await util.cmd('rm -rf', [`${REPO_DIR}`]);
    await util.cmd('mkdir ', [`-p ${REPO_DIR}`]);
    await process.chdir(`${REPO_DIR}`);
    await util.git([`init`]);
    await util.git([`remote add origin ${REPO_URL}`]);
    await util.git(['fetch origin master --depth=1']);
    await util.git(['checkout origin/master']);
    await util.git(['checkout -b master']);
    await process.chdir('../../');
    await util.cmd('rm -rf', [`${REPO_DIR}/*`]);
    await util.git([`log --format="%h %s" -n 1 > ${REPO_DIR}/commit_message`]);
    await util.cmd('cp', [`-R ${SOURCE_DIR}/* ${REPO_DIR}/`]);
    await process.chdir(`${REPO_DIR}`);
    await util.git([`config user.name "${COMMITTER_USER_NAME}"`]);
    await util.git([`config user.email "${COMMITTER_USER_EMAIL}"`]);
    await util.git(['add --all']);
    await util.git([`commit -F commit_message`]);
    await util.cmd('rm', ['commit_message']);
    await util.git(['push origin master --force']);
    await process.chdir('../../');
  }
}
