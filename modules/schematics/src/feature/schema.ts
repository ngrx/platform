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
   * Specifies if a spec file is generated.
   */
  spec?: boolean;

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
}
