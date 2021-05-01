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
  const filter = (name: string) =>
    !name.endsWith('BUILD.bazel') && !name.endsWith('.eslintrc.json');

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

/**
 * Deploy docs preview build artifacts
 */
export async function publishDocsPreview() {
  const SOURCE_DIR = './projects/ngrx.io/dist/ngrx.io';
  const REPO_URL = 'git@github.com:ngrx/ngrx-io-previews.git';
  const REPO_DIR = `./tmp/docs-preview`;
  const PR_NUMBER = util.getPrNumber(
    (process.env as any).CIRCLE_PR_NUMBER,
    (process.env as any).CIRCLE_PULL_REQUEST_NUMBER
  );
  const SHORT_SHA = process.env.SHORT_GIT_HASH;
  const owner = process.env.CIRCLE_PROJECT_USERNAME;

  if (PR_NUMBER && owner === 'ngrx') {
    console.log(
      `Preparing and deploying docs preview for pr${PR_NUMBER}-${SHORT_SHA} to ${REPO_URL}`
    );
    await prepareAndPublish(SOURCE_DIR, REPO_URL, REPO_DIR, false, 0);
  } else {
    console.log('No PR number found, skipping preview deployment');
  }
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

export async function postGithubComment() {
  const PR_NUMBER = util.getPrNumber(
    (process.env as any).CIRCLE_PR_NUMBER,
    (process.env as any).CIRCLE_PULL_REQUEST_NUMBER
  );
  const owner = process.env.CIRCLE_PROJECT_USERNAME;

  if (PR_NUMBER && owner === 'ngrx') {
    const SHORT_SHA = process.env.SHORT_GIT_HASH;
    const repo = process.env.CIRCLE_PROJECT_REPONAME;
    const token = process.env.GITHUB_API_KEY;
    const octokit = require('@octokit/rest')();

    octokit.authenticate({ type: 'token', token });

    const comments: { data: any[] } = await octokit.issues.getComments({
      owner,
      repo,
      number: PR_NUMBER,
    });

    const ngrxBotComment = comments.data
      .filter((comment) => comment.user.login === 'ngrxbot')
      .pop();

    const body = `Preview docs changes for ${SHORT_SHA} at https://previews.ngrx.io/pr${PR_NUMBER}-${SHORT_SHA}/`;

    if (ngrxBotComment) {
      await octokit.issues.editComment({
        owner,
        repo,
        comment_id: ngrxBotComment.id,
        body,
      });
    } else {
      await octokit.issues.createComment({
        owner,
        repo,
        number: PR_NUMBER,
        body,
      });
    }
  }
}

export async function cleanupDocsPreviews() {
  const repoUrl = 'git@github.com:ngrx/ngrx-io-previews.git';
  const repoDir = `./tmp/docs-preview-cleanup`;
  const token = process.env.GITHUB_API_KEY;
  const octokit = require('@octokit/rest')();

  octokit.authenticate({ type: 'token', token });

  const q = 'repo:ngrx/platform is:pr is:closed';

  const { data }: { data: { items: any[] } } = await octokit.search.issues({
    q,
    per_page: 100,
  });

  await util.cmd('rm -rf', [`${repoDir}`]);
  await util.cmd('mkdir ', [`-p ${repoDir}`]);
  await process.chdir(`${repoDir}`);
  await util.git([`init`]);
  await util.git([`remote add origin ${repoUrl}`]);
  await util.git([`fetch origin master --depth=1`]);
  await util.git(['checkout origin/master -b master']);

  const prsToRemove = data.items.reduce(
    (prev: string[], curr: { number: number }) => {
      prev.push(`pr${curr.number}*`);

      return prev;
    },
    []
  );

  await util.cmd('rm -rf', [`${prsToRemove.join(' ')}`]);
  await util.git([`config user.name "ngrxbot"`]);
  await util.git([`config user.email "${process.env.GITHUB_BOT_EMAIL}"`]);
  await util.git(['add --all']);

  try {
    await util.git([
      `commit -m "chore: cleanup previews for closed pull requests"`,
    ]);
  } catch (e) {}

  await util.git(['push origin master --force']);
}
