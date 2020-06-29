export interface Schema {
  /**
   * The name of the component.
   */
  name: string;

  /**
   * The path to create the component.
   */
  path?: string;

  /**
   * The name of the project.
   */
  project?: string;

  /**
   * When true, does not create test files.
   */
  skipTests?: boolean;

  /**
   * Flag to indicate if a dir is created.
   */

  flat?: boolean;

  /**
   * Group entity metadata files within 'data' folder
   */
  group?: boolean;
}
