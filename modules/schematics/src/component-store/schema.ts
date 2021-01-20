export interface Schema {
  /**
   * The name of the component store.
   */
  name: string;

  /**
   * The path to create the component store.
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
   * Allows specification of the declaring component.
   */
  component?: string;

  /**
   * Allows specification of the declaring module.
   */
  module?: string;
}
