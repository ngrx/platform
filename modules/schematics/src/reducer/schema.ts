export interface Schema {
  /**
   * The name of the component.
   */
  name: string;

  /**
   * The path to create the effect.
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
   * Specifies if this is grouped within a feature
   */
  feature?: boolean;

  /**
   * Specifies if api success and failure actions
   * should be added to the reducer.
   */
  api?: boolean;

  /**
   * Specifies whether to use creator functions for
   * handling actions and reducers.
   */
  creators?: boolean;
}
