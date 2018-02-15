// patch https://github.com/ReactiveX/rxjs/pull/3322
const replace = require('replace-in-file');

try {
  console.log('Patch in rxjs/pull/3322 until next release...');
  const replacements = [];
  replacements.push(...replace.sync({
    files: ['node_modules/rxjs/src/BUILD.bazel'],
    from: 'tsconfig =',
    // Replace with an extra space before = so it doesn't get applied more than once
    to: `node_modules = "@build_bazel_rules_typescript_tsc_wrapped_deps//:node_modules",
    tsconfig  =`
  }));
  replacements.push(...replace.sync({
    files: ['node_modules/rxjs/src/tsconfig.json'],
    from: '"files":',
    // Replace with an extra space before : so it doesn't get applied more than once
    to: `"bazelOptions": {
      "suppressTsconfigOverrideWarnings": true
    },
    "files" :`
  }));
  console.log(`    Modified files: ${JSON.stringify(replacements)}`);
} catch (error) {
  console.error('Error occurred:', error);
}