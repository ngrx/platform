export interface Schema {
  name: string;
  skipPackageJson?: boolean;
  path?: string;
  flat?: boolean;
  /** @deprecated renamed to skipTests, use skipTests instead */
  skipTest?: boolean;
  skipTests?: boolean;
  project?: string;
  module?: string;
  group?: boolean;
  /**
   * Setup root effects module without registering initial effects.
   */
  minimal?: boolean;
}
