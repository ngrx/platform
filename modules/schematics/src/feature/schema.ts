export interface Schema {
  /**
   * The name of the feature.
   */
  name: string;

  /**
   * The path to create the feature.
   */
  path?: string;

  /**
   * The name of the project.
   */
  project?: string;

  /**
   * Flag to indicate if a dir is created.
   */
  flat?: boolean;

  /**
   * When true, does not create test files.
   */
  skipTests?: boolean;

  /**
   * Allows specification of the declaring module.
   */
  module?: string;

  /**
   * Allows specification of the declaring reducers.
   */
  reducers?: string;

  /**
   * Specifies if this is grouped within sub folders
   */
  group?: boolean;

  /**
   * Specifies if api success and failure actions, reducer, and effects
   * should be generated as part of this feature.
   */
  api?: boolean;

  /**
   * Specifies whether to use creator functions for actions, reducers, and effects.
   */
  creators?: boolean;

  prefix?: string;
}
