import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { experimental } from '@angular-devkit/core';

// The interfaces below are generated from the Angular CLI configuration schema
// https://github.com/angular/angular-cli/blob/master/packages/@angular/cli/lib/config/schema.json
export interface AppConfig {
  /**
   * Name of the app.
   */
  name?: string;
  /**
   * Directory where app files are placed.
   */
  appRoot?: string;
  /**
   * The root directory of the app.
   */
  root?: string;
  /**
   * The output directory for build results.
   */
  outDir?: string;
  /**
   * List of application assets.
   */
  assets?: (
    | string
    | {
        /**
         * The pattern to match.
         */
        glob?: string;
        /**
         * The dir to search within.
         */
        input?: string;
        /**
         * The output path (relative to the outDir).
         */
        output?: string;
      })[];
  /**
   * URL where files will be deployed.
   */
  deployUrl?: string;
  /**
   * Base url for the application being built.
   */
  baseHref?: string;
  /**
   * The runtime platform of the app.
   */
  platform?: 'browser' | 'server';
  /**
   * The name of the start HTML file.
   */
  index?: string;
  /**
   * The name of the main entry-point file.
   */
  main?: string;
  /**
   * The name of the polyfills file.
   */
  polyfills?: string;
  /**
   * The name of the test entry-point file.
   */
  test?: string;
  /**
   * The name of the TypeScript configuration file.
   */
  tsconfig?: string;
  /**
   * The name of the TypeScript configuration file for unit tests.
   */
  testTsconfig?: string;
  /**
   * The prefix to apply to generated selectors.
   */
  prefix?: string;
  /**
   * Experimental support for a service worker from @angular/service-worker.
   */
  serviceWorker?: boolean;
  /**
   * Global styles to be included in the build.
   */
  styles?: (
    | string
    | {
        input?: string;
        [name: string]: any; // tslint:disable-line:no-any
      })[];
  /**
   * Options to pass to style preprocessors
   */
  stylePreprocessorOptions?: {
    /**
     * Paths to include. Paths will be resolved to project root.
     */
    includePaths?: string[];
  };
  /**
   * Global scripts to be included in the build.
   */
  scripts?: (
    | string
    | {
        input: string;
        [name: string]: any; // tslint:disable-line:no-any
      })[];
  /**
   * Source file for environment config.
   */
  environmentSource?: string;
  /**
   * Name and corresponding file for environment config.
   */
  environments?: {
    [name: string]: any; // tslint:disable-line:no-any
  };
  appShell?: {
    app: string;
    route: string;
  };
}

export type WorkspaceSchema = experimental.workspace.WorkspaceSchema;

export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  return path;
}

export function getWorkspace(host: Tree): WorkspaceSchema {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const config = configBuffer.toString();

  return JSON.parse(config);
}
