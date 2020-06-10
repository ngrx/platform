import * as globby from 'globby';
import * as fs from 'fs';
import { packages as ngrxPackages } from './config';

const EXAMPLE_FILES = [
  '!**',
  'angular.json',
  'projects/example-app/**/*.*',
  '!projects/example-app/coverage/**/*.*',
  '!projects/example-app/dist/**/*.*',
  '!**/*.spec.ts',
  '!**/*.snap',
  '!**/*.js',
  '!**/README.md',
];

(async () => {
  const paths = await globby(EXAMPLE_FILES, { ignore: ['**/node_modules/**'] });

  const files = paths.reduce((files, filePath) => {
    const contents = fs.readFileSync(filePath, 'utf-8');

    return { ...files, [filePath]: contents };
  }, {});

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const dependencies = packageJson.dependencies;
  const version = packageJson.version;
  const ngrxDependencies = ngrxPackages
    .map((pkg) => pkg.name)
    .reduce((packages, packageName) => {
      return { ...packages, [`@ngrx/${packageName}`]: version };
    }, {});

  const template = `
    <html>
    <head>
      <script src="https://unpkg.com/@stackblitz/sdk/bundles/sdk.umd.js"></script>
    </head>
    <body>
    <script>
      const project = {
        files: ${JSON.stringify(files)
          .replace(/\\r\\n/g, '')
          .replace(/\\n/g, '')},
        title: 'NgRx Example App',
        description: 'NgRx example application with common patterns and best practices',
        template: 'angular-cli',
        tags: ['angular', 'ngrx', 'redux', 'example'],
        dependencies: ${JSON.stringify({
          ...dependencies,
          ...ngrxDependencies,
        })}
      };

      StackBlitzSDK.openProject(project, { newWindow: false });
    </script>
    </body>
    </html>
  `;

  fs.writeFileSync('stackblitz.html', template, 'utf-8');
})();
