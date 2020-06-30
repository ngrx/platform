export interface Schema {
  /**
   * The name of the selector.
   */
  name: string;

  /**
   * The path to create the selector.
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
   * Specifies if this is grouped within a feature
   */
  feature?: boolean;

  /**
   * Specifies if this is grouped within an 'selectors' folder
   */
  group?: boolean;
}
