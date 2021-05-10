export interface Schema {
  skipPackageJson?: boolean;
  path?: string;
  project?: string;
  module?: string;
  statePath?: string;
  stateInterface?: string;
  /**
   * Setup state management without registering initial reducers.
   */
  minimal?: boolean;
  skipESLintPlugin?: boolean;
}
