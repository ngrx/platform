import { Config } from './config';
import * as util from './util';


/**
 * Cleans the top level dist folder. All npm-ready packages are created
 * in the dist folder.
 */
export async function removeDistFolder(config: Config) {
  const args = [
    './dist'
  ];

  return await util.exec('rimraf', args);
}


/**
 * Uses the 'tsconfig-build.json' file in each package directory to produce
 * AOT and Closure compatible JavaScript
 */
export async function compilePackagesWithNgc(config: Config) {
  for (let pkg of config.packages) {
    await util.exec('ngc', [
      `-p ./modules/${pkg}/tsconfig-build.json`
    ]);

    const entryTypeDefinition = `export * from './${pkg}/index';`;
    const entryMetadata = `{"__symbolic":"module","version":3,"metadata":{},"exports":[{"from":"./${pkg}/index"}]}`;

    util.writeFile(`./dist/packages/${pkg}.d.ts`, entryTypeDefinition);
    util.writeFile(`./dist/packages/${pkg}.metadata.json`, entryMetadata);
  }
}


/**
 * Uses Rollup to bundle the JavaScript into a single flat file called
 * a FESM (Flat Ecma Script Module)
 */
export async function bundleFesms(config: Config) {
  for (let pkg of config.packages) {
    await util.exec('rollup', [
      `-i ./dist/packages/${pkg}/index.js`,
      `-o ./dist/${pkg}/${config.scope}/${pkg}.js`,
      `--sourcemap`,
    ]);

    await util.mapSources(`./dist/${pkg}/${config.scope}/${pkg}.js`);
  }
}


/**
 * Copies each FESM into a TS file then uses TypeScript to downlevel
 * the FESM into ES5 with ESM modules
 */
export async function downLevelFesmsToES5(config: Config) {
  const tscArgs = [
    '--target es5',
    '--module es2015',
    '--noLib',
    '--sourceMap',
  ];

  for (let pkg of config.packages) {
    const file = `./dist/${pkg}/${config.scope}/${pkg}.js`;
    const target = `./dist/${pkg}/${config.scope}/${pkg}.es5.ts`;

    util.copy(file, target);

    await util.ignoreErrors(util.exec('tsc', [ target, ...tscArgs ]));
    await util.mapSources(target.replace('.ts', '.js'));
  }

  await util.removeRecursively(`./dist/?(${config.packages.join('|')})/${config.scope}/*.ts`);
}


/**
 * Re-runs Rollup on the downleveled ES5 to produce a UMD bundle
 */
export async function createUmdBundles(config: Config) {
  for (let pkg of config.packages) {
    const rollupArgs = [
      `-c ./modules/${pkg}/rollup.config.js`,
      `--sourcemap`,
    ];

    await util.exec('rollup', rollupArgs);
    await util.mapSources(`./dist/${pkg}/bundles/${pkg}.umd.js`);
  }
}


/**
 * Removes any leftover TypeScript files from previous compilation steps,
 * leaving any type definition files in place
 */
export async function cleanTypeScriptFiles(config: Config) {
  const tsFilesGlob = './dist/packages/**/*.js';
  const dtsFilesFlob = './dist/packages/**/*.d.ts';
  const filesToRemove = await util.getListOfFiles(tsFilesGlob, dtsFilesFlob);

  for (let file of filesToRemove) {
    util.remove(file);
  }
}


/**
 * Renames the index files in each package to the name
 * of the package.
 */
export async function renamePackageEntryFiles(config: Config) {
  for (let pkg of config.packages) {
    const files = await util.getListOfFiles(`./dist/packages/${pkg}/index.**`);

    for (let file of files) {
      const target = file.replace('index', pkg);
      util.copy(file, target);
      util.remove(file);
    }
  }
}


/**
 * Removes any remaining source map files from running NGC
 */
export async function removeRemainingSourceMapFiles(config: Config) {
  await util.removeRecursively(`./dist/packages/?(${config.packages.join('|')})/**/*.map`);
}


/**
 * Copies the type definition files and NGC metadata files to
 * the root of the distribution
 */
export async function copyTypeDefinitionFiles(config: Config) {
  const files = await util.getListOfFiles(`./dist/packages/?(${config.packages.join('|')})/**/*`);

  for (let file of files) {
    const target = file.replace('packages/', '');
    util.copy(file, target);
  }

  await util.removeRecursively(`./dist/packages/?(${config.packages.join('|')})`);
}


/**
 * Creates minified copies of each UMD bundle
 */
export async function minifyUmdBundles(config: Config) {
  const uglifyArgs = [
    '-c',
    '--screw-ie8',
    '--comments',
  ];

  for (let pkg of config.packages) {
    const file = `./dist/${pkg}/bundles/${pkg}.umd.js`;
    const out = `./dist/${pkg}/bundles/${pkg}.umd.min.js`;

    await util.exec('uglifyjs', [
      ...uglifyArgs,
      `-o ${out}`,
      `--source-map ${out}.map`,
      `--source-map-include-sources ${file}`,
      `--in-source-map ${file}.map`
    ]);
  }
}


/**
 * Copies the README.md, LICENSE, and package.json files into
 * each package
 */
export async function copyPackageDocs(config: Config) {
  for (let pkg of config.packages) {
    const source = `./modules/${pkg}`;
    const target = `./dist/${pkg}`;

    util.copy(`${source}/package.json`, `${target}/package.json`);
    util.copy(`${source}/README.md`, `${target}/README.md`);
    util.copy('./LICENSE', `${target}/LICENSE`);
  }
}


/**
 * Removes the packages folder
 */
export async function removePackagesFolder(config: Config) {
  await util.removeRecursively('./dist/packages');
}


/**
 * Deploy build artifacts to repos
 */
export async function publishToRepo(config: Config) {
  for(let pkg of config.packages) {
    const SOURCE_DIR = `./dist/${pkg}`;
    const REPO_URL = `git@github.com:ngrx/${pkg}-builds.git`;
    const REPO_DIR = `./tmp/${pkg}`;
    const SHA = await util.git([`rev-parse HEAD`]);
    const SHORT_SHA = await util.git([`rev-parse --short HEAD`]);
    const COMMIT_MSG = await util.git([`log --oneline -1`]);
    const COMMITTER_USER_NAME = await util.git([`--no-pager show -s --format='%cN' HEAD`]);
    const COMMITTER_USER_EMAIL = await util.git([`--no-pager show -s --format='%cE' HEAD`]);

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
    await util.cmd('cp', [`-R ${SOURCE_DIR}/* ${REPO_DIR}/`]);
    await process.chdir(`${REPO_DIR}`);
    await util.git([`config user.name "${COMMITTER_USER_NAME}"`]);
    await util.git([`config user.email "${COMMITTER_USER_EMAIL}"`]);
    await util.git(['add --all']);
    await util.git([`commit -m "${COMMIT_MSG}"`]);
    await util.git(['push origin master --force']);
    await process.chdir('../../');
  }
}
