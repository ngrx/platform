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
  const filter = (name: string) => !name.endsWith('.eslintrc.json');

  for (let pkg of util.getTopLevelPackages(config)) {
    const packageJson = fs
      .readFileSync(`${modulesDir}${pkg}/package.json`)
      .toString('utf-8');
    const pkgConfig = JSON.parse(packageJson);

    if (
      pkgConfig.schematics ||
      (pkgConfig['ng-update'] && pkgConfig['ng-update'].migrations)
    ) {
      ncp(
        `${modulesDir}/schematics-core`,
        `${modulesDir}/${pkg}/schematics-core`,
        { filter },
        function (err: any) {
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
    const SOURCE_DIR = `./dist/modules/${pkg}`;
    const REPO_URL = `git@github.com:ngrx/${pkg}-builds.git`;
    const REPO_DIR = `./tmp/${pkg}`;

    console.log(`Preparing and deploying @ngrx/${pkg} to ${REPO_URL}`);
    await prepareAndPublish(SOURCE_DIR, REPO_URL, REPO_DIR);
  }
}

/**
 * Deploy docs build artifacts
 */
export async function publishDocs() {
  const SOURCE_DIR = `./dist/ngrx.io`;
  const REPO_URL = 'git@github.com:ngrx/ngrx-io-builds.git';
  const REPO_DIR = `./tmp/docs`;

  console.log(`Preparing and deploying docs to ${REPO_URL}`);
  await prepareAndPublish(SOURCE_DIR, REPO_URL, REPO_DIR);
}

export async function prepareAndPublish(
  sourceDir: string,
  repoUrl: string,
  repoDir: string,
  clean = true,
  depth = 1
) {
  const COMMITTER_USER_NAME = await util.git([
    `--no-pager show -s --format='%cN' HEAD`,
  ]);
  const COMMITTER_USER_EMAIL = await util.git([
    `--no-pager show -s --format='%cE' HEAD`,
  ]);

  await util.cmd('rm -rf', [`${repoDir}`]);
  await util.cmd('mkdir ', [`-p ${repoDir}`]);
  await process.chdir(`${repoDir}`);
  await util.git([`init`]);
  await util.git([`remote add origin ${repoUrl}`]);
  await util.git([`fetch origin master${depth ? ` --depth=${depth}` : ''}`]);
  await util.git(['checkout origin/master']);
  await util.git(['checkout -b master']);
  await process.chdir('../../');

  if (clean) {
    await util.cmd('rm -rf', [`${repoDir}/*`]);
  }

  await util.git([`log --format="%h %s" -n 1 > ${repoDir}/commit_message`]);
  await util.cmd('cp', [`-R ${sourceDir}/* ${repoDir}/`]);
  await process.chdir(`${repoDir}`);
  await util.git([`config user.name "${COMMITTER_USER_NAME}"`]);
  await util.git([`config user.email "${COMMITTER_USER_EMAIL}"`]);
  await util.git(['add --all']);
  await util.git([`commit -F commit_message`]);
  await util.cmd('rm', ['commit_message']);

  await util.git(['push origin master --force']);
  await process.chdir('../../');
}
