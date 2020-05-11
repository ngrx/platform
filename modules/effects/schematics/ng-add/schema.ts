export interface Schema {
  name: string;
  skipPackageJson?: boolean;
  path?: string;
  flat?: boolean;
  skipTests?: boolean;
  project?: string;
  module?: string;
  group?: boolean;
  /**
   * Setup root effects module without registering initial effects.
   */
  minimal?: boolean;
}
